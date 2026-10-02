# Terrain

This documents how terrain is represented, read, and mutated at runtime — and, deliberately, the **gap between the two disconnected terrain-persistence mechanisms that already exist**: a primitive session-only save/load command pair, and the much richer (but one-directional) terrain capture used by [the `-smic` export](./SMIC_PIPELINE.md). Anyone designing a new terrain-persistence feature (e.g. zone-scoped, `-smic`-backed terrain saves) needs to know both exist and don't currently talk to each other.

## `TerrainType` / `TerrainTypeArray`

`TerrainType` (`src/core/04_STRUCTURES/TerrainType/TerrainType.ts:14`, abstract) is MEC's typed wrapper around a WC3 terrain tile type, exposing `getTerrainTypeId()` (line 80) — the raw numeric ID WC3 natives expect. The global registry, `TerrainTypeArray`, is accessed via `getUdgTerrainTypes()` (same global-collection pattern as `getUdgMonsterTypes()`, see [ARCHITECTURE.md](../ARCHITECTURE.md)).

`TerrainTypeArray.getTerrainType(x, y)` (`TerrainTypeArray.ts:46`) is the read path: normally it just wraps the raw `GetTerrainType(x, y)` native, but when `globals.USE_VTOTO_SLIDE_LOGIC` is enabled it instead resolves through `MazeUtils.getHVTileAt`/`getDiagonalTileAt`, falling back to averaging the diagonal neighbors' tile types when the direct lookup is empty — a map-specific slide-terrain convention layered on top of the raw native.

## Low-level mutation

`src/core/07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions.ts`:

- `ChangeTerrainType(x, y, terrainTypeId)` (line 8) — thin wrapper over the raw native `SetTerrainType(x, y, terrainTypeId, -1, 1, 0)`.
- `ChangeTerrainBetween(terrainType, x1, y1, x2, y2)` (line 12) — the closest existing precedent for a "zone-scoped" terrain operation: normalizes the two corners into min/max bounds, then nested-loops `x`/`y` in `Constants.LARGEUR_CASE` (tile size) steps calling `ChangeTerrainType` on each tile. **It takes raw coordinates, not a `MECRegion`** — there's no existing helper that takes a `MECRegion`/`HorizontalRectangleRegion` and iterates its tiles directly.

## The existing `-saveTerrain` / `-loadTerrain` / `-deleteTerrainSave` commands

Registered in `src/core/06_COMMANDS/Commands/5_admin.ts` (`saveTerrain`/`st`, `loadTerrain`/`lt`, `deleteTerrainSave`/`delts`), all thin wrappers around `SaveLoadTerrain` (`src/core/07_TRIGGERS/Triggers_to_modify_terrains/Save_load_terrain.ts`) — a module-level singleton (`initSaveLoadTerrain()` called once at import time, line 69), not a proper class/collection.

This is the mechanism `features-plan-and-analysis/2026-08_terrain-saves/objective.md` explicitly calls out to "improve", and its current limitations define the gap that spec needs to close:

- **Storage** is a bare `Map<string, (TerrainType | null)[][]>` keyed by save name (line 8) — no id, no metadata, no class of its own.
- **Always whole-map**: both `SaveTerrain` and `LoadTerrain` iterate the _entire_ map (`globals.MAP_MIN_X/MAX_X/MIN_Y/MAX_Y`, stepping by `Constants.LARGEUR_CASE`) — there is no zone/region scoping at all today, let alone one expressed as a `MECRegion`.
- **Terrain type only**: each tile stores just a `TerrainType` reference (or `null`) — no heights, cliffs, ramps, or tileset data, unlike the `-smic` export below.
- **Session-only**: `terrainSaves` is an in-memory `Map` local to this module. It is never serialized — not written to the `-smic` JSON, not persisted across a map reload. Reloading a saved game (`LoadMapFromCache`) loses every terrain save made with this command.

## The `-smic` terrain export (richer, but one-directional)

`PushTerrainDataIntoJson(json)` (`src/core/07_TRIGGERS/Save_map_in_gamecache/Save_terrain.ts`), called from `SaveMapInCache.gameAsJsonString()` as part of [the `-smic` pipeline](./SMIC_PIPELINE.md), captures what the game can change of the terrain: a `formatVersion` (2), main tileset, deduped/ordered terrain-type IDs, a flattened per-tile terrain-type-index string (`SaveTerrain`, same function name as — but unrelated to — `SaveLoadTerrain`'s `SaveTerrain`, easy to confuse when grepping), map dimensions/center offset, the height modifications made in the game (`terrainHeightModifications`) and playable-area/camera-bounds info (`SaveBoundsInfo`).

No height, cliff level nor ramp is exported: `mec-smic-loader` keeps them from the base map, which it requires. Format 1 exported the height of every tilepoint as read with `GetLocationZ`, which includes the half or quarter cliff level the game adds on ramps: the loader had to guess that raise back from the ramp flags, guessed wrong on ramps ending against an odd cliff or meeting at a corner, and every round trip moved those tilepoints by 32 or 64 more (up to ±1300 on New Slide, 2026-10-02).

### Terrain height modifications

`-terrainHeight` (`MakeTerrainHeightAction`) makes a permanent `TerrainDeformCrater`, and `-cancel` stops it. Each also adds or takes back its crater in `terrainHeightModifications` (`src/core/04_STRUCTURES/TerrainHeight/TerrainHeightModifications.ts`): `{ tileId: modification }`, the tileId being `y * (tilepoints in a row) + x` from `MAP_MIN_X/Y`, the order of `war3map.w3e`. A crater of that radius and height raises every tilepoint closer than the radius by `height * cos(π/2 * distance / radius)` — measured in the game to 0.002 on flat ground, ramps and cliffs on 2026-10-02 — so the modifications are computed, not read: `GetLocationZ` only shows a crater some frames later, and not on every part of the terrain at once. They are kept as reals and rounded only by `toJson()`, which `-smic` alone calls: `[tileId1, modification1, tileId2, modification2, ...]`, sorted by tileId, zeros left out. The loader adds `4 × modification` to the ground height of each.

Two things worth flagging for anyone touching this path:

- `SaveTerrain(json)` carries an explicit `// 2 MB leak` comment in the code (`Save_terrain.ts:145`) — a known, unresolved memory cost of this capture, presumably acceptable because `-smic` is a one-off authoring action, not something run repeatedly during play.
- **There is no reverse "apply terrain from this JSON" function anywhere in this repo.** This JSON is only ever consumed externally, by the separate `mec-smic-loader` tool, which rebuilds a binary `war3map.w3e` file from it (see [docs/SMIC_PIPELINE.md](./SMIC_PIPELINE.md#mec-smic-loader-the-companion-tool)) — it is not read back by any in-game/runtime code. Unlike the primitive `-loadTerrain` command (which _does_ apply saved terrain live, but only from same-session memory), nothing today applies `-smic`-captured terrain data live, in-engine.

This is the central gap `objective.md`'s "TerrainSaves will now be persisted with `-smic`" goal needs to resolve: it implies an in-engine reverse path (JSON → live terrain, on demand, scoped to a zone) that doesn't exist yet for this richer data shape — it would need to be built essentially from scratch, informed by what `PushTerrainDataIntoJson` captures and by the existing `LoadTerrain`/`ChangeTerrainType` mutation primitives above.

## Zone scoping

MEC already has a general-purpose "arbitrary zone" abstraction — `MECRegion` and its `HorizontalRectangleRegion` subtype (the `horizRect` kind) — used across the engine for exactly this kind of "operate on this piece of the map" need. See [ARCHITECTURE.md § MEC Regions](../ARCHITECTURE.md#mec-regions) rather than re-deriving it here. No terrain code currently consumes a `MECRegion` directly (see `ChangeTerrainBetween` above) — any new zone-scoped terrain feature would be the first to bridge `MECRegion` bounds (`getMinX()`/`getMaxX()`/`getMinY()`/`getMaxY()`) into a tile-iteration loop.
