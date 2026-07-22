# Monster Spawns

A **Monster Spawn** is a zone-based, recurring monster generator — distinct from a hand-placed "Make" monster (`-createMonster`, `-createMonsterMultiPatrols`, `-createMonsterTeleport`, …, in `src/core/05_MAKE_STRUCTURES/Make_create_monsters/`). Where hand-placed monsters use one of the movement-strategy classes in `src/core/04_STRUCTURES/Monster/` (`MonsterSimplePatrol`, `MonsterMultiplePatrols`, `MonsterTeleport`, `MonsterNoMove`), **a Monster Spawn does not use any of those classes**. It periodically creates plain "immobile" monster units (`NewImmobileMonster`, `src/core/04_STRUCTURES/Monster/Monster_functions.ts`) and manually issues a single move order across its zone via `IssueMoveOrderForLongDistance`. This is a common point of confusion when reading the `Monster/` directory — spawn movement logic actually lives under `MonsterSpawn/` and `Region/`, not `Monster/`.

Core files:
- `src/core/04_STRUCTURES/MonsterSpawn/MonsterSpawn.ts` — the class itself.
- `src/core/04_STRUCTURES/MonsterSpawn/MonsterSpawnArray.ts` — per-`Level` collection, JSON (de)serialization.
- `src/core/04_STRUCTURES/MonsterSpawn/SimpleUnitRecycler.ts` — per-spawn unit-handle pool.
- `src/core/04_STRUCTURES/Monster/LongDistanceMoveOrder.ts` — waypoint-splitting movement, shared with other long-distance moves.
- `src/core/06_COMMANDS/Commands/4_make_spawns.ts` — the full `-...MonsterSpawn...` chat-command surface.
- `src/core/05_MAKE_STRUCTURES/Make_monster_spawn/` — the click-driven in-game creation/editing tools.

## Lifecycle

A `MonsterSpawn` is constructed with a label, a `MonsterType`, a `MECRegion` (the spawn zone — see [ARCHITECTURE.md](../ARCHITECTURE.md#mec-regions)), a spawn frequency, and a `MonsterDirectionMode` (`'straight' | 'random'`, see below).

- **`activate()`** — starts an `initialDelayTimer` (if `initialDelay` is set); once it fires, creates a WC3 `trigger` on a periodic timer event (`1 / frequency` seconds) whose action is the shared `MonsterSpawn_Actions` callback, and enables unit-watching on the spawn's `MECRegion` and any dead zones.
- **`deactivate()`** — destroys the spawn trigger, removes every currently-spawned unit (via `removeMonsterUnit`, not `destroy`ing them — see [Unit recycling](#unit-recycling)), and disables region watching.
- **`refresh()`** — `deactivate()` + `simpleUnitRecycler.reinit()` (hard-destroys pooled units) + `activate()`. Called automatically whenever the region, monster type, or timed-unspawn setting changes while the spawn is active.
- **`destroy()`** — `deactivate()`, detaches from the level's `MonsterSpawnArray`, destroys the unit recycler and every region (main + dead zones).

## Spawn tick (`MonsterSpawn_Actions`)

On every tick (module-level function, keyed by trigger handle ID via `MonsterSpawn.anyTrigId2MonsterSpawn`):
1. Aborts if `currentGroupSize + spawnAmount` would exceed the hardcoded cap `MAXIMUM_SPANWED_MONSTERS_SIMULTANEOUSLY = 500`, or if the spawn's `MECRegion` is missing.
2. If `timedUnspawn` is set, computes a `forcedDistance` (`monsterSpeed * (unspawnTime + 2)`) so the unit's movement order stops roughly where it should be despawned — the `+2` seconds is explicit slack "to be sure that the monster will be unspawned before reaching the end of their movement".
3. Loops `spawnAmount` times, each iteration:
   - Sets `spawnIndex` on the spawn (consumed by the offset math below).
   - Asks the `MECRegion` for a `{startX, startY, endX, endY}` pair via `generateStartAndEndPoints(this)` (see [Positioning](#positioning-within-the-zone)).
   - Creates or recycles a unit via `createMob()`.
   - Issues a move order from start to end via `IssueMoveOrderForLongDistance` (see [Movement](#movement-longdistancemoveorder)).
   - If `timedUnspawn` is set, starts a one-shot timer that calls `removeMonsterUnit` when it expires.

## Positioning within the zone

`MECRegion.generateStartAndEndPoints(monsterSpawn?)` is the polymorphic entry point; the base `MECRegion` throws "not implemented", `LineRegion` overrides it with a simple case (a line has no width to offset across), and **`TrapezeRegion` provides the real algorithm**, inherited by `ParallelogramRegion` → `RectangleRegion` → `HorizontalRectangleRegion` (the class hierarchy for every "wide" shape). A zone conceptually has a "start line" (one edge) and an "end line" (the opposite edge); a spawned unit walks from a point on the start line to a point on the end line.

Two independent axes control where on those lines a unit spawns/walks to:

- **`monsterDirectionMode` (`'straight' | 'random'`)** — without a `fixedSpawnOffset`, the start-line point is a uniform random offset. In `'straight'` mode the end-line point uses the *same* relative offset (the unit walks straight across); in `'random'` mode the end-line point gets an independently random offset (the unit can walk diagonally to anywhere on the far side). This is the `-setMonsterSpawnMonsterDirectionMode` command, and is the mechanism behind the changelog entry "spawned monsters can move to a random location on the other side of the spawn".
- **`fixedSpawnOffset` (`number | 'auto' | undefined`)** — when set, positioning becomes deterministic instead of random, via `calcValOffset`/`calculateNextNewSpawnVal`:
  - `'auto'`: with `spawnAmount === 1`, always centered; with more, evenly distributes `spawnAmount` units across the start line.
  - a fixed number: each new spawn (or, if `spawnOffset` is also set, each unit *within* one spawn cycle) advances along the line by that amount from `lastSpawnVal`.
  - **`fixedSpawnOffsetBounce`**: when the running offset would go out of the line's bounds, it reflects back (ping-pong) instead of wrapping, flipping an internal `bouncing` flag.
  - **`fixedSpawnOffsetMirrored`**: alternates spawns between the offset position and its mirror image on the opposite side of the line.
- **`spawnOffset`** — separately, the distance *between* individual units when `spawnAmount > 1` (multiple units created in the same tick).

`forcedDistance` (set internally when `timedUnspawn` is active, see above) overrides the computed end point after the fact: it recomputes the end point along the same direction angle but at a fixed distance from the start point, on **both** the random and fixed-offset code paths.

Points returned with `ephemeral: true` are pooled `MemoryHandler` objects the caller must `destroyObject()` after use (see `MonsterSpawn_Actions`'s `MemoryHandler.destroyObject(startAndEndPoints)` call) — the persistent zero-offset case (`LineRegion` with no `forcedDistance`) instead returns a long-lived, non-ephemeral object owned by the region.

## Movement: `LongDistanceMoveOrder`

`IssueMoveOrderForLongDistance(unit, x, y, autoDestroy?)` (`src/core/04_STRUCTURES/Monster/LongDistanceMoveOrder.ts`) is not spawn-specific — it's a general utility, but it's how every spawned monster moves:

- If the destination is within `Constants.MAX_DISTANCE_PER_MOVE_ORDER`, it issues a single WC3 `move` order directly and returns `true`.
- Otherwise it returns a `LongDistanceMoveOrder` instance (pooled via `MemoryHandler.getEmptyClass`), which pre-computes evenly-spaced waypoints between start and destination, and issues a move order to the first one. A small (64×64) `HorizontalRectangleRegion` follows the unit and watches for it entering the *next* waypoint's vicinity (`OnNextWaypointReached`), at which point it issues the next order — repeating until the final waypoint, where it self-destroys (unless `autoDestroy` was `false`).

This is the mechanism behind the "long patrols... automatically split monster movement orders into several little moves" changelog entry — it's what makes very long spawn-zone crossings not silently fail or move only partway (a raw WC3 point-move order given too much distance in this engine doesn't behave as if the whole journey were one order).

A 10-second recurring timer (`init_LongDistanceMoveOrder_garbageCollector`) sweeps all live `LongDistanceMoveOrder`s and destroys any whose unit has died, as a safety net independent of the normal completion/destroy path.

## Unit recycling

`SimpleUnitRecycler` (per-`MonsterSpawn` instance) is a **pool of real WC3 unit handles**, distinct from and complementary to the generic `MemoryHandler` table-pooling system (see [docs/MEMORY_HANDLER.md](./MEMORY_HANDLER.md)) — this one avoids `CreateUnit`/`RemoveUnit` overhead specifically.

- `removeUnit(u)`: hides the unit (`ShowUnit(u, false)`) and marks it **unavailable for `UNIT_UNAVAILABLE_TIME = 10` seconds** before it can be reused — the comment notes this window exists "in case of movement effect following the unit", i.e. to let any lingering visual/death effect finish before the same unit handle silently teleports elsewhere for reuse.
- `getUnit()`: pops an available unit from the pool (if any) and re-shows it; `MonsterSpawn.createMob()` falls back to actually creating a new unit only when the pool is empty.
- `reinit()` (used by `MonsterSpawn.refresh()`): hard-destroys every pooled unit, available or not, and clears timers — used when the spawn's configuration changes enough that recycled units could no longer be valid (region, monster type).

## Dead zones (hide regions)

A spawn can own multiple **hide regions** (`hideRegions: { [regionId]: MECRegion }`, a `MemoryHandler`-pooled object), created in-game via `-createMonsterSpawnDeadZone` / removed via `-deleteMonsterSpawnDeadZones`. While a spawned unit is inside one of its spawn's hide regions:
- `ShowUnit(monsterUnit, false)` and `UnitRemoveAbility(..., FourCC('Aloc'))` on enter — hidden and no longer able to kill (the `Aloc` ability, re-added on exit, is what makes a monster lethal-on-touch elsewhere in the engine).
- On leaving a hide region, visibility/lethality is restored **only if** the unit is still inside the spawn's main region *and* not inside any *other* hide region (`isUnitInAnyHideRegion`) — overlapping dead zones are handled correctly.

`getMostLittleHideRegionAtPosition(x, y)` returns the smallest-area hide region containing a point, used by the "remove one at a time by clicking" flow (`-deleteMonsterSpawnDeadZones ... clicks`) so clicking in an overlap removes the most specific region first.

## Hooks

`createMob()` runs two hook points around unit creation (combining level-scoped and global hooks via `CombineHooks`, see [ARCHITECTURE.md](../ARCHITECTURE.md#hooks)):
- **`onBeforeCreateMonsterUnit`**: each registered hook receives `{mt}` and can return `false` to cancel spawning this unit entirely, or `{unitTypeId}` to override which unit type gets created (via `Monster.forceUnitTypeIdForNextMonster`, consumed once by `NewImmobileMonster`). Only applies to freshly-created units — the code has a `// todo` noting that a *recycled* unit currently ignores `forceUnitTypeId`.
- **`onAfterCreateMonsterUnit`**: each hook receives `{mt, u}` for post-creation side effects.

## Persistence (JSON)

`MonsterSpawn.toJson()` / `MonsterSpawnArray.newFromJson()` round-trip every configuration field (label, monster type label, `MECRegion`, frequency, spawnAmount, initialDelay, timedUnspawn, direction mode, offsets, bounce/mirror flags, hide regions) — this is what the [smic pipeline](./SMIC_PIPELINE.md) exports and what level-loading reconstructs from.

`newFromJson` also supports an **old JSON format** for backward compatibility with pre-MECRegion-refactor maps (`ms.mecRegion === undefined`): `generateMecRegionFromOldJsonFormat` reconstructs an equivalent `MECRegion` from the old flat fields (`sens` direction string/angle, `spawnShape` of `'line' | 'point' | 'region'`, raw min/max or click coordinates), including a `-0.5` second adjustment to `timedUnspawn` to compensate for an old, now-removed fixed "delay between spawn and movement" behavior.

## In-game creation & editing (the "Make" tools)

`MakeMonsterSpawn` (`src/core/05_MAKE_STRUCTURES/Make_monster_spawn/MakeMonsterSpawn.ts`) extends the generic click-driven `MakeMECRegion` base (shared by every region-drawing tool in the engine, not spawn-specific). `-createMonsterSpawn <label> <monsterLabel> <kind> [frequency] [straight|random]` maps a `kind` (`up|down|left|right|line|rect|parallelogram|trapeze`) to the right `MakeMECRegionMode` and starts the click flow; once enough clicks are made, `onMECRegionCreated` instantiates the real `MonsterSpawn` and activates it. `MakeSetMonsterSpawnZone` (`-setMonsterSpawnZone`) reuses the same click flow to redefine an existing spawn's region in place. `MakeMonsterSpawnHideRegion` / `MakeMonsterSpawnRemoveHideRegion` do the equivalent for dead zones, each pushing an undo entry via `escaper.newAction(...)` (`MakeLastActions/MakeMonsterSpawnHideRegionAction.ts` / `MakeMonsterSpawnRemoveHideRegionAction.ts`).

## Command reference

Don't hand-transcribe the full list — run `yarn generate-help` (see [CLAUDE.md](../CLAUDE.md)). All monster-spawn commands are `'make'`-tier, defined in `src/core/06_COMMANDS/Commands/4_make_spawns.ts`:

| Command | Purpose |
|---|---|
| `createMonsterSpawn` (`crmsp`) | Create a new spawn: label, monster type, zone kind, optional frequency (0.1–30) and direction mode. |
| `setMonsterSpawnLabel` (`setmsl`) | Rename. |
| `setMonsterSpawnMonster` (`setmsm`) | Change which `MonsterType` it spawns. |
| `setMonsterSpawnZone` (`setmsz`) | Redefine the zone shape/position via clicks. |
| `setMonsterSpawnFrequency` (`setmsf`) | Spawn ticks per second (0.1–30). |
| `setMonsterSpawnAmount` (`setmsa`) | Units created per tick (1–500). |
| `setMonsterSpawnOffset` (`setmso`) | Distance between units within one tick (0–16384). |
| `setMonsterSpawnFixedSpawnOffset` (`setmsfso`) | Deterministic spacing between spawns, a number or `"auto"` (0–16384). |
| `setMonsterSpawnFixedSpawnOffsetBounce` (`setmsfsob`) | Toggle ping-pong at zone bounds (requires fixed offset). |
| `setMonsterSpawnFixedSpawnOffsetMirrored` (`setmsfsom`) | Toggle mirrored alternation (requires fixed offset). |
| `setMonsterSpawnInitialDelay` (`setmsid`) | Seconds before the spawn starts ticking (1–10). |
| `setMonsterSpawnTimedUnspawn` (`setmstu`) | Auto-despawn after N seconds instead of on zone-leave (0 disables). |
| `setMonsterSpawnMonsterDirectionMode` (`setmsmdm`) | `straight` or `random` (no effect on `line` zones). |
| `createMonsterSpawnDeadZone` (`crmsdz`) | Add a dead/hide zone (`horizRect`\|`rect`\|`parallelogram`\|`trapeze`\|`circle`\|`line`). |
| `deleteMonsterSpawnDeadZones` (`delmsdz`) | Remove dead zones, one-by-one (`clicks`, smallest-area priority) or `all`. |
| `displayMonsterSpawns` / `displayMonsterSpawnsDetailled` (`dms`/`dmsd`) | Paginated listing for the current level. |
| `deleteMonsterSpawn` (`delms`) | Remove entirely. |
