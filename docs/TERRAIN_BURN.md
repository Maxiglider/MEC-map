# Terrain burn

A burn terrain is a death terrain that spreads over the slide tiles next to it, one tile further at each propagation time. Only the burn tiles of the level being played start a fire, but that fire reaches any slide tile.

## The terrain type

`TerrainTypeBurn` (`src/core/04_STRUCTURES/TerrainType/TerrainTypeBurn.ts`) extends `TerrainTypeDeath`, with the kind `'burn'`. It kills exactly as a death terrain does: killing effect, time to kill and tolerance, set by the usual `-settke`, `-settkd` and `-settkt`. `isDeathTerrain()` is true for both kinds, so anything asking "does this kill" should go through it rather than compare `getKind()` to `'death'`. The one exception is the theme command in `2_first_player.ts`, which swaps the look of the death terrains only: a burn terrain keeps its own.

| property            | unit              | meaning                                                                            |
| ------------------- | ----------------- | ---------------------------------------------------------------------------------- |
| `propagationTime`   | seconds           | the time the fire takes to reach the next tile                                     |
| `burningTime`       | propagation times | how long a reached tile burns before getting its slide terrain back. `0`: for good |
| `burningEffect`     | model path        | shown on the reached tiles, not on the sources. `none` for no effect               |
| `burningEffectTime` | propagation times | how long that effect lasts. `0`: as long as the tile burns                         |
| `timeToBurnAgain`   | propagation times | how long a tile back to slide cannot burn again                                    |

## How the fire runs

The tiles painted with a burn terrain type are the **sources**. They burn for good and never change.

At each tick, every burning tile — the sources and the tiles already reached — sets fire to the slide tiles on its four sides, unless another fire already holds a tile or it is still in its `timeToBurnAgain` cooldown. A tile catching fire at a tick spreads from the next tick only. A slide terrain type with `canBurn` false (`-settcb`, true by default, saved with the type) is never reached. The reached tile takes the burn terrain type, so the terrain check kills a hero on it as it would on any death terrain.

Since the sources burn for good, a finite `burningTime` with a `timeToBurnAgain` gives waves of fire leaving the sources again and again. `burningTime 0` gives a fire that eats its way through the level and stays.

## Which level a tile belongs to

A level does not say which tiles are its own, so `computeBurnZone()` (`TerrainBurn/BurnZone.ts`) finds them from its start rect.

A level's **start zone** is the walk tiles whose centre is in its start rect, and every walk tile linked to them by a side — not the rect alone. Then the level's tiles are:

1. Its start zone, and every walk or slide tile linked to it by a side, found by a flood. The flood does not enter the **next** level's start zone.
2. Minus what the same flood from the **previous** level's start zone reaches, not entering this level's start zone: that ground is the previous level's.

A start zone linked by walk ground to the next one is therefore entirely the next level's, and its level gets no tiles: two levels need slide or something else between their starts.

A source belongs to the level when it touches one of these tiles. The zone decides nothing else: once lit, the fire reaches any slide tile next to it, whether the zone holds it or not, and whether it was already slide when the level started or not. The zone is read from the terrain as it is when the level starts, so a maker painting terrain sees it counted the next time the level starts.

## Lifetime

`LevelTerrainBurns` (one per `Level`, `level.terrainBurns`) lights one `TerrainBurnRunner` per burn type having sources in the level when the level starts, and puts them all out when it ends: every reached tile gets its slide terrain back, unless a maker painted another terrain over it meanwhile. Nothing of this state is saved; the burn terrain types are, with the other terrain types.

The checkpoint revival — every hero dead, a life lost, the heroes back at the start (`loseALifeAndRes`) — resets the fires of the levels of the revived heroes: the reached tiles become slide again, the cooldowns are forgotten and the fires are lit anew from their sources, the zone being computed again. A single hero's revival (`-revive`, autorevive) leaves them as they are.

A property change applies at once, except the propagation time, which is the period of the runner's timer: that one applies from the next level start.

## Desyncs

The terrain changes and the effects are game state, so every machine must make the same ones in the same order (see [CAUSES_OF_DESYNCS.md](./CAUSES_OF_DESYNCS.md)):

- One periodic timer per runner and every duration counted in its ticks, rather than a timer per tile.
- The tiles are only ever walked through arrays, in the order the flood or the fire reached them. The tables keyed by tile index are only read by key, never walked with `pairs`.
- The burn types are sorted by label before their runners start, since two of them reaching the same tile at the same tick give it to the first one.

`burningTileOriginals` (`TerrainBurn/BurningTiles.ts`) is shared by every runner: it keeps two fires from taking the same tile, and it lets a zone be computed from the real terrain of a tile another fire is burning - one that may have come from another level.

## Saving

The fire is not part of the map. The `-smic` terrain export (`Save_terrain.ts`) and a terrain save's capture (`TerrainSave.captureTerrain`) read a burning tile as the slide terrain it really is, through `BurningTiles.ts`. That module imports only `TileCoordinates`, on purpose: the savers must not pull the levels in, or the bundle's `require` meets a cycle and MEC does not load.

## Commands

| Command                                                                                                                          | Alias     | What it does                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-newBurn <label> <terrainType> [<propagationTime> [<burningTime> [<burningEffect> [<burningEffectTime> [<timeToBurnAgain>]]]]]` | `newb`    | A new burn terrain type. Defaults: `1` second, `3`, no effect, `0`, `3`                                                                                         |
| `-terrainBurn <boolean>`                                                                                                         | `terb`    | Lights or puts out the fires of the levels being played, the reached tiles becoming slide again. On by default, for this game only: not saved, `-smic` included |
| `-setTerrainCanBurn <slideTerrainLabel> <canBurn>`                                                                               | `settcb`  | Whether the fire can reach a slide terrain. True by default                                                                                                     |
| `-setTerrainBurnPropagationTime <burnTerrainLabel> <propagationTime>`                                                            | `settbpt` | From the next level start                                                                                                                                       |
| `-setTerrainBurningTime <burnTerrainLabel> <burningTime>`                                                                        | `settbt`  |                                                                                                                                                                 |
| `-setTerrainBurningEffect <burnTerrainLabel> <burningEffect>`                                                                    | `settbe`  | `none` removes it                                                                                                                                               |
| `-setTerrainBurningEffectTime <burnTerrainLabel> <burningEffectTime>`                                                            | `settbet` |                                                                                                                                                                 |
| `-setTerrainTimeToBurnAgain <burnTerrainLabel> <timeToBurnAgain>`                                                                | `setttba` |                                                                                                                                                                 |
