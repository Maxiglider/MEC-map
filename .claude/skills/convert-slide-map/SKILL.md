---
name: convert-slide-map
description: Convert an old hand-made Warcraft III slide/escape map (not made with MEC, often protected) into an MEC 2 map. Use when the user asks to convert, port or analyse an old slide map for MEC.
---

# Convert an old slide map to MEC 2

An old slide map is converted into an MEC map, not the other way round. The result is built on the MEC base map at `MEC_BASE_MAP_LOCATION` (in `.env`), not on this repo's `maps/map.w3x`. It holds:
- from the old map: the terrain, doodads, pathing, shadows, unit types, decor and visibility;
- the MEC core of this repo (`yarn release`);
- the gameplay as MEC game data (`MEC_core.setGameData(<json>)`);
- custom Lua triggers, outside MEC core, for what MEC has no built-in feature for. They use the `MEC_core` object.

Every old map is hand-made JASS written its own way. The scripts (`scripts/convert-slide-map/`) do the mechanical part; the interpretation is yours, and every guess is flagged to the user.

## Workflow

1. **Extract**: `yarn convert-slide-map:extract "<path to the old map>"` (`--force` replaces a different copy already in `original-maps/`). It copies the map, makes its cheated copy, extracts every file (protected maps included), and writes `facts.json` and `summary.md`.
   It first tells what kind of map it is, which decides how it is read and cheated (see [MEC 1 maps](#mec-1-maps)): **MEC 1** (made with the vJass MEC of this repo's `v1-jass` tag, in the World Editor) or **made by hand**. `summary.md` says so.
2. **Report**: write `report.md` from `summary.md` and `facts.json`, modelled on Polar Escape 3's. Its sections:
   1. how the old map plays;
   2. terrain types;
   3. levels;
   4. monster types;
   5. monsters per level;
   6. keys and gates (or the map's equivalent);
   7. everything else;
   8. custom triggers to write.

   Mark every guess or open decision with **?**, and read the trigger code in `facts.json` rather than guessing from trigger names.

   Mark with **?** too every mechanic of the old map you think MEC core can't handle as it is (no MEC structure, command or option matches it), with what it does and the old triggers behind it.
3. **Decisions**: go through the **?** items with the user. When the summary's "Personal data" section lists strings (real names, ages, towns, emails, phone numbers of the author or others), always ask the user what the MEC map keeps of them: never publish them on your own, and never drop the author's credit either. For each mechanic MEC core can't handle, ask the user how to handle it, and propose both ways with their trade-offs: a custom trigger for this map (see [Custom triggers](#custom-triggers)), or an evolution of MEC core (a new structure, option or command, reusable by other maps and by map makers, committed on its own). Don't choose alone. Polar Escape 3 had both: its keys and gates, its one-way teleporters and its spawn kept through two levels became MEC core features; its random warlords, collapsing bridges and ending stayed custom triggers. Record the decisions that set a pattern for other maps in the conversion memory.
4. **Spec and custom triggers**: write `conversion.json` (see [The spec](#the-spec-conversionjson)) and `custom-triggers.lua` (see [Custom triggers](#custom-triggers)) in the work folder.
5. **Build**: `yarn release` (the MEC core of this repo), then `yarn convert-slide-map:build "<map file name in original-maps/>"`. It runs the rebase (`convert-slide-map:rebase`) and the game data step (`convert-slide-map:gamedata`), which can also be run one by one. Read `rebase.md` and `gamedata.md` (warnings) after each build.
6. **Test in game** with the user: the World Editor first (terrain, doodads, no "Invalid object ID"), then the game. Put what you learn back into this file.
7. **Finish**: when the user tells you the conversion is complete, in whatever words, move the map from `convert-in-progress-maps/` to `converted-to-MEC-maps/`.

## Folders and names

`MAPS_OUTPUT_DIR_FOR_AI_CONVERSION_TO_MEC` (in `.env`) holds:

- `original-maps/`: a copy of each map to convert. Nothing else reads the user's original file.
- `cheated-original-maps/`: the old map as `<original name>--cheated`, to play it through while converting it. The cheat is added to the map's own JASS (`cheat.ts`):
  - a map made by hand gets a teleport of its own: `-t` (`-teleport`) teleports the hero to the next right-click, once, and `-s` (`-stop`) cancels it;
  - a MEC 1 map gets the making rights instead (`isTrueMaximaxouB` and `canCheatB` true in its escaper constructor, its setters untouched), so every MEC 1 command works, `-t` included.
- `conversion-work/<map>/`:
  - `extracted/`, `war3map.j` (line breaks restored), `facts.json`, `summary.md`;
  - yours: `report.md`, `conversion.json`, `custom-triggers.lua`;
  - the scripts': `rebase.md`, `rebase.json`, `gamedata.json`, `gamedata.md`, `decor.json`.
- `convert-in-progress-maps/`: the converted map while it is being worked on.
- `converted-to-MEC-maps/`: finished maps only (step 7).

The converted map is named after the old one without any "protected" mark ("-Protected-", "(Prot)", "[P]"…), followed by `--mec<version>_<yyyy-mm-dd>`: the version and build date of the MEC core it holds, from the core's header. For example `POLAR ESCAPE 3--mec2.3beta_2026-09-18.w3m`. The rebase writes the path to `rebase.json`.

The MEC base map is only read: the scripts refuse to write over it.

## The spec (`conversion.json`)

Region names are the old ones without `gg_rct_`. Model a new spec on Polar Escape 3's.

- `hero`: `{ "unitType", "model", "collision" }`. `collision`: the old hero's collision size, for the mortars' areas (see [Hero collision](#conversion-rules)). `unitType`: for a map whose players move a plain unit rather than a hero (Sliding Bunnys' `n000`, based on `necr`, the Rabbit); without it, the players' hero type is found from the units. `model`: a model to force, rarely needed (see Hero looks).
- `terrainTypes`: label, alias, tile, kind (`walk`, `slide`, `death`), speeds, `canTurn`, and the death settings (`killingEffect`, `timeToKill`, `toleranceDist`).
- `unitTypes`: new unit types (id, base, fields). The gate unit is one of them.
- `monsterTypes`: MEC monster types (label, unit type, speed, `immolationRadius`, scale `-1` for the unit's own…).
- `unitMonsterTypes`: the monster type of each old unit type. `speedVariants`: another type for a unit given some `SetUnitMoveSpeed` value.
- `ignoredUnitTypes`: heroes and decor, left out of the monsters.
- `levels`: each with `start`, `end`, `visibilities` and `removedBy`.
  - `start` and `end`: a region name, `{ "aroundUnitsOfType": "Edem", "padding": 128 }`, or a rect. For the end, use `{ "stripAt": <next level's start> }` (see [Level ends](#conversion-rules)).
  - `visibilities`: region names, or `playable`.
  - `removedBy`: the checkpoint trigger whose `RemoveUnit` calls tell which units belong to the level. Other units go to the first level whose visibility holds them.
  - `unitsIn`: rects whose units and gates belong to the level, checked before the visibilities: for a map whose visibility doesn't split the levels (Sliding Bunnys shows the whole map from the start).
  - `nbLives`: the lives the level gives (level 0: the lives at start). 0 is a value (core `1c4c9cc7`): Sliding Bunnys has 0 everywhere, so the game restarts when all heroes are dead, as the old map ended in defeat.
- `safeStarts`: `margin` (48), how far around a start must be walk ground.
- `endStrips`: death tiles, `thickness` (64), `depth` (128), `overflow` (256).
- `gates`: the gate doodad types (`"DTg5": "x"`) and `levels` to force a gate's level. These doodads are removed from the map and become MEC doors (see `keyAndDoors`); add other types to `removeDoodadTypes`.
- `keyAndDoors.keylessDoors`: script names of gates the old map opens from a trigger of its own (a monster reaching a region, a switch plate…): MEC doors without a key, which `custom-triggers.lua` opens. A gate no key opens and not listed here is made keyless too, with a warning.
- `keyAndDoors`: one kind of door per destructable type (`door<type>`), without kill rect dimensions (each door measures its own from its pathing). The gates a key opens become MEC key and door pairs (core `8f7ce1e`): the old key item and the old gate destructable, each key matched to its gate through the old triggers (`UnitHasItem(GetTriggerUnit(), gg_item_…)` + `ModifyGateBJ(…, gg_dest_…)`).
- `meteorsAtItemsOfTypes`: MEC meteors where the old map had some item, for maps whose keys really work like meteors.
- `clearMobs`, `portals`: they stand on old units (a circle of power, say), found at the centre of a region. A clear mob can't block a gate: gates are doors. `oneWay: true` on a portal makes it one-way (core `aae5df7`), as old teleporters are.
- `teleportsFromTriggers`: a periodic trigger moving a unit through region centres becomes a teleporting monster.
- `trains`: units sent one after another on a loop, placed where each would be once the last is in.
- `spawns`: MEC monster spawns (start and end regions, direction, frequency, `level`). `keepAliveForNextLevel: true` (core `c9aa321`) keeps it and its monsters going through the next level: for a spawn the old map starts in one level and plays in the next.
- `decor`: create the decor units (`decor.json`). `frozenTypes`: types whose animation stops. `unclickableTypes`: types that get the locust ability (`Aloc`), so they can't be selected nor clicked (Polar Escape 3's circles of power); locust units are also left out of `GroupEnumUnitsInRect`, so don't give it to units a custom trigger looks for that way.
- `mecOne`: `true` for a map made with MEC 1 (see [MEC 1 maps](#mec-1-maps)): its terrain types, monster types, levels, monsters, spawns and meteors are read from its own calls, and the spec only adds the rest.
- `extraMonsterTypes` and `monsterTypeOverrides`: monster types to add (a caster's projectile, say), and fields to set on the ones already read (`color`, `idlePeriod`/`idleAnimation`/`idleEffect`…) without writing them all out again.
- `casterTypes` and `castersFromMonsterTypes`: the caster types (`casterMonsterType`, `projectileMonsterType`, `range`, `projectileSpeed`, `loadTime`, `animation`, `isBlind`, `nbShots`/`shotAngleStep`/`firstShotAngle`), and every immobile monster of a type turned into a caster of the type it names. `isBlind` shoots every `loadTime` seconds along the caster's own angle, without looking for a hero: what an old map's mages do, where MEC's aiming caster is a turret that tracks you.
- `extraVisibilities`: `{ level, rect, blinkVisibleTime, blinkHiddenTime }`, a visibility rectangle the old map's own triggers ran. A visibility with both blink times shows and hides over and over while its level is played, which is how old maps light a dark maze.
- `safeStarts.shrink`: `false` keeps the level starts as they are (the default for a MEC 1 map), checking only that none holds a death tile.
- `customTriggers`: the Lua files to bake.
- `legacyQuests`: `{ "drop": [titles] }`: the old map's quests (its `CreateQuestBJ` calls, texts resolved), in the trigger "Original map legacy quests", created before MEC's own (in `onGlobalInit`, which runs before MEC's map initialization triggers). Drop what is obsolete in MEC, such as quests listing the old map's commands. `replaceText`: `{ title: new text }`, for a quest whose text holds personal data the user chose to take out (see step 3).
- `gameData`: overrides of the base map's game data settings. `coopModeChoice: false` (core `8da3d1f4`): no coop or solo popup at the start, the game is solo (Polar Escape 3 requires solo).
- `graphicsModes`: `"SD"`, `"HD"` or `"both"`, the graphics the map supports. By default a map made before Reforged (map info format below 31) is set to SD only, as it was made for: its models may play differently in HD (Polar Escape 3's bridges toggle in HD).

How units move comes from their first order in the old script:
- `patrol` gives a simple patrol;
- `attackground` gives a mortar;
- `move` into a cycle of "enters region → move to the next" triggers gives multiple patrols;
- no order gives an immobile monster.

## Conversion rules

- **Default values**: never guess a standard object's value (a unit's speed, collision or weapon areas, a destructable's fixed rotation…). When the old object data doesn't change it, read it in the World Editor's defaults that `war3-objectdata-th` ships, in `node_modules/war3-objectdata-th/dist/cjs/generated/` (see [Default values of standard objects](#default-values-of-standard-objects)). Polar Escape 3's Ice Troll Warlords (`nitw`) move at 320, not the 270 first assumed: at 270 its train of 8 trolls bunched up instead of going round its loop evenly (user's report).
- **Terrain**: terrain types come from the tiles under the old kill and safe regions. Walk terrains take the speed of the old hero unit, from its object editor value (`umvs`), else its default (Demon Hunter 300). `summary.md` lists the heroes, their speed and the script's `SetUnitMoveSpeed` on them. Only a trace in the old map saying otherwise changes that.
- **Level ends**: never the next level's start region itself. Write `end: { "stripAt": <next start> }`, and the end becomes a thin strip:
  - `thickness` 64, `depth` 128 inside the next start, on the side heroes come in from, so heroes are partly inside the next start when it fires;
  - across the whole start region and `overflow` 256 into the death terrain on both ends, so it can't be walked around (a classic flaw of these maps).

  The side heroes come in from is found by walking the non-death terrain from the level's start, through the portals, with the next start closed. An old end that is already thin and wide (a final region) can be kept.
- **Start**: the base map's start region `gg_rct_departLvl_0` is moved onto level 1's start (in `war3map.lua` and `war3map.w3r`): MEC starts the heroes and the camera there. The start locations (where the camera starts) go to the centre of level 1's start when the spec names an old region for it, else to the old player 1 start (Sliding Bunnys' stood in the middle of the map, its script panning to the heroes at once).
- **Safe starts**, checked on every build:
  - Heroes appear anywhere in a level's start. So every start is shrunk, side by side, until it and a margin around it (`safeStarts.margin`, 48) stand on walk tiles only. A start reaching onto a death tile kills a hero as it appears; one on a slide tile sends it off at once.
  - Monsters whose path comes within contact reach of a start (`immolationRadius` + hero 25 + the margin) are listed in `gamedata.md`'s warnings.
  - This caught Polar Escape 3's level 1: the padding around the old hero spawns reached past the pad onto the snow.
- **Gates**:
  - MEC slides move heroes with `SetUnitX/Y`, which ignores pathing: an old map sliding its heroes with `SetUnitPosition` (Sliding Bunnys) had its gates stop them, where a plain gate would be crossed in MEC. Hence MEC doors, deadly while closed (user's choice for Sliding Bunnys too).
  - Old gate destructables all become MEC doors (keyed or keyless), and their doodads are removed. Doors have no angle: gates have a fixed rotation (an iron gate stands horizontal or vertical whatever angle it is made with).
  - **Never compute a kill rect from the terrain textures** (user's rule): only from pathing or collision. MEC doors get no kill rect dimensions, so each door's kill rect is where it blocks the ground, measured by MEC core where it stands (core `534c630`). A monster has no pathing to measure, which is why gates are not made monsters (Polar Escape 3's plate gates were clear mobs first, then doors).
  - A gate closing the start of a level stands in the previous level's visibility too: force its level in `gates.levels`.
- **Angles**: MEC reads a monster angle of 0 as "no angle", so east is written 360.
- **Hero collision**: MEC's own (`heroBaseCollisionSize`, 25 in the base map) stays (user's rule): don't set the old hero's, adapt the rest to it so the game plays as the old map did.
  - **Contact**: MEC kills at `immolationRadius + heroBaseCollisionSize`, so an old "unit within 75" becomes 50. Contact radii must be one of MEC's immolation abilities (`Immolation_skills.ts`).
  - **Mortars**: a shell's areas reach to the edge of a hero's collision circle, in the engine as in MEC (`MortarSplash.ts`). Give the old hero's collision in `hero.collision` (its `ucol`, else its default): the game data step sets `gameData.mortarAreaShift` (core `5fd68cef`) to the difference, which MEC adds to the areas as it judges the heroes. Polar Escape 3's hero had a collision of 0.01, so its shells reached 25 too far until then (user's report); shift −25. Never change the mortar units' weapons at runtime (`BlzSetUnitWeaponRealField` on their areas): their attack broke off without firing (user's test).
- **Visibility**: each checkpoint's fog reveals become the next level's `visibilities`, cumulative (`resetVisiblitiesAtStart: false`) when the old map never hides them again.
- **Hero looks**: the rebase copies the old hero's skin fields (model, scale, selection scale, tint…) onto MEC's hero units `E000` and `D001`. An old hero based on another unit than the Demon Hunter also gets that unit's own model, scale, selection circle and shadow, from the World Editor's defaults, wherever the old map keeps them (Sliding Bunnys' Bunny, a Rabbit). Check what a base unit id is in the defaults, never from its look: `necr` is the Rabbit, not the Necromancer (`unec`), which first gave Sliding Bunnys a Necromancer for a hero. An old hero model of its own (`umdl`) also becomes the game data's `heroModelPath`, the effect a hero slides as in async mode. An old hero based on another unit than the Demon Hunter, with no model in the object data, needs its model set by hand: the rebase says so.
- **Custom things of the old map** (user's rule, every map): its imported files and its loading screen are kept.
  - The extraction names the imports even when the map has no listfile: from the paths that use them (the map info's loading screen model, the scripts, the object data, the text files, the textures inside imported models), round after round (`readArchive` in `mapFiles.ts`). `summary.md` lists them, and the files no path names (nothing uses them). Sliding Bunnys had no listfile and 5 unnamed files: its loading screen (`LoadingScreen2.mdx` and 4 textures).
  - The rebase copies them at their paths into the converted map, and lists them in `war3map.imp` (flag 13) so the World Editor keeps them. A file the base map already has at that path stays the base map's (`rebase.md` says so).
  - The loading screen (number, model, title, subtitle, text, old strings resolved) goes into the converted map's info exactly as it was (user's rule): unlike the map's name, its version isn't replaced by `[M2]` there, nor anything else changed. In format 39 the map info has an undocumented int between the loading screen number and its strings (`parseW3iHead`).
- **Description**: the old one, followed by `Powered by Max Escape Creation v<version> - <date> <time>` for the core the map holds, as `mec-core-upgrade` writes it (`../mec-core-upgrade/Program.cs`). A version already in the description is replaced; an empty description becomes that line. The line has no color of its own (as in the 145 maps `mec-core-upgrade` has done), so a color the old description leaves open (a `|c` code with no `|r` after it) is closed before it; otherwise it would run on over the line.
- **Upkeep text** (top right): if the old map keeps the default, it shows the old author, in the base map's `UPKEEP_NONE` string. If the old map changed it, its `UPKEEP_*` values are copied.
- **Name in the game** (`mecMapName` in `mapFiles.ts`):
  - The old name without its "protected" marks, its version replaced by `[M2]`: a bracketed version first (`[v1.6]`, `[2.0]`), else `v1.3`, else a bare `3.92`. With no version, ` [M2]` is added.
  - It must fit within 36 characters as stored, color codes included: the longest name among 51 old maps saved by the World Editor is 36, and the editor is said to stop around 35.
  - When it doesn't fit, it falls back to ` M2`, then drops the color codes after the first, then shortens the visible text before the tag. Check the result in `rebase.md`.
  - The welcome message and the file name follow it (the file name keeps the old version and gets `--mec…`).
- **Base map placeholders**: the welcome message ("Welcome to: Your map", "Created by: You") gets the old name (without its color codes) and author, in the base map's colors. Name, author, description and players go in through the map info's strings.
- **MEC's own quest** (user's rule, every map): the base map's "This map was made with Max Escape Creation 2." becomes "This map was converted to Max Escape Creation 2 with help of AI."; its other lines and its links stay. Its title, "MapDescription" in the base map, becomes "To MEC conversion". The rebase does both (`rebase.md` says so, or that the line wasn't found).
- **Conversion note** (user's rule, every map): the quests must say `<yyyy-mm-dd> Map converted to MEC by Maximaxou with help of AI`, dated from the build. The game data step appends it to the old map's version log quest (a title with "version", "changelog", "history", "updates"…), else adds a quest "Conversion to MEC" of its own. Check `gamedata.md` for where it went.
- **Lives** (user's rule): an old map without lives, where all heroes dead is a defeat (Polar Escape 3's Game_Over, Sliding Bunnys' Death), gets `nbLives: 0` on every level. MEC's default lives (5 at start, 1 per level) would let the heroes wipe out and retry; with 0, MEC says "You have no more lives!" and restarts the game. Look for the old game-over trigger (`CustomDefeatBJ` once all heroes are dead) in every map.
- **Quests and commands**: keep the author's credit quests; drop the old `-kick`, name spoofers and leaver messages (MEC has its own). These maps belong to their authors.
- **Old mechanics MEC has no equivalent for**: never drop them, and ask the user whether to reproduce them with a custom trigger or by evolving MEC core (step 3). A custom trigger reproduces the old trigger's behavior as it is.
- **Reproduce, don't fix**: keep the old code's values even when they look like a bug, since what players saw came from them. Polar Escape 3's bridges were restored with `GetDestructableMaxLife(bj_lastCreatedDestructable)`, which nothing set, so 0 life. Point out such a quirk to the user rather than silently changing it; the user may then choose otherwise. For Polar Escape 3, the bridges stayed a plain toggle in the MEC map either way (placed from the file or created by script, with 0 life or full life), so the user chose full life, and a bridge deadly all the time it is down.

## Custom triggers

Write them in `conversion-work/<map>/custom-triggers.lua` (or several files) and list them in `customTriggers`, one block per trigger: its comment lines (the first one names the trigger), then its `onGlobalInit(function() … end)`, blocks separated by a blank line. A comment line `-- @level N` (MEC's level id, from 0) puts the trigger in a sub-category "Level N" of the category, as MEC counts levels: give it to a trigger that belongs to one level (started in it, or acting on it), and split a trigger acting on several levels one by one into one trigger per level (Polar Escape 3's troll gates). Triggers for the whole game (steering switched every level, weather, the ending) stay at the category's root, first. The game data step:
- checks them with `luac -p`;
- makes each block a real custom text trigger of the World Editor, in a category "Converted from the original map" at the end of the trigger tree (`triggerFiles.ts`: appended to `war3map.wtg` and `war3map.wct`), so they show in the editor and survive a save from it; the generated ones come first ("Original map legacy quests", "Destructables of the original script", "Decor of the original map");
- writes their code into `war3map.lua` where the editor writes enabled custom text triggers (after the base map's, before `InitSounds`), so a save from the editor writes the same. The spot is searched past `onGlobalInit(setGameData)` only: MEC core, above it, defines an `InitCustomTriggers` wrapper of its own, and code put there never runs (in Polar Escape 3 that lost the decor, the bridges and the ending at once);
- refuses to run twice on the same map: the build (rebase + game data) always starts from the base map.

- Wrap each in `onGlobalInit(function() … end)`, so it runs after MEC core and the game data.
- Use the old regions' coordinates (`Rect(minX, minY, maxX, maxY)`): the old `gg_rct_` names don't exist in the MEC map.
- Start a mechanic at the start of the level the old map starts it in (`MEC_core.onStartLevelAny`, level ids from 0), not on an old region a hero enters, and only once.
- **Steering switched per level** (items like ice skates): `MEC_core.getTerrainTypes():getByLabel("slide")`, then `:setCanTurn(b)` and `:setRotationSpeed(b and 0.9549 or 0)` on `onStartLevelAny`. `setCanTurn(true)` doesn't restore the rotation speed of a slide terrain made without turning.
- **Gates opened by a trigger of the map** (a monster reaching a region, a hero on a switch plate): keyless doors, opened with `MEC_core.getLevels():get(levelId).keyAndDoors:getDoorAt(x, y):open()` when `door:isOnMap() and not door:isOpened()`. A door is made again, closed, when its level starts again. MEC heroes aren't the old hero units: test the entering unit against `escaper:getHero()` for escapers 0 to 23, not its type.
- **Spawns MEC's monster spawns can't express** (random patterns):
  - a timer creates MEC monsters: `MEC_core.newMonsterSimplePatrol(monsterType, x1, y1, x2, y2)`, then `monster:createUnit()`. Long paths become multiple patrols by themselves;
  - a rect destroys them where the old map did (`monster:destroy()`), keeping them in a table by id;
  - random draws in a synced trigger (`GetRandomInt` on a timer) are fine.
- **A spawn over several levels** (started in one, played in the next): keep its monsters in no level (don't `level.monsters:new` them). When a level ends MEC removes its monsters' units, and when one starts it recreates them, so a level's monsters can't carry over. Monsters in no level still kill: contact only needs their unit and contact radius.
  - Start it on `onStartLevelAny` of its first level.
  - Check it runs, and start it if not, on the start of every later level it is meant for (a level skipped).
  - Stop it on `onEndLevelAny` of its last level, and when the game starts again at level 0: pause the timer and destroy its monsters in id order.
- **Timed traps on destructables** (collapsing bridges): reproduce the loop with timers. Find the destructable by type near its position (`EnumDestructablesInRect`). Time each step from the start of the loop, with the old waits. A bridge's rise and collapse show as a toggle in the current game, even in the old map (Polar Escape 3). In SD, changing its life smoothly made one of Polar Escape 3's two bridges animate, never the other, whatever the order: don't spend time on it, keep the toggle.
- **Decor**: generated from `decor.json` when the spec has `decor`. The units get no pathing, and old neutral players 12–15 become the 24-player map's neutral players.
- **Time of day and weather**: MEC already keeps noon. Weather: `AddWeatherEffect` over the playable area.
- **An ending of the map's own** (a cinematic, a defeat screen): start it from `MEC_core.onGameWinning`, timed by timers, and return `false` from the hook. MEC's own end of the game (its "Good job" message and its restart 12 s later) is then cancelled, and the old map's timing can be kept. This needs a core with commit `e8dbf5b`.
  - Timer callbacks can't wait: no `TriggerSleepAction`, and no Blizzard function that waits inside. `TransmissionFromUnitTypeWithNameBJ` with its last argument `true` waits for the transmission, and in a timer callback it silently stops the callback there. In Polar Escape 3, that stopped the cinematic on its first line.
  - Count the old waits exactly, including the ones hidden in Blizzard functions: a transmission called with its wait flag (`TransmissionFromUnitTypeWithNameBJ(…, true)`) holds the old trigger for the line's whole duration (`bj_TIMETYPE_ADD`: the given time, plus the sound's length if any). Leaving those out made Polar Escape 3's ending 7 s too short.
  - Give each step its own timer at its absolute time from the start, rather than chaining them, so a step that goes wrong doesn't hold up the next ones and the end of the game.

## MEC 1 maps

A MEC 1 map was made with the vJass MEC of this repo's `v1-jass` tag, from the World Editor, its script compiled to JASS. Its structures keep their names there (`s__Escaper_`, `s__Level_`, `s__TerrainTypeArray_`…), which is what `detectMapKind` looks for (`mecOne.ts`). Such a map splits in three, and `summary.md`'s "MEC 1" section gives each:

- **What MEC 1 is**: its core triggers and its map template's (`MEC_ONE_CORE_TRIGGERS`). Nothing to convert: MEC 2 does it.
- **The map's data**, written in its init triggers (`Init_terrain_types`, `Init_monster_and_caster_types`, `Init_levels` and the `Init_levelN_partM` behind them) as plain calls, listed with their arguments in `facts.json` (`mecOne.calls`) and counted in the summary. They are what a MEC 2 game data is made of, one for one, so a MEC 1 map needs no guessing about its gameplay:
  - `TerrainTypeArray.newSlide/newWalk/newDeath(label, tile, speed…)` → `terrainTypes`;
  - `MonsterTypeArray.new(label, unit, scale, immolation, speed, clickable)` and the `MonsterType.set…` on it → `monsterTypes`;
  - `Level.newStart` / `newEnd` / `setNbLivesEarned`, `VisibilityModifierArray.new` → the levels;
  - `MonsterSimplePatrolArray.new`, `MonsterNoMoveArray.new`, `MonsterMultiplePatrols.storeNewLoc` + `MonsterMultiplePatrolsArray.new`, `MonsterSpawnArray.new`, `MeteorArray.new` → the monsters, spawns and meteors of each level;
  - `CasterTypeArray.new` and the `CasterType.set…` → the casters.
- **The map's own features**, every other trigger of it (`ownTriggers` in the summary). They are the map's own work (spells, morphs, animations, shadows…): read each one and go through step 3 with the user, as for a map made by hand.

The old data reads in MEC 1's own units (its speeds, its immolation radius…): check each against MEC 2's, where a field changed meaning, rather than copying the number over.

### Converting one

`mecOneData.ts` reads all of that data; the spec says `"mecOne": true` and only writes what those calls don't hold. The game data step then takes the terrain types, monster types, levels, monsters, spawns and meteors from it, and the blocks that infer a hand-made map's monsters from its units find nothing (a MEC 1 map has no unit placed in the editor).

- **Immolation** (user's decision, Slide Is Magic, 2026-09-20): MEC 1 killed with the engine's immolation ability, measured to the edge of the hero's collision circle. So the old kill distance is `radius + the old hero's collision`, and MEC 2's is `radius + heroBaseCollisionSize`. Keep the radii untouched and set `gameData.heroBaseCollisionSize` to the old hero's collision (0 for a hero with `ucol` 0): the old game exactly, and it is what MEC already does for a game data without the field. `-patchImmo` turns the map to 25 later, in game. Shifting every radius by −25 instead would drop the 5-radius types to 0 and stop them killing at all.
- **Starts**: a MEC 1 map's starts are the ones its author made in game and played on, and they stand on the slide terrain on purpose. They are kept as they are (`safeStarts.shrink` defaults to false for a MEC 1 map), and only checked for a death tile.
- **The last level has no end**: reaching it wins the game. It is written without one.
- **Quests**: a map made in the World Editor writes its quest texts in a JASS constant (`constant string MapDescription="…"`), which `jassText` follows. MEC 1's map template adds six command quests (`Commands 1`, `Commands 2`, `Colors`, `Effects`, `Red commands`, `Command shortcuts`), obsolete in MEC 2: drop them, keep the map's own.
- **Slides**: MEC 1's `newSlide` has no "cannot turn", so every slide terrain gets `canTurn: true`.
- **The map's own triggers** are where all the work is. Slide Is Magic's 62 of them were: mages that shoot (two became blind casters, one an instant line in a custom trigger), mages that morph into animals, zones lit 2 s every 5 s, a level played at night, a colour and an animation per family, and floating level names.

## Reading an old map: common idioms

| Old-map idiom | How it shows in `facts.json` | MEC |
|---|---|---|
| Kill regions ("unit enters region → kill") | a trigger with hundreds of `EnterRectSimple` events, `KillUnit(GetTriggerUnit())` | death terrain, if the tiles under them are uniform (check the region tiles) |
| Safe regions switching sliding off and on | `Sliding_False` / `Sliding_True` style enter and leave events | walk terrain, from the tiles under them |
| Slide loop | a periodic timer (`0.01`–`0.04` s) moving each hero N px along its facing | slide terrain, speed = N / period |
| Turn on order | "issued point order → `SetUnitFacing` (or `SetUnitPositionLocFacingLocBJ`) towards the order point": the native progressive turn, not an instant one | slide terrain `canTurn`; MEC's default rotation speed (0.9549) was measured from that native turn (`docs/SLIDE_TURN.md`) |
| Contact death | `UnitInRangeSimple(range, hero)` → kill | monster type contact radius (verify in game) |
| Checkpoints | "enters pad" → kill all heroes, revive them in a region, remove the finished level's units, reveal fog | MEC levels: start = respawn region, end = a strip in the next start |
| Fog reveals per checkpoint | `CreateFogModifierRect…` in the checkpoint triggers | level `visibilities` |
| Units per level | every unit created at start, removed at checkpoints | levels by `removedBy`, else by the visibility holding them |
| Patrols | order `patrol` (851990) to a region centre | simple patrol |
| Loops | move-to-next-region triggers forming a cycle | multiple patrols |
| Mortars | order `attackground` (851984) | mortar monsters (object-data damage by area) |
| Periodic spawns | timer → create unit at a random point, move it | monster spawn (`keepAliveForNextLevel` when it runs on into the next level) |
| Random spawn patterns | timer → `GetRandomInt` → one of several spawn triggers | custom trigger creating and destroying MEC monsters |
| Timed traps on destructables (collapsing bridges) | `KillDestructable` → wait → kill heroes in a region → `DestructableRestoreLife` → wait → `TriggerExecute` of itself | custom trigger reproducing the loop |
| Periodic teleports | timer → `SetUnitPosition` through fixed spots | teleporting monster |
| Keys and gates | "unit with item enters region → open gate" | MEC key and door pairs (`keyAndDoors`) |
| Gates opened by a monster reaching a region (or any trigger of the map's own) | `ModifyGateBJ(1, …)` (open) in a trigger with no key | MEC door without a key (`keyAndDoors.keylessDoors`, core `32e82ea`), opened by a custom trigger: `MEC_core.getLevels():get(levelId).keyAndDoors:getDoorAt(x, y):open()`. Check the old operation: 1 opens, 2 destroys |
| Gates opened by a switch plate (a hero steps on a small region, often on a circle of power) | same, filtered on the hero type, no item | MEC door without a key, opened by a custom trigger when a hero enters the plate's region (user's choice over a clear mob, so that the kill rect comes from the door's pathing); the circle stays decor |
| Hero teleporters | "hero enters region → `SetUnitPosition` to another region" | one-way MEC portal mob (`oneWay: true`) |
| Items enabling steering (ice skates) | the turn trigger checks `UnitHasItemOfType` | slide terrain starts `canTurn: false`; a custom trigger switches it per level |
| Mages firing on a timer, straight ahead | a periodic trigger ordering a spell, and a spell trigger creating a projectile unit that a 0.03 s loop moves and that kills within N | a blind caster type (`isBlind`), with `nbShots` for a fan; the projectile is a monster type whose immolation radius is that N |
| Monsters animating on their own | a periodic trigger walking a unit group: `SetUnitAnimation(u, "spell")`, or an effect over the head | a monster type's `idlePeriod` + `idleAnimation` + `idleEffect` |
| Monsters recoloured by kind | "unit of type X enters the map → `SetUnitColor`" | a monster type's `color` |
| A zone lit now and then on a dark level | a periodic trigger starting a `FOG_OF_WAR_VISIBLE` modifier, waiting, stopping it | a level visibility with `blinkVisibleTime` and `blinkHiddenTime` |

Old maps number orders: 851986 move, 851990 patrol, 851984 attackground, 851983 attack (`ORDER_NAMES` in `jass.ts`).

## Files: old map → MEC map

| File | What the rebase does |
|---|---|
| `war3map.w3e`, `war3map.wpm`, `war3map.shd`, `war3map.mmp`, minimap, preview | The old map's, unchanged (the old terrain format 11 reads fine). Destructables are not in `wpm` (their pathing is added at runtime), so removing one leaves no blocker behind. |
| `war3map.doo` | The old doodads, without the types MEC recreates, written in the 1.32 format (8, subversion 11, skin = type). The destructables the old script creates itself (`CreateDestructable` in `main`, for those its triggers use) have flag 0 in the file, so the game leaves them out. Never leave them with flag 0: the World Editor turns flag 0 entries into placed doodads when it saves the map, and with the script creating them too they stood twice (Polar Escape 3's bridges after a save from the editor: one collapsing, one never). `scriptDestructables` in the spec: `"script"` (default) removes their entries, and the game data step creates them with the old calls, in the generated trigger "Destructables of the original script": created so, as in the old map, but they don't show in the editor. `"file"` places them from the file (flag 2) and doesn't create them again: they show in the editor. The current editor reads a 3.0 map's doodads with skins whatever the file's format says: an old format 7 file shows no doodad and "Invalid object ID" errors. |
| `war3map.w3i` | MEC's (24 players, forces, Lua), with from the old map: name, author, description, recommended players (through their `wts` strings), camera bounds and complements, playable size, tileset, the flags for masked areas and shore waves, and the loading screen. |
| `war3map.lua` | MEC core replaced by this repo's `bin/MEC_core.lua`. In `main`, the old `SetCameraBounds`, `SetDayNightModels`, `NewSoundEnvironment`, ambient sounds and music. In `config`, every `DefineStartLocation` at the old player 1 start. `gg_rct_departLvl_0` on level 1's start. Then `setGameData` and the custom triggers (game data step). |
| `war3map.wct` | MEC core and `setGameData` + custom triggers replaced in their own length-prefixed custom text blocks. |
| `war3mapUnits.doo` | MEC's 24 start locations, moved to the old player 1 start. The old units become game data. |
| `war3map.w3u`, `war3mapSkin.w3u` | The old unit changes merged into MEC's, heroes and items aside. How a unit looks goes to the skin file, the rest to `war3map.w3u`. The old hero's looks go onto `E000`/`D001`, and the spec's `unitTypes` are added. Custom ids must not collide with MEC's own (`E000`, `Ei01`–`Ei40`, `Einv`, `dcir`, `pcir`, `D001`, `c000`). |
| Imported files | Copied at their paths and listed in `war3map.imp`. |
| Other object data (`w3t`, `w3a`…) | Reported, not merged yet. |
| `war3map.wts` | MEC's, with the map info strings, the upkeep text and the welcome message. |
| `war3map.w3r` | MEC's, `departLvl 0` moved. The old regions are only read. |
| `w3c`, `w3s`, `wtg`, misc | MEC's. |

## Default values of standard objects

`node_modules/war3-objectdata-th/dist/cjs/generated/` holds the World Editor's default values of every standard object, one JSON file per kind, keyed by object id:

| File | Objects | What it gives, for example |
|---|---|---|
| `unitsdata.json` | 864 units | `speedBase`, `collisionSize`, life, armor, attacks (damage, range, cooldown, `attack1AreaOfEffectFullDamage`/`Medium`/`Small` and their damage factors), model, scale, abilities |
| `abilitiesdata.json` | 832 abilities | levels, durations, areas, effects |
| `destructablesdata.json` | 336 destructables | name and editor suffix, life, `fixedRotation` (-1 when it turns freely), `pathingTexture`, `selectableInGame`, `targetedAs` |
| `doodadsdata.json` | 568 doodads | name, model, pathing |
| `itemsdata.json` | 283 items | model, abilities, stats |
| `buffsdata.json` | 237 buffs | effects, icons |
| `upgradesdata.json` | 90 upgrades | effects per level |

Read them whenever a conversion needs a value the old object data doesn't set: a monster type's speed, the old hero's collision (`hero.collision`), a mortar's areas, whether a gate has a fixed rotation (Sliding Bunnys' `LTg3` "Gate (Vertical)" is fixed at 0, `DTg5` at 270, `DTg7` at 0), what an unknown id is (`DTfx` is the "Foot Switch"). An old map's own changes (`facts.json`'s object data) come first. The values follow a game version before the 2.0 patches, which suits old maps; a recent rebalance may be missing.

## MEC API from hand-written Lua

- `MEC_core` functions use a dot: `MEC_core.onStartLevelAny(function(level) ... end)`, `MEC_core.getEscapers()`, `MEC_core.newMonsterSimplePatrol(...)`.
- Hook callbacks receive their arguments directly.
- Methods on MEC objects use a colon: `level:getId()`, `MEC_core.getTerrainTypes():getByLabel("slide")`, `slide:setCanTurn(true)`, `monster:killUnit()`, `escapers:get(id)`, `escaper:kill()`. Check a method you haven't used yet in the compiled `bin/MEC_core.lua`: `self.x = function(____, …)` takes the object, `self.x = function()` doesn't mind it.
- Useful hooks: `onStartLevelAny`, `onEndLevelAny`, `onStartLevel(n, cb)` (only once levels exist), `onAfterCreateMonsterUnit(monster)` (for a spawn's unit it gets a bare `{ mt, u }`, with no methods: calling `monster:someMethod()` there throws, as it did on Polar Escape 3's flood), `onHeroEnterRegion(escaper, region)`, `onEscaperDeath`, `onGameWinning` (return `false` to cancel MEC's end of the game), `onBeforeHeroUsingMeteor`.
- When a level changes, MEC removes the old level's monster units, runs its end hooks, creates the new level's monster units, then runs its start hooks. Restarting a level after the heroes all die is not a level change.

### Staying synced

- Anything deciding what happens to a hero reads its unit (`escaper:getHero()`, `RectContainsUnit`), not `escaper:getHeroX()`: a hero sliding as an effect has a position of its own on each machine.
- Go through heroes by id (`MEC_core.getEscapers():get(id)` for 0 to 23), never with `pairs`. A `pairs` walk is only fine when it finds a single thing by an exact match.
- No `GetLocalPlayer` branch creating or changing game state (see `docs/CAUSES_OF_DESYNCS.md`).
- Region-enter events (MEC regions, `killRectDimensions`) fire on the hero **unit**, which trails behind a hero sliding in async mode: they can come late for async heroes. The user has accepted this for gates.

## Technical notes

- The base map's map info (format 39 for 3.0) is beyond the `mdx-m3-viewer-th` parser: its fixed-size fields are patched in place.
- The library writes object data of format 3 wrongly (set flag and modification count swapped): `objectData.ts` fixes it, and the base map's object data then round-trips byte for byte. Which field goes to the skin file, and each field's type, come from `war3-objectdata-th`'s official field list (`isSkinField`, `variableTypeOf`). It matches the base map's 716 fields exactly.
- Maps saved by the current editor have no `HM3W` header; the output mirrors the base map.
- The editor shows messages the MEC base map shows too, which are not conversion errors: "Failed to load Environment Map for tileset X", "Referencing unknown database field" (`UnitUI.slk`, `ItemData.slk`, `SkinMetaData.slk`), "Missing string: WESTRING_UEVAL_…".
- Saving the converted map in the World Editor rebuilds `main`/`config` from the map info. The lighting models may then fall back to the tileset's default, since the map info's light environment isn't patched.
- The MEC base map's own 2.2 core doesn't make mortars kill: the repo's core does (sensors).

## Validated in game (Polar Escape 3)

- 2026-09-18, World Editor: the rebased map opens with the old terrain, doodads and bounds.
- 2026-09-19, in game:
  - mortars kill;
  - the camera starts on level 1;
  - the level-end strips fire inside the next start and can't be walked around;
  - the welcome message and upkeep text show the old name and author.
  - the one-way portals (`oneWay`) work;
  - keys that look swapped can be the original's own pairing (level 3): check the old triggers and keep them as they are.
