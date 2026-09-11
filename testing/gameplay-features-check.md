# Gameplay features check — template

**Copy this file before using it**, to `testing/gameplay-features-check_<date>_<what is tested>.md`,
and fill the two lines below. This one stays empty, as the list to start from.

- Date:
- Tested: <branch, release or map>

A MEC map holds two kinds of features, gameplay and creation. This is the gameplay half: what a
player meets while playing. Creation features - making levels, editing terrain, the `-smic` export -
are not listed here, apart from the settings that travel with a map and are worth a look after a
reload.

**Every item is to be tried twice**: once normally, and once with `-autoTurn async` while the hero
slides. The hero's own unit waits in a corner of the map during an async slide, so anything reading
that unit rather than asking the escaper is what breaks - which is how most of the bugs of the
async-sliding branch were found.

Handy while testing:

| Command                                             | What for                                                        |
| --------------------------------------------------- | --------------------------------------------------------------- |
| `-autoTurn async` / `sync` / `off`                  | how the hero is steered and carried while sliding               |
| `-contactCheckOn` / `-contactCheckOff` (`-e2e run`) | MEC's own contact check for every hero, not only the async ones |
| `-immolationOff` / `-immolationOn` (`-e2e run`)     | the immolation of the engine, on or off                         |
| `-e2e ls`                                           | the tests that can be run                                       |
| `-contactChunks stats`                              | what the index holds right now                                  |
| `-contactChunks auditWatch`                         | tells every second whether a monster left its chunks            |
| `-mnbm`                                             | how many monsters the map defines                               |

## Start here: what is most likely to have broken

(Reorder this section for whatever is being tested. What follows is what the async-sliding branch
put at risk: the hero becoming an effect, and MEC finding its contacts itself.)

- [ ] Nothing is detected twice: a single contact kills once, gives one life, fires one jump pad
- [ ] Casters shoot at a hero sliding in async mode (they watch a unit entering their range)
- [ ] A level is completed while sliding in async mode (the end rect watches a unit too)
- [ ] Kill rects of `MonsterNoMove` still kill a sliding async hero
- [ ] Death terrain still kills during an async slide, and at the same place for everyone
- [ ] Two machines in async mode for a whole level, no desync
- [ ] `-contactChunks auditWatch` stays quiet for a whole map, every level played

## Hero, terrain and movement

- [ ] Hero spawns at the start of level 0 with the map's own model
- [ ] Walk speed follows the terrain type (`walk` kinds with different speeds)
- [ ] Slide starts on a `slide` terrain and stops on a `walk` one
- [ ] Slide speed follows the terrain, including a terrain change mid-slide
- [ ] `death` terrain kills after its `timeToKill`, with its killing effect
- [ ] Gravity: a hero leaving the ground falls back and lands where it should
- [ ] A hero in the air cannot turn (unless `CAN_TURN_IN_AIR`)
- [ ] Sliding over pathing blockers behaves as `canSlideOverPathingBlockers` says
- [ ] Static slides carry the hero, and release it at their end
- [ ] Jump pads launch the hero with the height they carry
- [ ] The hero is put back on the ground at the end of a slide, at the right place
- [ ] Revive after death: position, lives, animation (`animOnRevive`)
- [ ] Autorevive delay, when the map sets one

## Contacts, by what is touched

- [ ] `MonsterNoMove` kills on contact
- [ ] A wandering `MonsterNoMove` kills while it roams its region
- [ ] `MonsterSimplePatrol` kills anywhere along its line
- [ ] `MonsterMultiplePatrols` kills along every leg of its path
- [ ] `MonsterTeleport` kills at each of its stops, and never between them
- [ ] A monster carried by a circle mob kills all around the circle
- [ ] A monster of a monster spawn kills anywhere along its walk
- [ ] A caster shot kills along its flight
- [ ] A clickable monster (`bigMama`) takes the meteors it asks for before dying
- [ ] A monster whose immolation radius is 0 is walked through, and kills nobody
- [ ] A temporarily disabled monster (cleared) kills nobody, and kills again once back
- [ ] A hidden monster (spawn hide region) kills nobody
- [ ] Contact is found at the right distance: not through a wall of one collision size

## What a contact does

- [ ] Book of life: lives earned, its sound heard, the book gone
- [ ] Book of life with a `minimumSurviveTime`: nothing earned if the hero dies first
- [ ] Clear mob: clears what it must, once
- [ ] Portal mob: sends the hero where it should, facing and speed kept
- [ ] Circle mob: rotation, direction, shape and radius as the map set them
- [ ] Monster touch events of a terrain save fire
- [ ] Mortar (`attackGroundPos`) takes the life it should rather than killing outright
- [ ] God mode: no death, and monsters killed if the mode says so
- [ ] Coop invulnerability after a revive: no death for its duration

## Monster spawns

- [ ] Mobs appear at the frequency and amount the spawn asks for
- [ ] Direction modes: `straight`, `random`
- [ ] Mobs are removed when they leave the zone of their spawn
- [ ] Timed unspawn removes them on time
- [ ] Hide regions hide them, and show them again on the way out
- [ ] A spawn stops with its level, and starts again with it
- [ ] `-contactChunks stats` counts the live spawned mobs

## Casters

- [ ] A caster shoots when a hero comes within its range
- [ ] It aims ahead of a sliding hero rather than at it
- [ ] It holds fire while the hero is in the air
- [ ] It waits its load time between two shots
- [ ] It stops shooting once no hero is in range
- [ ] Several heroes in range: it picks among them

## Levels, progression and lives

- [ ] Reaching the end completes the level and starts the next
- [ ] Lives earned at the beginning of a level, and on completion
- [ ] Lives lost on death, game over at zero
- [ ] Progression `all`, `allied`, `solo`
- [ ] `-restartLevel`, `-goToLevel`, `-endLevel`
- [ ] Visibilities are applied at the start of a level, and reset if the map says so
- [ ] Regions and their `onHeroEnterRegion` hooks fire
- [ ] TP for end (`tpForEnd`) carries the hero
- [ ] Meteors can be picked up, used, and count as the monster type asks

## Coop

- [ ] The power circle of a dead ally revives them when touched
- [ ] It revives them while the saviour slides in async mode
- [ ] The saviour's "saves" score goes up
- [ ] A leaver's hero is dealt with

## Async slide, what the branch adds

- [ ] `-autoTurn async`: the hero follows the cursor with no network delay
- [ ] `-autoTurn sync`: the hero follows the cursor at the pace of the network
- [ ] `-autoTurn off`: right clicks give plain orders again
- [ ] The camera keeps its distance when a slide starts (no zoom jump)
- [ ] The camera locked on an ally follows them through their async slide
- [ ] The hero keeps its dot on the minimap while sliding
- [ ] The hero's portrait and appearance stay right during a slide
- [ ] Sounds of the hero are heard where the hero is seen
- [ ] `-setHeroModelPath` changes the look of a sliding hero at once, and survives a `-smic`
- [ ] `-setHeroBaseCollisionSize` still changes what a hero touches, async included
- [ ] A hero dying mid-air finishes its fall and dies on the ground, everywhere alike
- [ ] Right clicks still target destructibles and units in normal mode

## Two machines, the part that cannot be tested alone

- [ ] A whole level side by side in async mode: no desync
- [ ] One player async, the other sync: no desync
- [ ] Deaths, revives and level changes happen at the same moment on both
- [ ] A player joining the slide late sees the other's hero where it really is
- [ ] Ping does not climb while moving the mouse

## Performance

- [ ] `-e2e run activateAllLevels` then `-contactChunks stats`: everything registered
- [ ] `-contactChunks audit` finds nothing outside its chunks
- [ ] 24 heroes on a full map stay playable (see docs/MEC_CONTACT_CHECK_TO_REPLACE_IMMOLATION.md)
- [ ] `scripts/fps-average.py` over a minute, against the table of that doc

## Around the game

- [ ] AFK mode, and the killing of AFK heroes if the map asks
- [ ] APM and CPM counters
- [ ] First person mode
- [ ] Multiboard: scores, times, lives
- [ ] Game time and the time of a level
