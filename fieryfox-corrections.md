# MEC v2.2 changelog

## Technical updates in MEC core project

- upgraded project dependencies: typescript 4 ⇒ 5, typescript-to-lua 1.4 ⇒ 1.31, w3ts 2 ⇒ 3, etc.
- removed w3ts-jsx
- removed the old jass content from MEC1 and put MEC2 content from TS folder to the root directory
- added a pre-commit hook to apply prettier on commit
- added a "e2e" features, usefull for development of the MEC core

## Bug fixes

- significantly decreased the probability of -smic command to cause desyncs
- command -smic: fixed adding `\\\\` every -smic usage, instead replaces `\` with a single `/`
- smic into files : increased chunk size from 150 to 200 to earn performances (this is possible due to the -smic fix on the backslashes)
- long patrols for monster spawns and other: automatically split monster movement orders into several little moves, to make sure the monsters move towards a straight line
- when a monster kills a hero, instantly destroy the generated effect instead of waiting 3 seconds (important for some effects)
- fix(casters): the shot units weren't triggering a kill effect on hero killing
- commands -verticalSymmetryTerrain / -horizontalSymmetryTerrain : they were not always respecting exactly the selected zone
- reduced the time for fog to update when a monster walks near/into the fog

## New features

- add some data into the -smic commands for the mec-smic-loader to be able to generate a new minimap
- base hero collision size changed from 0 to 25 ; monster immolation on existing maps reduced by 25 to compensate (on maps with monster with less than 30 immolation radius, the hero collision size is kept under 25 to avoid gameplay differences)
- added "MEC Regions" ("Horizontal Rects", "Rects" (that can be diagonal), "Lines", "Circles", "Parallelograms" or "Trapezes"), which can be used in new features
- added TP feature for end zone that will teleport heroes to the center of the end rect of the current level
- added kill rect feature for monster types to have a rectangle zone on monsters that kills heroes, instead of simple immolation circle shape (works only with immobile monsters, can be used for doors for example)
- added monster life bonus: new property for monsters, for them not to kill but to give new lives to the team when you touch them
- on each lives number change, now displays the new number of lives between parenthesis
- improved the grid system: now displays properly and takes terrain height into account, except for grid 3 (the most detailled grid)
- improved debug lines: looks better and thiner, with several different colors
- command getTerrainInfo: added display of the properties of the clicked terrain if it's a slide, death or walk terrain
- for Make features, now mark clicked points with a little cross of the color of the player instead of a dummy unit
- command: getMonsterInfo: now you can click on a spawned monster to get information about the associated monster spawn

## Changes / improvements for Monster Spawns

- changed spawns direction which could be leftToRight, upToDown, rightToLeft, downToUp or a custom angle, to one of the following values: "up", "down", "left", "right", "line" (zones defined with 2 clicks), "rect" (potential diagonal zone, made with 3 clicks), "parallelogram" (made with 3 clicks) or "trapeze" (made with 4 clicks)
- from now spawned monsters can move to a random location on the other side of the spawn instead of straight only
- added dead zones functionnality: in one of these zones associated to the monster spawn, a spawned monster will be hidden (not visible and inactive)

## Removed features / commands

- disabled command history because the new version without w3ts-jsx causes desyncs

## MEC_core API

- added resetRoundScores ⇒ put in a lua trigger a custom script with "MEC_core.resetRoundScores()" at end of cinematics for hero selection circles to disappear again (because of a bug where selection circles appear after a cinematic)
- added getMonstersAll: function that returns all the monsters units (except spawned ones) currently active on the map
- added getSpawnedMonstersAll: function that returns all the spawned monsters units currently present on the map
- NewImmobileMonsterUnit: function to create a new monster unit, can be used for custom triggers
- NewPatrolMonsterUnit: function to add a new monster unit that patrols, can be used for custom triggers
- added json library
- added hook onBeforeHeroUsingMeteor (can be used to prevent the launch of a meteor, or to do custom triggers things at this kind of moment)
- added hook onGameWinning

## New commands All

- debugCollisions (debc) `<boolean>`

## New commands Make

- setHeroBaseCollisionSize (sethbcs) `<value>`
- getHeroBaseCollisionSize (gethbcs)
- patchImmo `[<heroBaseCollisionSize>]` ⇒ change the hero base collision size and monster immolation radius simultaneously without actual gameplay change
- createTpForEnd (crtpfe)
- setMonsterKillRectDimensions (setmkrd) `<monsterLabel> <width> <height>`
- removeMonsterKillRectDimensions (remmkrd) `<monsterLabel>`
- setMonsterLifeBonus (setmlb) `<monsterLabel> <enabled> [<nbLivesEarned = 1> [<minimumSurviveTime = 0>]]`
- setMonsterSpawnZone (setmsz) `<monsterSpawnLabel> <kind>` ⇒ changes the shape/direction of the monster spawn
- displayMonsterSpawnsDetailled (dmsd) `[<monsterSpawnLabel>] [page]` ⇒ displays more information for spawns than the original displayMonsterSpawns command
- setMonsterSpawnMonsterDirectionMode (setmsmdm) `<label> straight|random`
- createMonsterSpawnDeadZone (crmsdz): `<monsterSpawnLabel> [<deadZoneShape>]`
- deleteMonsterSpawnDeadZones (delmsdz) `<monsterSpawnLabel> [clicks|all]`

## New commands Admin

- debugLongDistanceMoves `<boolean>` ⇒ to display the intermediate monsters movements order point rects of the new fix for long patrols
- createDebugMecRegion (crdebmr) `[<mode> [<directionForHorizontal>]]`
- e2e `[run] <testName> | speed <percentage> | stop | pause | resume`