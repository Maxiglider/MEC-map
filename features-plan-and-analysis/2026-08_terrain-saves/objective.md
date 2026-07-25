# Terrain Saves — Objective

> Final, agreed design. For the full technical implementation plan (classes, file paths, exact algorithms), see [`dev-plan-WIP.md`](./dev-plan-WIP.md) in this same folder.

## Save / load terrains

- New class `TerrainSave`
- New class `TerrainSaveArray extends BaseArray<TerrainSave>` — a single **global** collection (not per-level).
- A `TerrainSave` can optionally be associated with a specific level, or be global (usable from any level). Default: associated with the level currently being made, unless explicitly created as `global`/`g`.
- A `TerrainSave`'s identity is the pair **(label, level)** — the same label can exist independently at several different levels. However, a label used as a **global** terrain save cannot also be used at any level, and vice versa.
- A terrain save's label cannot start with a digit or with `-` (both reserved for addressing, see below).
- Addressing: any command taking a terrain save label (except the creation label on `saveTerrain`) accepts a `x-label` prefix (`x` = level number) to target a specific level's save explicitly. A bare label (no prefix) resolves to the global save first, then the current level's save.
- `TerrainSave`s will now be persisted with `-smic`.

### Commands

- `saveTerrain` (`st`) `<label> [all|rect] [global|g]`
  - save the whole terrain or a terrain zone (MECRegion of type `horizRect`) into a name. Defaults to the current level unless `global`/`g` is passed. Errors if the label already exists for that (label, level) pair, or violates the global/level exclusivity rule.
- `loadTerrain` (`lt`) `<label>`
  - apply the terrain `<label>` (zone is intrinsic to the terrain save, no longer a parameter)
- `unloadTerrain` (`ult`) `<label>`
  - unapply the terrain save `<label>`, restoring the terrain to what it was right before it was applied. Error if not currently applied.
- `displayTerrainSave` (`dts`) `[<label>|<levelNum>|global|g|current|c] [page]`
  - without parameter, displays every terrain save regardless of level/global, paginated
  - a plain number shows only that level's terrain saves; `global`/`g` or `current`/`c` filter accordingly
  - with a label, displays name, level (or "global"), "whole map" or MECRegion detailled text + move camera to the center of the zone (except if whole map) and displays debugRects of the mecRegion
- `updateTerrainSave` (`uts`) `<label> [all|rect]`
  - update the terrain data according to the specified zone (redraw the zone if the second parameter is present and different than "all")
- `deleteTerrainSave` (`delts`) `<label>`
  - remove the terrain save and its associated events. Does **not** touch the live terrain, even if the save is currently applied — the map is left exactly as it looks at the moment of deletion.
- `setTerrainSaveLevel` (`settsl`) `<label> <levelNum>|global|g|current|c`
  - move a terrain save between levels, or to/from global — subject to the same exclusivity rule as creation.

## Events to apply terrain saves during the game

Events will be stored in the `TerrainSave` class.

- **on level starting**
  - with a potential delay, would apply or unapply a terrain save
  - and / or with periodic timer that would apply / unapply the loaded terrain, starting from the configured action once the (optional) delay has elapsed
- **on level ending**
  - would apply or unapply a terrain save
- **on a hero touching a specific monster**
  - only a hand-placed monster (not one produced by a monster spawn) can be targeted, and always by clicking on it in-game — never by typing an id.
  - with a potential delay, would apply or unapply a terrain save
  - and / or with periodic timer that would enable / disable the loaded terrain
  - if the targeted monster also has the "book of life" property (`setMonsterLifeBonus`), the book of life behavior takes priority and the event never fires — this mirrors how every other special monster-touch interaction (clear mob, portal mob, circle mob, jump pad, god mode) is already mutually exclusive with the others.
  - if the targeted monster is later deleted, the event is kept (not deleted) but becomes permanently unusable (until fixed with command "-editTerrainSaveEvent <eventId> target") — `displayTerrainSaveEvent` shows this with a warning in orange.

A terrain save could be unapplied only after being applied (an application of it will save the previous terrain state to be able to unapply). Re-applying an already-applied terrain save re-paints its content without touching the saved "previous state" snapshot, so the original state is never lost as long as at least one `apply()` happened since the last `unapply()`.

An event can also have a `duration`: independently of `periodic`, once the (possibly delayed) configured action has fired, waiting `duration` seconds then automatically performing the opposite action once (e.g. apply, then auto-unapply after `duration` seconds) — useful for a temporary terrain change.

`periodic` also accepts an asymmetric `<time1>-<time2>` value instead of a single number: the toggle alternates between `time2` seconds in the action-matching state (e.g. applied, if the event's action is apply) and `time1` seconds in the opposite state, instead of the same duration each way. A plain `<seconds>` value N is shorthand for `<N/2>-<N/2>`. Implementation-wise this is two periodic timers sharing interval `time1 + time2`, the second one started `time1` seconds after the first via a one-shot delay timer, so their interleaved firings alternate `time1`/`time2` apart - the very first firing (at `time1 + time2`) is the one exception, always arriving later than the steady-state cadence.

An event can also have an `onLvlEnd` (only valid, and only ever fires, when there's a level to hook into: the terrain save's own level if it's level-scoped, otherwise the event's own level if its condition is `levelStart`/`levelEnd`): `apply`/`unapply` forces that action when that level ends, regardless of the event's own delay/periodic/duration state; `stop` just cancels any currently-running delay/periodic timer without applying or unapplying anything.

### Commands to manage terrain saves events

- `createTerrainSaveEvent` (`ctse`) `<terrainSaveLabel> <apply|unapply> <levelStart|levelEnd|monsterTouch> [delay=<seconds>] [periodic=<seconds>|<time1>-<time2>] [duration=<seconds>] [onLvlEnd=apply|unapply|stop]`
  - for `levelStart`/`levelEnd`, the level is deduced automatically (the terrain save's own level, or the current level if the terrain save is global) — not typed.
  - for `monsterTouch`, starts a click-to-target flow; the event is created once a matching monster is clicked.
- `removeTerrainSaveEvent` (`rtse`) `<eventId>`
- `changeEventTerrainSave` (`cets`) `<eventId> <newTerrainSaveLabel>` (change the terrain save associated to an event)
- `editTerrainSaveEvent` (`etse`) `<eventId> <field> [<value>]`
  - edits any parameter of an existing event (`action`, `delay`, `periodic`, `duration`, `onLvlEnd`, `level` for level-based events, `target` for monster-touch events). Retargeting a monster always goes through the click flow, never a typed id.
  - `enable`/`disable` (no value): disabling freezes the event - cancels any running delay/periodic/duration timer without forcing an apply/unapply - and makes it ignore its trigger condition entirely until re-enabled. `displayTerrainSaveEvent` shows a disabled event with a red "dis" prefix.
- `displayTerrainSaveEvent` (`dtse`) `[<terrainSaveLabel>|current|c|lvl<number>|<eventId>]`
  - without any parameter, displays every event in the game (paginated), each prefixed by its owning terrain save's label
  - with a terrain save label, displays that save's events only, with an id for each (id absolute, not relative to the terrain save)
  - with `lvl<number>`, displays every event of every terrain save at that level (paginated, prefixed the same way as the no-parameter case); `current`/`c` is shorthand for your current making level
  - with an eventId, displays info of that specific event and moves the camera to the linked monster if it still exists (orange warning if it no longer does)

## Out of scope for this iteration

- Terrain saves only capture terrain *type* per tile — no heights, cliffs, ramps, or tileset changes (matches today's `-saveTerrain`/`-loadTerrain` capability; see `docs/TERRAIN.md` for the gap analysis against the richer `-smic` terrain export).
- Zone shape is restricted to `horizRect`; arbitrary `MECRegion` shapes are a possible future extension, not built now.
- The `mec-smic-loader` minimap-generation tie-in (`terrainSaveEnableMinimap`) has been **dropped**, not just deferred — not part of this feature.