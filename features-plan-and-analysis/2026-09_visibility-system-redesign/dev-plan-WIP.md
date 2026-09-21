> **Status**: the six steps below are implemented, one commit each. What is left is the validation — manual play-testing through `yarn test-launch`, and above all the two-instance LAN test described at the end, which is the only thing that can confirm the partition agrees across machines. The reference documentation now lives in [`docs/VISIBILITY.md`](../../docs/VISIBILITY.md); this file keeps the reasoning that led there.

# Context

MEC's visibility system today is `src/core/04_STRUCTURES/Level/VisibilityModifier.ts` + `VisibilityModifierArray.ts`: plain rectangles, each one a `FOG_OF_WAR_VISIBLE` fog modifier created over a permanent world-bounds black mask (`udg_hideAll`, `src/core/03_view_all_hide_all/View_all_hide_all.ts`). `LevelArray.refreshVisibilities()` (`LevelArray.ts:253`) activates every level's modifiers cumulatively up to the level being played or made, and `resetVisiblitiesAtStart` cuts that stack off by re-applying the full black mask.

The limitation that motivates this redesign: **a revealed area cannot be hidden again** without deactivating the very modifier that reveals it. Reveal is the only expressible operation.

The redesign replaces per-level rectangles with per-tile visibility, composed across levels, and re-partitioned into a minimal set of fog modifiers at runtime.

Reference implementation for the partition algorithm: `/home/max/www/wc3-visiblity-modfiers-theory/grid.html` (a standalone JS/HTML proof of concept, outside this repo).

# Design decisions (settled)

## Composition across levels

The cumulative model is kept, but resolved **per tile, highest active level wins**:

```
composed[tile] = visibility type of the highest active level that defines this tile
                 (untouched = transparent, fall through to the level below)
```

- `untouched` ≠ `masked`. `untouched` lets a lower level's reveal show through; `masked` overrides it. This is precisely the missing capability, and it is why three built-in types are needed rather than two.
- `resetVisiblitiesAtStart` keeps its meaning: it truncates the composition stack. It becomes largely redundant (an author can paint `m`) but stays for backward compatibility.
- Legacy `VisibilityModifier` rectangles stay **outside** the compositor entirely (see [Backward compatibility](#backward-compatibility)).

## Only `FOG_OF_WAR_VISIBLE` modifiers are ever created

Because the world-bounds black mask is permanently on, "masked" means *absence* of a modifier. After composition:

| Composed tile | Fog modifier |
| --- | --- |
| `untouched` | none |
| `masked` | none (the global mask does the work) |
| `visible` | one `FOG_OF_WAR_VISIBLE` rect |
| periodic | one `FOG_OF_WAR_VISIBLE` rect, started/stopped by the type's timer |

Consequences: only the `visible` and periodic tile sets are ever partitioned, and no `FOG_OF_WAR_MASKED` modifier is ever built.

## Partition is per type, timers are per type

Two tiles of different types can never share a rectangle, so the partition runs once per visibility type over that type's own mask. All zones of a given periodic type share **one** timer, so they stay in phase. Two zones in opposite phase are expressed as two types with opposite `startState` — no per-zone phase field.

## `VisibilityType.kind` instead of `-1`/`0` sentinels

```ts
kind: 'untouched' | 'visible' | 'masked' | 'periodic'
label: string
theAlias: string | null
immutable: boolean                  // true for the three built-ins
startState: 'visible' | 'masked'    // only meaningful when kind === 'periodic'
visibleTime: number                 // only meaningful when kind === 'periodic', > 0
maskedTime: number                  // only meaningful when kind === 'periodic', > 0
```

Mirrors `TerrainType.kind` (`src/core/04_STRUCTURES/TerrainType/TerrainType.ts`) and removes the `-1` = infinite / `0` = absent sentinel juggling: `visible` is not "visible for -1 seconds", it simply *is* visible.

Built-ins, created by the array's constructor and not deletable or editable: `untouched` (`u`), `visible` (`v`), `masked` (`m`). Their labels and aliases are reserved against `-newvt`.

## `untouched` exists as a type but is never stored

It is kept in the array so that `-crv <label>` validates uniformly through `getByLabel()` and so that `-dvt` can list it, but `VisibilityTileArray.set(tx, ty, untouched)` **deletes** the entry rather than storing it. Absence of a tile means `untouched` implicitly.

## Partition algorithm: Lipski/Ohtsuki, ported from the POC

The POC implements the full minimum rectangle partition of a rectilinear region, in ~170 lines:

0. 4-connected components, each partitioned independently.
1. Reflex (concave) vertices: grid points with exactly 3 of their 4 surrounding cells filled.
2. Chords: interior axis-aligned segments between **consecutive** reflex vertices in a row or a column.
3. Maximum independent set of chords: the intersection graph is bipartite H×V (two chords of the same orientation can never share an endpoint — that point would have all 4 cells filled and would not be reflex), so maximum matching (Kuhn) + König gives `keepH = H ∩ Z`, `keepV = V \ Z`.
4. Cut along the retained chords, then extend each remaining reflex vertex vertically until the region border or an already-drawn horizontal chord. Flood fill with the cuts as barriers yields the rectangles.

A greedy strip-merge was considered as a first pass and **rejected**: the POC already exists and is correct, and greedy loses badly on column-shaped regions (an `H` shape: 5 rectangles instead of 3).

### Porting constraints (the desync surface)

The partition result must be **byte-identical on every machine**. A different but equally valid partition means a different number of `CreateFogModifierRect` calls and a different handle id sequence. See `docs/LUA_PAIRS_AND_MEMORY_HANDLER.md` and `docs/CAUSES_OF_DESYNCS.md`.

| POC construct | Lua port |
| --- | --- |
| `byRow` / `byCol` as JS `Map` (insertion order guaranteed) | **must not** become a table walked with `pairs`. Replace with an ordered sweep (`for py = 0, N`) or an explicitly sorted array. This is the one real hazard: a different `H[]`/`V[]` order changes Kuhn's matching, hence the partition |
| `rows` Map in `emit()`'s fallback | same treatment |
| `decompose`, reflex scan, Kuhn, König, step 4 | already index-ordered loops and arrays — nothing to change |
| `cutH` / `cutV` / `used` sets | membership-tested only, order irrelevant |

### Scale adaptations (the POC runs on 32×32 = 1024 cells; a real map is ~256×256 = 65536)

- `emit()` and the reflex scan re-sweep the whole grid **per component**. Add a per-component bounding box and iterate only inside it.
- `new Uint8Array(N*N)` per component becomes a 65k-entry Lua table per component per recomposition. Replaced by sparse integer-keyed tables holding only the filled tiles, plus a component-number stamp instead of a cleared array — no dense allocation at all, so `MemoryHandler` pooling (`docs/MEMORY_HANDLER.md`) is not needed here. The partition runs on level transitions and on mouse-up, not per frame; if `-dvz` ever shows allocation pressure, pooling is the measured follow-up.
- Kuhn is O(V·E) with E up to |H|·|V|. Keep Hopcroft–Karp (O(E·√V)) in reserve if measurements demand it.
- The non-rectangular safety net in `emit()` should never fire with a correct construction. Keep it, but route it through the `Log` module so a real occurrence surfaces instead of silently producing extra modifiers.

## Persistence

Per level, in `-smic`, zones are stored rather than tiles — grouped by type so the label appears once per type per level, in **tile** coordinates:

```json
"visibilityTiles": [
  { "type": "blink", "rects": [[12,40,18,44], [20,40,24,41]] },
  { "type": "m",     "rects": [[0,0,60,10]] }
]
```

Game-wide, `jsonGameData.visibilityTypes` alongside `terrainTypesMec`, loaded **before** the levels (like `doorTypes`). `VisibilityTileArray.newFromJson()` expands zones back into tiles; the tile map is the runtime source of truth, zones are both a compression format and the compositor's output.

`mec-smic-loader` (separate repo) needs no change: it re-injects the JSON verbatim into `setGameData`.

## Backward compatibility

Legacy data becomes **read-only**. It loads, renders, and is re-exported by `-smic` unchanged, but nothing in-game can create more of it. A level is never in both modes at once (`Level.isLegacyVisibility()` = `this.visibilities.count() > 0`).

**Legacy rectangles stay outside the compositor.** They keep their own fog modifiers, activated exactly as today by `level.activateVisibilities()`, and the tile compositor runs alongside. Feeding them into the per-tile composition would mean rasterizing them onto the grid — they are in arbitrary world coordinates, not tile-aligned — and that would move their borders, which is precisely what "existing maps behave identically" forbids.

The documented cost: **an `m` tile cannot mask over a level left in legacy mode.** Two `FOG_OF_WAR_VISIBLE` modifiers coexist and the legacy one wins. It only bites on mixed maps (one legacy level and one new level in the same map), and the way out is `-convertVisibilities` on that level.

Two ways out of legacy for a level: `-convertVisibilities` (opt-in, warns that borders snap to the grid — **up to 64 units**, half a tile, since `roundCoordinateToCenterOfTile` rounds to the nearest multiple of `Constants.LARGEUR_CASE` = 128) or `-remv` (clear).

No automatic conversion on load: the requirement is that existing maps behave identically, and keeping `VisibilityModifier` alive costs almost nothing.

## Making feedback

`MakeHoldClick` has `MIN_TIME_BETWEEN_ACTIONS = null`, so `doMouseMoveActions` runs on every `EVENT_PLAYER_MOUSE_MOVE`. Recomposing on each of those would stall.

- Real-time feedback while painting comes from `DrawLine` overlays (the mechanism `-debugRegions` already uses in `Level.ts`), one colour per visibility type. A maker almost always has `-va` on anyway, so real fog feedback would show them nothing.
- The fog recomposition runs once per stroke, in `doUnpressActions`, and diffs the zone list so only changed modifiers are destroyed/created, with a single `RefreshHideAllVM()` at the end.

An incremental recomposition (re-partitioning only the affected types inside a dilated bounding box) is deliberately deferred: it reintroduces merges across the box border for little gain over the debounce.

# Naming

Settled after review of the initial proposal:

| Initial | Final | Reason |
| --- | --- | --- |
| `VisilityType` / `VisiblityType` | `VisibilityType` | typo |
| `startVisiblityType` | `startState: 'visible' \| 'masked'` | it is a state, not a type |
| `VisibilityTypeTile` / `TileVisibilityType` | `VisibilityTile` / `VisibilityTileArray` | both spellings were used; "VisibilityTypeTile" reads as "a kind of tile" |
| `VisibilityTypeZone` | `VisibilityZone` / `VisibilityZoneArray` | same |
| `-editVisibilityType` | one `-setVisibilityTypeXxx` per field | the repo has no generic `edit` command; terrain types use per-field setters |

# Commands

All aliases below were checked against the 376 aliases registered in `src/core/06_COMMANDS/Commands/` — no collision.

## New — visibility types (game-wide, `make` tier)

| Command | Alias | Args |
| --- | --- | --- |
| `-newVisibilityType` | `newvt` | `<label> <visibilityTypeStart> <visibleTime> <maskedTime>` — creates a periodic type, `visibilityTypeStart` being `visible\|v\|masked\|m` and both times > 0 |
| `-setVisibilityTypeLabel` | `setvtl` | `<label> <newLabel>` |
| `-setVisibilityTypeAlias` | `setvta` | `<label> <alias>` |
| `-setVisibilityTypeStart` | `setvts` | `<label> <visibilityTypeStart>` |
| `-setVisibilityTypeTimes` | `setvtt` | `<label> <visibleTime> <maskedTime>` |
| `-deleteVisibilityType` | `delvt` | `<label> [--force]` |
| `-displayVisibilityTypes` | `dvt` | `[<search>] [<page>]` — paginated, like `-dt` |

`-deleteVisibilityType` semantics:

| Case | Behaviour |
| --- | --- |
| unused type | deleted |
| used, without `--force` | refused, with the count so the author knows the stakes: `"visibility type 'blink' is used by 412 tiles in levels 3, 7, 9 - add --force to delete it and those tiles"` |
| used, with `--force` | type deleted **and** all its tiles removed from every level, then recomposition: `"visibility type 'blink' deleted, along with 412 tiles in levels 3, 7, 9"` |
| built-in, with or without `--force` | always refused: `"visibility type 'visible' is built in and can't be deleted"` |

Not undoable: `MakeAction` is bound to one escaper and one level, and a delete that crosses every level does not fit that model. That is why `--force` is explicit and why the refusal message gives the count first.

`--force` would be the **first `--flag` in the project** (the parser is positional, `-crtse` uses `key=value` tokens instead). It works without parser changes — `CmdName` only reads up to the first space, so a parameter starting with `-` is never mistaken for a command name.

## New — migration and debug (`make` tier)

| Command | Alias | Args |
| --- | --- | --- |
| `-convertVisibilities` | `convv` | `[<levelId>]` — opt-in conversion of a legacy level's rectangles into `visible` tiles, warning about the ≤ 64 unit border snap |
| `-debugVisibilityZones` | `dvz` | `<boolean>` — draws the computed zones and prints **the rectangle count per type and the partition time** |

## Reworked

`-createVisibility` / `crv`, `make` tier, `src/core/06_COMMANDS/Commands/4_make.ts:479`:

```
-crv <visibilityTypeLabel> [<brushSize> [<shape>]]
```

Two-click rectangle or hold-click brush, exactly like `-crt`. `-crv u` erases the tiles of the selected area. Three distinct paths:

| Input | Response |
| --- | --- |
| `-crv` (no parameter) | explicit error, **not** `USAGE` (see below) |
| `-crv` with 4+ parameters | `USAGE` |
| `-crv <label>` on a level still in legacy mode | `"level 3 still uses the old visibility rectangles - run -convertVisibilities first, or -remv to clear them"` |

The no-parameter case must say *why* the form is gone and *what to use instead*:

```ts
if (noParam) {
    const p = escaper.getPlayer()
    Text.erP(p, '-crv no longer creates a visibility rectangle on its own')
    Text.mkP(p, 'visibility is now painted per terrain tile, with a visibility type that can mask an area again, not only reveal it')
    Text.mkP(p, 'use "-crv <visibilityTypeLabel>" - built in types: u (untouched), v (visible), m (masked)')
    Text.mkP(p, 'type "-dvt" to list every visibility type, "-newvt" to create one')
    return true
}
```

## Legacy status

| Command | Alias | Source | Status |
| --- | --- | --- | --- |
| `-createVisibility` with no parameter | `crv` | `4_make.ts:479` | **Removed** — explicit error naming the replacement |
| `-removeVisibilities` | `remv` | `4_make.ts:535` | **Kept** — clears the level's tiles, or its legacy rectangles, depending on its mode |
| `-setLevelResetVisibilities` | `setlrv` | `4_make.ts:495` | **Soft-deprecated** — still honoured, legacy levels need it; `-help` text reworded |
| `-viewAll` | `va` | `3_cheat.ts:798` | **Untouched** — a cheat-tier override above the compositor |
| `-hideAll` | `ha` | `3_cheat.ts:813` | **Untouched** |

`-cancel`/`z` and `-redo`/`y` (`4_make.ts:610`, `:627`) are not visibility commands but drive the make actions, so they need a new action class for tile painting.

# Steps

One commit per step.

## Step 1 — Visibility types (no runtime rendering impact)

New files:

```
src/core/04_STRUCTURES/Visibility/VisibilityType.ts
src/core/04_STRUCTURES/Visibility/VisibilityTypeArray.ts
src/core/06_COMMANDS/Commands/4_make_visibility.ts
```

`VisibilityType` with the fields above plus `toJson` / `displayForPlayer` / `getColor` / `toText`, modelled on `TerrainType`. `VisibilityTypeArray extends BaseArray<VisibilityType>` with `getByLabel`, `isLabelAlreadyUsed`, `newPeriodic`, `remove(label, force)`, `toJson`, `newFromJson`, `displayPaginatedForPlayer`, and the three built-ins created in the constructor.

Wiring:

- `globals.ts` — `visibilityTypes?: VisibilityTypeArray`, `getUdgVisibilityTypes` / `setUdgVisibilityTypes`
- `src/core/Init/initArrays.ts` — `initVisibilityTypes()`, called from `initArrays()`
- `src/core/07_TRIGGERS/Save_map_in_gamecache/SaveMapInCache.ts` — `jsonGameData.visibilityTypes = getUdgVisibilityTypes().toJson()`
- `src/core/07_TRIGGERS/Load_map_from_gamecache/LoadMapFromCache.ts` — destroy + re-init in the `!currentlyOnGameStart` block, then `newFromJson` **before** `gameData.levels`
- `src/core/06_COMMANDS/Helpers/Command_execution.ts` — import `initExecuteCommandMake_visibility` (near line 18) and call it (near line 351)

Commands: `newvt`, `setvtl`, `setvta`, `setvts`, `setvtt`, `delvt`, `dvt`.

`-delvt` gets no `--force` here: nothing can reference a visibility type before the tiles exist, so there would be nothing to count and nothing to clear. It gains the flag and the usage scan in step 3.

**Verifiable**: create types in game, list them with `-dvt`, `-smic`, reload, they are still there.

## Step 2 — The partition

> Swapped with the tiles, which were step 2 in the first draft: `VisibilityTileArray.toJson()` stores zones, so it needs the partition. The partition being a pure function with no dependency, it comes first and the tiles use it straight away, instead of shipping a throwaway compression to be replaced one commit later.

New file:

```
src/core/04_STRUCTURES/Visibility/VisibilityPartition.ts
```

Port of the POC with the corrections listed above: ordered sweeps replacing every `Map`, per-component bounding boxes, sparse tables instead of dense per-component arrays, and the `emit()` safety net routed through `Log`.

**Verifiable**: an e2e test under `src/core/Test/e2e-tests/` running known masks (single rectangle, `H`, comb, frame with a hole, staircase, pinwheel, disjoint components) and asserting both the expected rectangle count and an exact cover with no overlap, plus the stability of two runs on the same mask. This is the only place in the project where a real assertion is possible, and it is worth having here.

The port was also checked outside the game before being committed: the module was run under Node against the POC itself on 400 random masks (rectangles painted then holes punched, the way `-crv` produces them), with identical rectangle counts on every one.

## Step 3 — Per-level tiles (still no rendering)

New file:

```
src/core/04_STRUCTURES/Visibility/VisibilityTileArray.ts
```

`VisibilityTileArray`: `set(tx, ty, type)` deleting the entry when the type is `untouched`, `get`, maintained bounding box, `clear`, `countByType`, `removeAllOfType`, `toJson` (zones grouped by type, tile coordinates, through `partitionTiles`), `newFromJson` (expansion back to tiles). Storage keyed by a tile index, iterated by an explicit row-major sweep over the bounding box — never `pairs`.

No `VisibilityTile` class: a tile is a `VisibilityType` reference at an index, and one Lua table per painted tile would cost far more than the reference itself for nothing.

Changes:

- `src/core/04_STRUCTURES/Level/Level.ts` — `visibilityTiles` field, added to the constructor, `destroy()` and `toJson()` (`json.visibilityTiles`), plus `isLegacyVisibility()`
- `src/core/04_STRUCTURES/Level/LevelArray.ts` — read `levelJson.visibilityTiles` in `newFromJson` next to the existing `levelJson.visibilities` branch (`:416`)
- `-delvt` gains `[--force]` and the usage scan across every level

**Verifiable**: tiles survive a `-smic` round trip; an old map's `visibilities` field is re-exported untouched.

## Step 4 — The compositor (rendering switches over here)

New files:

```
src/core/04_STRUCTURES/Visibility/VisibilityZone.ts
src/core/04_STRUCTURES/Visibility/VisibilityZoneArray.ts
src/core/04_STRUCTURES/Visibility/VisibilityCompositor.ts
```

`VisibilityZone`: tile-coordinate bounds, its type, its `fogmodifier`, `activate()`. `VisibilityZoneArray`: game-wide, the compositor's output.

`VisibilityCompositor.refresh()`:

1. Walk the active level stack highest-first, resolving each tile (`untouched` transparent, `resetVisiblitiesAtStart` truncates). Legacy modifiers are not part of this walk — they keep being driven by `level.activateVisibilities()`.
2. Drop the `untouched` and `masked` tiles.
3. Partition each remaining type's mask.
4. Diff against the current zones; destroy and create only what changed; one `RefreshHideAllVM()` at the end.
5. One timer per periodic type, started when the type gains its first zone, stopped when it loses its last.

`LevelArray.refreshVisibilities()` (`:253`) delegates to the compositor. Its five callers stay untouched: `LevelArray.ts:155`, `LevelArray.ts:197`, `Level.ts:553`, `EscaperMake.ts:130`, `start_first_level.ts:8`.

**Verifiable**: an old map renders exactly as before; a new map with `m` tiles masks over a lower level's reveal.

## Step 5 — Making

New files:

```
src/core/05_MAKE_STRUCTURES/Make_visibility/MakeVisibility.ts        // extends MakeOneByOneOrTwoClicks
src/core/05_MAKE_STRUCTURES/Make_visibility/MakeVisibilityBrush.ts   // extends MakeHoldClick
src/core/05_MAKE_STRUCTURES/MakeLastActions/MakeVisibilityTileAction.ts
```

`MakeVisibilityTileAction` records the previous type per tile, on the model of `ChangingTile` in `MakeTerrainCreateBrush.ts` — the current `MakeVisibilityModifierAction` only stores the created object, which is not enough for tile painting. `DrawLine` overlay while painting, single recomposition in `doUnpressActions`.

`EscaperMake.makeCreateVisibility(visibilityType, brushSize?, shape?)` replaces `makeCreateVisibilityModifier()` (`EscaperMake.ts:809`). `-crv` rewritten with its three paths.

**Verifiable**: paint, undo with `-z`, redo with `-y`, check the fog follows.

## Step 6 — Cleanup, migration, documentation

Dead code to delete:

- `src/core/05_MAKE_STRUCTURES/Make_start_end_visibilityModifier/MakeVisibilityModifier.ts` (whole file)
- `src/core/05_MAKE_STRUCTURES/MakeLastActions/MakeVisibilityModifierAction.ts` (whole file)
- `VisibilityModifier.copy()` — its only caller was the undo action above
- `Level.newVisibilityModifier()` and `Level.newVisibilityModifierFromExisting()` (`Level.ts:300`, `:304`) — the JSON load path goes through `level.visibilities.newFromJson()`, not through them
- `VisibilityModifierArray.newFromExisting()`
- `EscaperMake.makeCreateVisibilityModifier()` (`:809`)
- `LevelArray.getLevelFromVisibilityModifierArray()` (`:575`) — **already** has no caller today

Still alive on the legacy side: `VisibilityModifier` (constructor, `activate`, `destroy`, `toJson`) and `VisibilityModifierArray.new` / `newFromJson` / `removeAllVisibilityModifiers` / `activate`.

Then: `-convertVisibilities`, `-debugVisibilityZones`, `yarn generate-help`, a new `docs/VISIBILITY.md` listed in `CLAUDE.md` and in `ARCHITECTURE.md`.

# Validation

There is no headless test suite (see `CLAUDE.md`), so beyond the step-3 e2e assertions everything is manual through `yarn test-launch`.

The one that matters at the end: **the two-instance LAN test**. The partition must produce the exact same rectangle list on both machines. It is the only way to confirm the Lipski port did not reintroduce an iteration-order dependency — the failure mode would be a desync, not a visual glitch.
