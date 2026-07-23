# Context

MEC currently has a very primitive terrain save/load mechanism (`SaveLoadTerrain`, `src/core/07_TRIGGERS/Triggers_to_modify_terrains/Save_load_terrain.ts`): a bare in-memory `Map`, whole-map only, terrain-type only, never persisted, and `-loadTerrain` doesn't snapshot before overwriting (so it can't be "undone"). The spec (`features-plan-and-analysis/2026-08_terrain-saves/objective.md`) asks to replace this with a proper `TerrainSave`/`TerrainSaveArray` system: zone-scoped, `-smic`-persisted, with an attached event system to apply/unapply terrain automatically (on level start/end, or when a hero touches a specific monster). Extensive back-and-forth with the user resolved numerous ambiguities the spec left open (marked "todo" or contradictory) — this plan reflects the final, agreed design. **`objective.md` will be updated to match this plan once implementation starts** (batch update, not incremental, per user's explicit choice).

Existing patterns confirmed and to be reused throughout (see `docs/TERRAIN.md`, `docs/MONSTER_SPAWNS.md`, `docs/SMIC_PIPELINE.md` for background): `BaseArray<T>` (`src/core/04_STRUCTURES/BaseArray.ts`), the global-collection wiring pattern (`globals.ts` + `initArrays.ts` + `initializers.ts`), the `-smic` export/import pair (`SaveMapInCache.ts`/`LoadMapFromCache.ts`), `MECRegion`/`HorizontalRectangleRegion` + `MakeMECRegion` click-flow, `createTimer`, and the `Level.hooks_onStart/onEnd` hook arrays.

# Data model

## `TerrainSave`

New file `src/core/04_STRUCTURES/TerrainSave/TerrainSave.ts`.

**Identity & scope**:
- `label: string` — **cannot start with a digit or with `-`** (both are reserved for the addressing syntax below).
- `level: Level | null` — `null` means **global**; otherwise tied to one specific `Level`. Settable after creation via the new `setTerrainSaveLevel` command.
- **Uniqueness rule**: keyed by the pair `(label, level)`, i.e. the same label can exist independently at multiple different levels simultaneously (`"trap1"` at level 1 and level 2 are two distinct `TerrainSave`s). But **a label used as global cannot also be used at any level, and vice versa** — this is a cross-cutting exclusivity check *in addition to* the per-(label,level) uniqueness, enforced on creation (`saveTerrain`) and on `setTerrainSaveLevel` (moving a save must not create a global/level collision on its label).

**Terrain data** (Phase 1 scope, matches today's `-saveTerrain`/`-loadTerrain` capability — no heights/cliffs/ramps/tileset, that gap is explicitly out of scope, see `docs/TERRAIN.md`):
- `zone: HorizontalRectangleRegion | null` — `null` means whole map. Phase 1 supports `horizRect` only (matches the spec's primary wording; the "Potential improvements" note about arbitrary `mecRegionShape` is deferred).
- `capturedTerrain: TerrainType[]` — a **flat, single-dimension, row-major array** of live `TerrainType` object references (not `terrainTypeId` numbers — the runtime representation holds real references; conversion to/from the serializable numeric id only happens at the `toJson()`/`newFromJson()` boundary). Indexed as `capturedTerrain[row * width + col]`, alongside `originX/originY/width/height` (tile-index units, converted via `Constants.LARGEUR_CASE`), bounds sourced from `zone.getMinX()/getMaxX()/getMinY()/getMaxY()` or `globals.MAP_MIN_X/MAX_X/MIN_Y/MAX_Y` for whole-map. There is no `null` entry case: capture fails hard (see below) rather than storing a hole.
- `previousTerrain: TerrainType[] | null` — same flat shape, **runtime-only, never persisted** — see apply/unapply semantics below.
- `applied: boolean` — runtime-only, never persisted (a reloaded save always starts unapplied).
- `minimapEnabled: boolean` — persisted; pure flag, see [Minimap flag](#minimap-flag) below. **Tentative**: the user wants to reconsider whether this sub-feature is even wanted before it's built — treat it as the last, optional step, not a committed deliverable.
- `events: TerrainSaveEventArray` — owned events, see [TerrainSaveEvent](#terrainsaveevent).

**Methods**:
- `captureTerrain()` — (re)reads live terrain over `zone`/whole-map into `capturedTerrain` via `getUdgTerrainTypes().getTerrainType(x, y)`, storing the returned `TerrainType` directly (no id conversion at this layer). **If any tile resolves to no `TerrainType`, throw and cancel the creation/update** — no partial/holey capture is allowed. Used by `saveTerrain` (initial) and `updateTerrainSave` (re-capture).
- `apply(): boolean` — if `applied === false` (rising edge), first snapshot the *current* live terrain into `previousTerrain` (same grid-walk). Then, **unconditionally** (whether this was a rising edge or not), write `capturedTerrain` onto the map via `ChangeTerrainType(x, y, terrainType.getTerrainTypeId())`. Set `applied = true`. This means: calling `apply()` while already applied re-paints the saved content (useful if something else touched those tiles since), but never clobbers the true pre-first-apply snapshot in `previousTerrain`.
- `unapply(): boolean` — no-op (`false`) if `applied === false`. Otherwise writes `previousTerrain` back via `ChangeTerrainType`, sets `applied = false`, clears `previousTerrain`.
- `getLabel()`, `setLabel()`, `getLevel()`, `setLevel(level: Level | null)` (used by `setTerrainSaveLevel`, re-checks the exclusivity rule), `getZone()`, `isWholeMap()`, `isApplied()`, `isMinimapEnabled()`, `setMinimapEnabled(b)`.
- `toJson()` / reconstruction — serializes `label`, `level` (as a level number or `null`), `zone` (via `HorizontalRectangleRegion.toJson()`, already exists at `HorizontalRectangleRegion.ts:87-98`), `capturedTerrain` (each `TerrainType` converted to its `terrainTypeId` for the JSON array; `newFromJson` resolves each id back to a live `TerrainType` via `getUdgTerrainTypes()`), `minimapEnabled`, and nested `events`. **Not** `applied`/`previousTerrain`.
- `destroy()` — destroys `zone` (if any), destroys all owned `TerrainSaveEvent`s (unregistering their hooks/timers), per spec's "remove the terrain save and their associated events".

## `TerrainSaveArray`

New file `src/core/04_STRUCTURES/TerrainSave/TerrainSaveArray.ts`. `extends BaseArray<TerrainSave>`, `super(true)` (auto-managed ids, like `MonsterTypeArray`/`TerrainTypeArray`) — **one single global instance**, not per-Level (a per-Level array would complicate `-smic` persistence and the global/level-mixed uniqueness rule for no real benefit; the optional `level` field on each `TerrainSave` is enough).

- `getByLabelAndLevel(label: string, level: Level | null): TerrainSave | null` — exact-match lookup for the (label, level) uniqueness key.
- `existsAnywhereByLabel(label: string): boolean` — scans all entries regardless of level, for the global/level exclusivity check.
- `resolveLabel(rawLabel: string, currentLevel: Level | null): TerrainSave | null` — implements the addressing syntax (see below): strips a leading `x-` level-number prefix if present and does an exact `(label, level=x)` lookup; otherwise (no prefix) tries global first, then `currentLevel`.
- `findEventById(eventId: number): TerrainSaveEvent | null` — global scan across every owned `TerrainSaveEventArray`, used by `removeTerrainSaveEvent`/`changeEventTerrainSave`/`editTerrainSaveEvent`/`displayTerrainSaveEvent` (all id-addressed, see [Commands for events](#commands-for-events)).
- `newFromJson(json: any[])` — reconstructs each `TerrainSave`, resolving `level` via `getUdgLevels().get(levelNum)` when not global, rebuilding `zone` via `ServiceManager.getService('MECRegionService').newHorizontalRectangleRegionBackupToLine(...)`, and nested events (which also need `getUdgLevels()` for `levelStart`/`levelEnd` triggers).
- `toJson()` — inherited from `BaseArray`.

**Global wiring** (mirrors `monsterTypes`/`setUdgMonsterTypes`/`getUdgMonsterTypes`, `globals.ts:18,134-142`): add `terrainSaves?: TerrainSaveArray` to `globals.ts`, `setUdgTerrainSaves`/`getUdgTerrainSaves()`, `initTerrainSaves()` in `src/core/Init/initArrays.ts` (mirrors `initMonsterTypes`, lines 30-32/40-46), called from `core/Init/initializers.ts:38`.

## Addressing syntax (for all commands taking a `TerrainSave` label, except `saveTerrain`'s creation label)

- A label **cannot start with a digit** or with `-` (both reserved).
- Prefix form `x-label` (e.g. `2-trap1`) explicitly targets the `TerrainSave` named `trap1` at level `x`.
- Bare `label` (no prefix) resolves via `TerrainSaveArray.resolveLabel`: **global first, then the current making level**, else "unknown terrainSave" error. (Which order wins rarely matters in practice since a label can't be both global and per-level, but global-first is the agreed tiebreak for the multi-level case.)

# Commands

All in a **new file** `src/core/06_COMMANDS/Commands/4_make_terrain_saves.ts`, `group = 'make'`. This means `saveTerrain`/`loadTerrain`/`deleteTerrainSave` are **removed from `5_admin.ts`** (currently at lines ~69-122) and re-registered here instead, alongside every new command — matching the tier used for other authoring commands like monster/spawn creation (`4_make_monsters.ts`/`4_make_spawns.ts`), since terrain saves are a map-authoring feature, not an admin/cheat one.

- **`saveTerrain` (`st`) `<label> [all|rect] [global|g]`** — no zone param = `all` (backward compatible with today's whole-map-only behavior). `rect` kicks off a `MakeMECRegion`-based click flow (new `MakeTerrainSaveZone` class in `src/core/05_MAKE_STRUCTURES/Make_terrain_save/`, subclassing `MakeMECRegion` like `MakeMonsterSpawn.ts` does) that creates the `TerrainSave` on `onMECRegionCreated` and calls `captureTerrain()`. Defaults to the escaper's current making level unless `global`/`g` is passed. **Errors if the label already exists** at the target (label, level) key, or violates the global/level exclusivity rule — no silent overwrite (use `updateTerrainSave` instead).
- **`loadTerrain` (`lt`) `<label>`** — zone is now intrinsic to the `TerrainSave`. Body: `TerrainSaveArray.resolveLabel(label, currentLevel)?.apply()`. Preserve "doesn't exist" error text.
- **`unloadTerrain` (`ult`) `<label>`** — the counterpart to `loadTerrain`: `TerrainSaveArray.resolveLabel(label, currentLevel)?.unapply()`, restoring the terrain to its pre-apply state. Errors if not currently applied (`unapply()` returns `false` in that case). This is also the only way to reach `unapply()` before events (step 4/5) exist, and is being kept permanently rather than just for testing.
- **`displayTerrainSave` (`dts`) `[<label>|<levelNum>|global|g|current|c] [page]`**:
  - No param: show **global saves, then current-level saves**, paginated (reuse `handlePaginationArgs`/`handlePaginationObj`, same convention as `displayMonsterSpawns` — a unified pagination overhaul across the whole command system is explicitly out of scope/future work).
  - A bare number as first param: show **only that level's** saves (not combined with globals).
  - `global`/`g`: only global saves. `current`/`c`: only current-level saves.
  - A label (with optional `x-` prefix): detailed view — label, level (or "global"), whole-map or zone bounds text, applied state, minimap-enabled flag, event count; move camera to zone center via `zone.getCenterX()/getCenterY()` (confirmed to exist, `MECRegion.ts:275,277` abstract, implemented up the `TrapezeRegion`→...→`HorizontalRectangleRegion` chain) unless whole-map; show `zone.debugRects(true)` timed like `MonsterSpawn.displayForPlayer`.
- **`updateTerrainSave` (`uts`) `<label> [all|rect]`** — resolves label, errors if not found. No 2nd param or `all`: re-`captureTerrain()` in place (same zone). `rect`: same `MakeTerrainSaveZone` click flow as `saveTerrain`, but replaces the existing `zone` (destroying the old one) before re-capturing.
- **`deleteTerrainSave` (`delts`) `<label>`** — resolves label, `.destroy()` + `getUdgTerrainSaves().destroyOne(id)`. Does **not** unapply first, even if `isApplied()` — the live terrain is left untouched, whatever it currently looks like. Preserve success/error text conventions.
- **`setTerrainSaveLevel` (`settsl`) `<label> <levelNum>|global|g|current|c`** — re-checks the global/level exclusivity rule at the *new* target before applying `setLevel(...)`.
- **`terrainSaveEnableMinimap` `all|<label> <boolean>`** — see [Minimap flag](#minimap-flag). Tentative, may be dropped.

# `-smic` persistence

- **Export**: `SaveMapInCache.gameAsJsonString()` (`src/core/07_TRIGGERS/Save_map_in_gamecache/SaveMapInCache.ts:39-51`) — add `jsonGameData.terrainSaves = getUdgTerrainSaves().toJson()` alongside `terrainTypesMec`/`monsterTypes`/`casterTypes`/`levels`.
- **Import**: `LoadMapFromCache.initializeGameData()` (`src/core/07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache.ts:17-108`):
  - reload branch (lines 28-35): add `getUdgTerrainSaves().destroy(); initTerrainSaves()`.
  - **Ordering constraint**: `TerrainSave.newFromJson`/`TerrainSaveEvent` reconstruction needs `getUdgLevels().get(levelNum)` (for `level`, and for `levelStart`/`levelEnd` event triggers) — so `getUdgTerrainSaves().newFromJson(gameData.terrainSaves)` must run **after** `getUdgLevels().newFromJson(gameData.levels)` (existing line 94). Place it last.

# `TerrainSaveEvent`

New files `src/core/04_STRUCTURES/TerrainSave/TerrainSaveEvent.ts` + `TerrainSaveEventArray.ts`. Built fresh (no existing generic `Event` class to extend — confirmed via grep).

```ts
type TerrainSaveEventConditionKind = 'levelStart' | 'levelEnd' | 'monsterTouch'
// Named "condition", not "trigger" — this codebase's "trigger" already means a native WC3 trigger, so reusing
// the word here for something conceptually different (an event's activation condition) would be confusing.
type TerrainSaveEventCondition =
  | { kind: 'levelStart' | 'levelEnd'; levelNum: number }
  | { kind: 'monsterTouch'; monsterId: number }   // hand-placed Monster only, see below
type TerrainSaveEventAction = 'apply' | 'unapply'

class TerrainSaveEvent {
  private static lastId = 0          // global counter -> ids are globally unique, first assigned id is 1
  id: number
  terrainSave: TerrainSave           // owner back-reference
  condition: TerrainSaveEventCondition
  action: TerrainSaveEventAction
  delay?: number                     // seconds, one-shot before first firing
  periodicInterval?: number          // seconds; after the (optional) delay, toggle apply/unapply every interval indefinitely. Can combine with delay.
  hookId: number | null              // MecHookArray id (level conditions) — monsterTouch needs NO hook (see below)
  timer: Timer | null

  register()   // level conditions: getUdgLevels().get(levelNum).hooks_onStart/onEnd.new(cb); monsterTouch needs no registration (see onEscaperTouchingMonster below)
  unregister() // hooks_onX.destroy(hookId); timer?.destroy()
  fire()       // if delay: createTimer(delay, false, () => { this.applyOrUnapply(); if (periodicInterval) this.startPeriodic() })
               //   else: applyOrUnapply() immediately; if (periodicInterval) this.startPeriodic()
  startPeriodic() // createTimer(periodicInterval, true, () => this.toggleApplyUnapply())
  applyOrUnapply() // action === 'apply' ? terrainSave.apply() : terrainSave.unapply()
  toggleApplyUnapply() // terrainSave.isApplied() ? terrainSave.unapply() : terrainSave.apply()
  toJson() // persists condition + action + delay + periodicInterval; NOT hookId/timer (re-register() on reconstruction)
  destroy() // unregister()
}
```

`TerrainSaveEventArray extends BaseArray<TerrainSaveEvent>`, `super(false)` (item owns its own globally-assigned `id`, same mode as `MonsterSpawnArray`) — **one instance per `TerrainSave`**.

## `monsterTouch` targeting — hand-placed monsters only, never typed

- **Only hand-placed `Monster` instances can be event targets — `MonsterSpawn`-generated monsters cannot.** This isn't an arbitrary restriction: `onEscaperTouchingMonster`'s `udg_monsters[GetUnitUserData(killingUnit)]` lookup (the only place a touched unit resolves to a rich object) **already only contains hand-placed monsters** — spawned mobs are `null` there today (confirmed via an explicit `// TODO` in the existing code, `InvisUnit_is_getting_damage.ts:75`). So this restriction matches an existing engine boundary, not a new limitation.
- Target is stored as `Monster.id` (numeric, already exists, `Monster.ts:38,85`) — **but the id is never typed by the player.** Both `createTerrainSaveEvent`'s `monsterTouch` case and `editTerrainSaveEvent`'s retarget case use a **click-to-target flow** mirroring `MakeGetMonsterInfo.ts:14-27`'s proximity resolution (`level.monsters.getMonsterNear(x, y)`, `MonsterArray.ts:55-70`) — a new lightweight "Make" class (e.g. `MakeSelectMonsterForEvent`, `src/core/05_MAKE_STRUCTURES/Make_terrain_save/`) that resolves a click to a `Monster.id` and continues the creation/edit flow via a callback, rather than the region-drawing `MakeMECRegion` flow.
- **If the targeted monster is later deleted** (`-deleteMonster`): the event is **kept as-is** (no cascade delete) — it just becomes permanently unfireable. `displayTerrainSaveEvent` shows a warning **in orange** (`Constants.ORANGE` → `udg_colorCode[Constants.ORANGE]`, confirmed existing constant, `Init_colorCodes.ts:59` uses the same for `COLOR_TERRAIN_DEATH`) when the target id no longer resolves to a live `Monster`.

## Detection: no `MecHookArray`, a dedicated branch in `onEscaperTouchingMonster`

Per the user's explicit preference (no generic hook — dedicated code at the right place). Edit `src/core/08_GAME/Death/InvisUnit_is_getting_damage.ts`'s `onEscaperTouchingMonster` (currently lines 90-177). **Final agreed branch order — fully exclusive, each branch `return`s**:

1. `clearMob` / `portalMob` / `circleMob` / `jumpPad` (existing, unchanged, lines 109-128).
2. `lifeBonus` (existing, lines 131-135, unchanged) — if the monster's `MonsterType` has a life bonus, it fires and `return`s, **taking priority over any `monsterTouch` event on the same monster** — a monster that is both a "book of life" and an event target only ever behaves as the book of life; the event is simply never checked in that case.
3. **`monsterTouch` terrain event (new)** — only reached if the monster has no life bonus. If this monster is the target of one or more `monsterTouch` `TerrainSaveEvent`s, fire all of them (`event.fire()` for each) and `return` — no kill, no godMode effect.
4. `godMode` (existing, lines 137-153, unchanged position) — reached only if neither lifeBonus nor a terrain event applied.
5. Normal kill (existing, lines 155-176, unchanged) — final fallback.

# Commands for events

Also in `4_make_terrain_saves.ts`, `group = 'make'`:

- **`createTerrainSaveEvent` (`ctse`) `<terrainSaveLabel> <apply|unapply> <levelStart|levelEnd|monsterTouch> [delay=<seconds>] [periodic=<seconds>]`** — one unified signature for all condition kinds. For `levelStart`/`levelEnd`, no separate level number is given: it's derived automatically — the target `TerrainSave`'s own `level` if it's level-scoped, otherwise the escaper's current making level (since the `TerrainSave` is global). For `monsterTouch`, kicks off the `MakeSelectMonsterForEvent` click flow; the event is finalized once a matching monster is clicked.
- **`removeTerrainSaveEvent` (`rtse`) `<eventId>`** — resolves the event globally via `TerrainSaveArray.findEventById`, then its owning `TerrainSave`, and calls `terrainSave.removeEvent(eventId)` (destroy + unregister).
- **`changeEventTerrainSave` (`cets`) `<eventId> <newTerrainSaveLabel>`** — moves an event to a *different* `TerrainSave` via `findEventById`. Updates the `terrainSave` back-reference; no need to `unregister()`/`register()` again (wiring is independent of which `TerrainSave` it targets).
- **`editTerrainSaveEvent` (`etse`) `<eventId> <field> [<value>]`** — general-purpose edit of any parameter. Fields: `action` (`apply|unapply`), `delay` (`<seconds>|none`), `periodic` (`<seconds>|none`), `level` (levelStart/levelEnd events only, `<levelNum>|current|c`), `target` (**monsterTouch events only — always kicks off the click flow, silently ignores any typed value**, per the hard constraint that a monster id must never be typed). Changing `delay`/`periodic`/`action`/`level` while the event is registered means `unregister()` + re-`register()`/`fire()` bookkeeping as appropriate.
- **`displayTerrainSaveEvent` (`dtse`) `[<terrainSaveLabel>|<eventId>]`**:
  - No parameter: paginated list of **every** event in the game, each entry prefixed with its owning `TerrainSave`'s label.
  - A `TerrainSaveLabel`: paginated list of just that save's events (condition kind, action, delay/periodic, global id, orange warning if the target monster is gone).
  - An `eventId`: detail view for that one event + orange warning if a `monsterTouch` target no longer resolves + move camera to the target monster's position if it still exists.

# Minimap flag

`mec-smic-loader` (separate repo, confirmed — see `docs/SMIC_PIPELINE.md`) is the actual `.blp` generator; nothing in this repo writes minimap images. `terrainSaveEnableMinimap` would just set/persist `TerrainSave.minimapEnabled` (§ Data model) — that's the entire scope in this repo. **Cross-repo dependency to flag**: `mec-smic-loader`'s own JSON-consuming code would need a matching update (out of scope here) to read the new `terrainSaves` key and act on `minimapEnabled`/`zone` bounds. **This whole sub-feature is tentative** — revisit with the user before building it; it's ordered last precisely so it can be dropped without disturbing anything else.

# Process

**Pre-flight check (done)**: none of the new command names or aliases (`displayTerrainSave`/`dts`, `updateTerrainSave`/`uts`, `setTerrainSaveLevel`/`settsl`, `unloadTerrain`/`ult`, `terrainSaveEnableMinimap`, `createTerrainSaveEvent`/`ctse`, `removeTerrainSaveEvent`/`rtse`, `changeEventTerrainSave`/`cets`, `editTerrainSaveEvent`/`etse`, `displayTerrainSaveEvent`/`dtse`) collide with any of the 315 existing command names or 282 existing aliases across `src/core/06_COMMANDS/Commands/*.ts`. `saveTerrain`/`st`, `loadTerrain`/`lt`, `deleteTerrainSave`/`delts` are reused as-is (same commands, relocated), not new collisions.

**Implementation proceeds one step at a time, from the numbered list below.** Work happens on branch `feat/terrain-saves` (create it before step 1 if it doesn't exist yet). After each step:
1. Run `tsc --noEmit` and confirm it's clean.
2. Commit the step's changes.
3. Stop and wait — let the user review the code, then test in-game (`yarn test-launch`) and explicitly validate before starting the next step.

Do not batch multiple steps together or continue past a step without that go-ahead.

# Implementation order

1. **Core class + persistence**: `TerrainSave`, `TerrainSaveArray` (whole-map + global/level model, no zone-scoping yet), global wiring, `-smic` export/import wiring. Validate round-trip with a whole-map, level-scoped, and global save via `-smic`/reload before touching commands.
2. **Whole-map commands on the new class**: `saveTerrain`/`loadTerrain`/`unloadTerrain`/`deleteTerrainSave`/`setTerrainSaveLevel` (`all` only), in the new `4_make_terrain_saves.ts`, removed from `5_admin.ts`. Retire `Save_load_terrain.ts` once unreferenced. Shippable checkpoint: persistent, restorable terrain saves with level/global scoping — already a real improvement over today.
3. **Zone-scoped saves**: `MakeTerrainSaveZone` click flow, `updateTerrainSave`, `displayTerrainSave` (list/detail/camera/debugRects/pagination).
4. **Events — level conditions first** (simpler, direct `Level.hooks_onStart/onEnd` reuse): `TerrainSaveEvent`/`TerrainSaveEventArray`, `createTerrainSaveEvent`/`removeTerrainSaveEvent`/`changeEventTerrainSave`/`editTerrainSaveEvent`/`displayTerrainSaveEvent` for `levelStart`/`levelEnd` only.
5. **Events — `monsterTouch`**: `MakeSelectMonsterForEvent` click flow, the `onEscaperTouchingMonster` branch insertion (highest-risk change — touches core hero-death logic, test thoroughly against clearMob/portalMob/circleMob/jumpPad/lifeBonus/godMode monsters too, not just plain kills), orphan-target warning display.
6. **Minimap flag** (tentative — confirm with the user first): trivial, can slot in any time after step 1 if still wanted.

# Critical files

- `src/core/04_STRUCTURES/TerrainSave/` (new: `TerrainSave.ts`, `TerrainSaveArray.ts`, `TerrainSaveEvent.ts`, `TerrainSaveEventArray.ts`)
- `src/core/05_MAKE_STRUCTURES/Make_terrain_save/` (new: `MakeTerrainSaveZone.ts`, `MakeSelectMonsterForEvent.ts`)
- `src/core/06_COMMANDS/Commands/4_make_terrain_saves.ts` (new file — all terrain-save/event commands)
- `src/core/06_COMMANDS/Commands/5_admin.ts` (remove the existing `saveTerrain`/`loadTerrain`/`deleteTerrainSave` registrations, ~lines 69-122)
- `src/core/07_TRIGGERS/Triggers_to_modify_terrains/Save_load_terrain.ts` (retire once replaced)
- `src/core/07_TRIGGERS/Save_map_in_gamecache/SaveMapInCache.ts`, `src/core/07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache.ts` (persistence wiring)
- `src/core/08_GAME/Death/InvisUnit_is_getting_damage.ts` (`onEscaperTouchingMonster` branch insertion)
- `globals.ts`, `src/core/Init/initArrays.ts`, `src/core/Init/initializers.ts` (global collection wiring)
- `features-plan-and-analysis/2026-08_terrain-saves/objective.md` — **update to match this plan** (batch, once implementation starts)

# Verification

No automated test suite exists for game logic (see `CLAUDE.md`). Verification is manual, via `yarn test-launch` (see `docs/BUILD_AND_RELEASE.md`), plus `tsc --noEmit` per step (see Process):
- `-saveTerrain`/`-loadTerrain`/`-unloadTerrain`/`-deleteTerrainSave` round-trip (whole-map, then zone-scoped), including re-apply-while-applied and `-unloadTerrain` restoring the true original state. `-deleteTerrainSave` must **not** alter live terrain regardless of applied state.
- Level vs global scoping: same label at two different levels + a global one, verify `-dts` filtering (default, level-number, `global`/`g`, `current`/`c`) and `x-label` addressing all resolve correctly, and that the cross-exclusivity rule rejects a conflicting `saveTerrain`.
- `-smic` export + reload (`LoadMapFromCache`) preserves all of the above, including nested events, and that level-scoped saves correctly re-resolve their `Level` after reload.
- Event system: level-start/level-end conditions firing at the right time with delay/periodic combinations; `monsterTouch` — touching a targeted monster applies/unapplies without killing the hero; a life-bonus monster that also has an event attached only ever gives lives, the event never fires; godMode/clearMob/portalMob/circleMob/jumpPad monsters are unaffected by the new branch; deleting the targeted monster leaves the event intact with an orange warning in `-dtse`.
- `yarn generate-help` picks up all new commands correctly for `bin/commands-help.md`.