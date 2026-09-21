# Visibility

How MEC decides what a player sees of the map, and what the authoring commands actually write.

Everything below sits on one permanent fact: `initViewAllHideAll()` (`src/core/03_view_all_hide_all/View_all_hide_all.ts`) creates `udg_hideAll`, a `FOG_OF_WAR_MASKED` modifier over `GetWorldBounds()`, and starts it. **The map is black by default**, and every visibility feature is about carving holes in that black.

## The old system, still there for existing maps

`src/core/04_STRUCTURES/Level/VisibilityModifier.ts` + `VisibilityModifierArray.ts`: one `FOG_OF_WAR_VISIBLE` fog modifier per authored rectangle, held by a level, in arbitrary world coordinates. `LevelArray.refreshVisibilities()` activates them cumulatively up to the level being played or made, and `resetVisiblitiesAtStart` (the `-setlrv` command) cuts that stack off.

Its limitation, and the reason for everything that follows: **reveal is the only operation it can express.** A revealed area cannot be hidden again without switching off the very modifier that reveals it.

This system is now **read only**. It loads, renders and is re-exported by `-smic` exactly as before, but nothing in the game creates any more of it. A level gets out of it with `-convertVisibilities` (which turns its rectangles into tiles, their borders snapping onto the terrain grid by up to half a tile) or `-remv` (which clears them). `Level.isLegacyVisibility()` carries the invariant that a level holds either the rectangles or the tiles, never both.

## The per-tile system

### What a level stores

`VisibilityTileArray` (one per level, `Level.visibilityTiles`) holds a `VisibilityType` reference per terrain tile — not an object per tile, which in Lua would cost far more than the reference. A tile nothing was painted on has **no entry at all**, and that absence is what "untouched" means, which is why painting the `untouched` type deletes rather than stores.

Tile coordinates come from `TileCoordinates.ts`. The grid is the one the rest of MEC uses (`roundCoordinateToCenterOfTile`): a tile centre sits on a multiple of `Constants.LARGEUR_CASE` (128), anchored on the world origin, so a tile index can be negative.

### The visibility types

`VisibilityType` / `VisibilityTypeArray`, game-wide, on the model of `TerrainType`. A type has a `kind`:

| kind | what it does to a tile |
| --- | --- |
| `untouched` | nothing — the tile falls through to the level below |
| `visible` | shown |
| `masked` | hidden, **even if a lower level reveals it** |
| `periodic` | alternates, from `startState`, `visibleTime` seconds shown and `maskedTime` seconds hidden |

The first three are built in (`u`, `v`, `m`), rebuilt by the array's constructor on every load, so they are neither serialized nor editable nor deletable. Only `periodic` types are made by authors, with `-newvt`.

There is no `-1` sentinel for "infinite": `visible` is not visible for minus one seconds, it simply is visible. That is what the `kind` field buys.

### Composition

`VisibilityCompositor.refresh()` receives the active levels **highest id first** — `LevelArray.refreshVisibilities()` builds that list while doing its usual walk — and resolves each tile with the first type to claim it winning:

```
composed[tile] = the type of the highest active level that defines this tile
                 (untouched = transparent, fall through)
```

`resetVisiblitiesAtStart` truncates that stack, as it always did.

Then, and this is the part that keeps the fog modifier count down: **only what ends up visible produces a modifier.** An `untouched` tile has none, and a `masked` tile has none either — the permanent world mask already hides it. No `FOG_OF_WAR_MASKED` modifier is ever created by this system.

### From tiles to fog modifiers

A fog modifier per tile would be unusable, so each type's composed tiles are partitioned into the **minimum** number of rectangles by `VisibilityPartition.ts` (Lipski/Ohtsuki — concave vertices, chords between consecutive ones, maximum independent set through a bipartite matching and König, then the cuts). One `VisibilityZone` per rectangle, one fog modifier per zone.

`VisibilityZoneArray.applyRequests()` diffs rather than rebuilds: a recomposition usually leaves most rectangles where they were.

All the zones of a periodic type share **one** timer, so they blink in step, and a zone born of a later recomposition joins the cycle where the others already are. Two zones in opposite phase are two types with opposite `startState`, not a per-zone setting.

### Why the old rectangles are not composed

They are in arbitrary world coordinates, not aligned on the tile grid. Feeding them into a per-tile composition would mean rasterizing them, which moves their borders by up to half a tile — and an existing map has to render exactly as it did. So they keep being driven by `Level.activateVisibilities()`, beside the compositor rather than inside it.

**The cost of that choice**: a `masked` tile cannot hide what a level left in legacy mode reveals. Two `FOG_OF_WAR_VISIBLE` modifiers coexist and the legacy one wins. It only bites on a map mixing a legacy level and a painted one; `-convertVisibilities` on that level is the way out.

## Desyncs

The partition is the sharp edge. Two machines must compute **the same rectangles in the same order**: a different but equally valid partition means a different number of `CreateFogModifierRect` calls and a different handle id sequence (see [CAUSES_OF_DESYNCS.md](./CAUSES_OF_DESYNCS.md) and [LUA_PAIRS_AND_MEMORY_HANDLER.md](./LUA_PAIRS_AND_MEMORY_HANDLER.md)).

So `VisibilityPartition.ts` breaks every tie by an explicit index order and never walks a table with `pairs` — in particular its concave vertices are gathered by two ordered sweeps, row major then column major, rather than grouped into a table and read back. `VisibilityZoneArray` likewise only ever walks its zones by index, so modifiers are created and destroyed in the same order everywhere.

`pairs` is used in `VisibilityTileArray`, and only for walks whose answer cannot depend on the order: a count, a min/max, a set of deletions, and the composition's "paint if absent" (a tile index appears once and only once there).

The partition's duration, measured with `os.clock()` for `-dvz`, is a local value: it is shown to the player who asked and to nobody else, and nothing in the game reads it.

## Persistence

Game-wide, `jsonGameData.visibilityTypes`, loaded **before** the levels, like `doorTypes`. The built-ins are left out.

Per level, `json.visibilityTiles` — not the tiles but the rectangles they partition into, grouped by type, in tile coordinates:

```json
"visibilityTiles": [
  { "type": "blink", "rects": [[12,40,18,44], [20,40,24,41]] },
  { "type": "masked", "rects": [[0,0,60,10]] }
]
```

`newFromJson()` expands them back into tiles, which stay the runtime source of truth. The old `json.visibilities` is written and read exactly as before, beside it.

`mec-smic-loader` needs no change: it re-injects the JSON verbatim (see [SMIC_PIPELINE.md](./SMIC_PIPELINE.md)).

Note for the Lua side: `typescript-to-lua` only shifts an index to Lua's 1 based tables when it knows the value is an array. Reading a rectangle straight off the `any` the json decoder returns, `rect[0]` stays `rect[0]` in Lua and comes back nil — hence the `number[][]` annotation in `VisibilityTileArray.newFromJson()`.

## Commands

| Command | Alias | What it does |
| --- | --- | --- |
| `-createVisibility <typeLabel> [<brushSize> [<shape>]]` | `crv` | Paints tiles of the making level, two clicks or brush. `-crv u` erases. Without a parameter it explains what the old form became |
| `-removeVisibilities [<levelId>]` | `remv` | Empties a level, tiles and old rectangles alike |
| `-convertVisibilities [<levelId>]` | `convv` | Turns a legacy level's rectangles into `visible` tiles. Cannot be undone |
| `-newVisibilityType <label> visible\|v\|masked\|m <visibleTime> <maskedTime>` | `newvt` | A new periodic type |
| `-setVisibilityTypeLabel` / `-setVisibilityTypeAlias` | `setvtl` / `setvta` | Rename, alias |
| `-setVisibilityTypeStart <label> visible\|v\|masked\|m` | `setvts` | Which state the cycle starts on |
| `-setVisibilityTypeTimes <label> <visibleTime> <maskedTime>` | `setvtt` | Both durations |
| `-deleteVisibilityType <label> [--force]` | `delvt` | `--force` also removes the type's tiles from every level. Not undoable, which is why it is spelled out |
| `-displayVisibilityTypes [<label>] [page]` | `dvt` | Lists the types |
| `-debugVisibilityZones on\|off` | `dvz` | Outlines the zones, and reports their count per type and the partition's duration |
| `-setLevelResetVisibilities <boolean> [<levelId>]` | `setlrv` | Still truncates the composition stack. Largely superseded by painting `m` |
| `-viewAll` / `-hideAll` | `va` / `ha` | Untouched: a cheat-tier override sitting above all of this |

`-dvz` is also the visual feedback while painting: it redraws at each recomposition, which is once per stroke. The fog itself is recomposed then too — never on a mouse move, `EVENT_PLAYER_MOUSE_MOVE` firing with no throttle at all.

## Testing

`-e2e run visibilityPartition` asserts the partition over twelve known shapes, checking both the minimum rectangle count and an exact cover with no overlap, plus that two runs on the same mask agree. The `H` shape is the telling one: a greedy row merge gives 5 rectangles there where the minimum is 3.

What that cannot cover is the thing that matters most — that two machines agree. Only the two-instance LAN test does, and it is what a change to `VisibilityPartition.ts` has to go through.
