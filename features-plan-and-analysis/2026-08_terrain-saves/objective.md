# Terrain Saves — Objective

## Save / load terrains

- New class `TerrainSave`
- New class `TerrainSaveArray extends BaseArray<TerrainSave>`
- `TerrainSave`s won't be linked to levels.
- `TerrainSave`s will now be persisted with `-smic`.

### Commands

- `saveTerrain` (`st`) `<label> [all|rect]` ⇒ improve this existing command
  - save the whole terrain or a terrain zone (MECRegion of type `horizRect`) into a name
- `loadTerrain` (`lt`) `<label>` ⇒ improve this existing command
  - apply the terrain `<label>` at the specified zone
- `displayTerrainSave` (`dts`) `[<label>]`
  - without specified label, displays names of all terrainSaves and "whole map" or MECRegion text
  - with label, displays name of terrainSave, "whole map" or MECRegion detailled text + move camera to the center of the zone (except if whole map) and displays debugRects of the mecRegion (with the difference that it would encircle the exact tiles with straight lines — dev at the end)
- `updateTerrainSave` (`uts`) `<label> [all|<mecRegionShape>]`
  - update the terrain data according to the specified zone (redraw the zone if the second parameter is present and different than "all")
- `deleteTerrainSave` (`delts`) ⇒ improve this existing command
  - remove the terrain save and their associated events
- `terrainSaveEnableMinimap` `all|<label> <boolean>`
  - if minimap is enabled for a terrain save, will generate a minimap blp with `mec-smic-loader` for it, that will be applied/unapplied at the same time of the terrain save

## Events to apply terrain saves during the game

Events will be stored in the `TerrainSave` class.

- **on level starting**
  - with a potential delay, would apply or unapply a terrain save
  - and / or with periodic timer that would apply / unapply the loaded terrain
- **on level ending**
  - would apply or unapply a terrain save
- **on monster touching**
  - with a potential delay, would apply or unapply a terrain save
  - and / or with periodic timer that would enable / disable the loaded terrain

A terrain save could be unapplied only after being applied (an application of it will save the previous terrain state to be able to unapply).

### Commands to manage terrain saves events

*(todo: complete these commands descriptions)*

- `createTerrainSaveEvent`
- `removeTerrainSaveEvent`
- `changeEventTerrainSave` (change the terrain save associated to an event)
- `displayTerrainSaveEvent` (`dtse`) `<terrainSaveLabel> [<eventId>]`
  - without `<eventId>` will display info data of all events, with an id for each (id absolute, not relative to the terrain save)
  - with `<eventId>` display info of the specified event and move camera to the linked monsters if exists

## Potential improvements

- `saveTerrain` (`st`) `<label> [all|<mecRegionShape>]`
