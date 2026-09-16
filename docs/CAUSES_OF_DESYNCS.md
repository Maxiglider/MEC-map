# Causes of desyncs

_Français : [CAUSES_OF_DESYNCS.fr.md](./CAUSES_OF_DESYNCS.fr.md)_

What makes a Warcraft III game desync, which of those causes MEC has met (and how each was fixed or is still open), and how to find the next one with `-desyncProbe`.

## What a desync is

Warcraft III runs in **lockstep**. No machine sends the state of the game to the others: every machine runs the whole simulation itself, from the same starting point and the same inputs (orders, chat, sync packets), turn by turn. As long as every machine computes exactly the same thing, they all see the same game.

A desync is one machine computing something different from the others. The engine notices it a moment later (usually within a few seconds), splits the game, and each side sees the other side "leave the game". Nothing is shown about _what_ diverged, and the cause is often seconds older than the drop.

So the rule that matters is: **whatever changes the game must happen on every machine, identically, on the same turn.**

## Local code: what is safe and what is not

Some code legitimately runs on one machine only: anything behind `GetLocalPlayer()`, the async mouse and clicks, the async slide of a hero on its own machine, camera handling, UI. That code may **show** different things on each machine, but must never **change** what the game is.

| Safe on one machine only                                                                                                                 | Desync on one machine only                                                                                                                                                   |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Camera natives (`SetCameraPosition`, fields)                                                                                             | Creating or destroying an agent (effect, unit, timer, trigger, group, location, rect, region, item, lightning, force, destructable, sound, and frame since Warcraft III 3.0) |
| Showing, hiding, moving an **existing** frame; text tags, images (not agents)                                                            | Ordering, moving, killing, reviving or pausing a unit; changing its life, owner, abilities, items                                                                            |
| Moving, animating, scaling, recoloring an **existing** effect (`BlzSetSpecialEffectPosition`, `BlzPlaySpecialEffect`, alpha, time scale) | Drawing from the game's random generator (`GetRandomInt`, `GetRandomReal`)                                                                                                   |
| Vertex color / transparency of a unit, team glow                                                                                         | Taking or returning a table of the `MemoryHandler` pool                                                                                                                      |
| Reading anything                                                                                                                         | Writing shared Lua state that synced code later reads and acts on                                                                                                            |
| Sending a sync packet (`BlzSendSyncData`)                                                                                                | Starting, pausing or destroying a timer, enabling a trigger                                                                                                                  |

An **agent** is the family of engine objects (units, effects, timers…) that the engine allocates and tracks by handle id; see [the glossary](#glossary).

## The causes, with MEC's cases

### 1. An agent created or destroyed on one machine

The most common one. The machine has an object the others don't, handle ids shift, and the game diverges.

- **Killing effect shown at once on the async slider's machine** (`src/core/08_GAME/Death/AsyncKillingEffects.ts`). An effect cannot be created there alone, so every machine creates, for each async player, one effect per killing model when the async slide starts, parked under the ground. The player's machine only _moves_ and _replays_ one onto the hero at the moment of the contact. At the death, every machine creates the real effect; the machine that already showed it creates one with an empty model (a handle made everywhere, nothing drawn twice).
- **Hero effect, drawn shadow, meteor at the hand of the effect**: created with the hero or when the meteor is picked up, i.e. from events every machine hears, and only moved locally afterwards.
- **Attached meteor while the hero is an effect** (`Escaper.refreshMeteorEffects`): destroyed and made again only when the hero becomes an effect or a unit again, which every machine does on the same turn.
- **Frames, agents since Warcraft III 3.0** (`type framehandle extends agent` in its `common.j`; plain handles before): a frame made or destroyed by one machine alone, harmless until then, now desyncs the game. The async mouse was read through a lattice of hundreds of frames, and the local click through 1 or 3 click catchers depending on the width of each machine's screen: both are gone, replaced by the 3.0 natives reading the mouse (`BlzGetMouseScreenPosX/Y`, `BlzIsMouseButtonPressed`, in `src/core/Async_slide/AsyncMouse.ts` and `AsyncSlideInput.ts`), which need no frame. The command history of `src/App/Interface.ts` stays disabled for having desynced.

### 2. A random draw on one machine

The random generator is shared: one extra draw on one machine changes every draw after it.

- **Drunk mode in the async auto turn** (`To_turn_on_slide.ts`, `isDrunkSwayPositive`): the auto turn runs on the player's machine only, so it alternates the sway instead of drawing.

### 3. The game changed from a value only one machine knows

A synced object moved, turned or judged from a local value.

- **Unit of an async hero** (`Escaper.moveHeroUnitToSyncedPos`, `advanceSyncedHeroUnit`): never moved from the effect the player steers. It is moved from the last movement packet, and carried on between packets by every machine with the same math, from nothing but that packet.
- **Who touches what**: only the owner of an async hero detects its contacts (it alone knows where the hero is), and **tells** every machine, which all apply the contact on the same turn (`ContactCheck.ts`, `AsyncHeroSync.ts`). The height of the hero travels in the packet, since each machine would measure a different one.
- **Terrain under an async hero**: read by its machine alone; walkable ground or a killing terrain is **handed back** with a packet, and every machine replays the terrain check from that packet's state.
- **Unit taking back its place from the effect** (`Escaper.setHeroAsEffect`): it used to take `heroPos`, where each machine sees the effect. After a packet that is the same everywhere, but a level restart (`checkpointReviveHeroes_function.ts`) ended the effect with no packet: the synced start position overwrote x and y, not the facing, and the owner's unit faced another way than on the other machines until he walked off and got kicked. The unit now takes `syncedHeroPos`, and a level restart ends the effect mode before it moves and turns the heroes.
- **Cheat meteor** (`Meteor_functions.ts`): whether it can be dropped now reads the synced position.
- **Progression and the ditch effect** (`ProgressionUtils.calculatePlayerProgression`, `Multiboard.handleDitchLogic`): the progression was computed from `getHeroX/Y`, and it decides which living hero gets the "talk to me" effect above a dead teammate. A player sliding as an effect around a dead one crossed it at a different moment on each machine, which destroyed and made that effect on different turns (seen as `ag e…/…` differing by one). Progression now reads the synced position and the static slide the packets name, and a hero sliding as an effect is not judged by the terrain its own machine read. `-lockcam progression` reads the same progression.
- **Casters** (`Caster.ts`, packet `MEC_AHA`): they aimed from `getHeroX/Y`, where each machine sees the effect of an async hero, so whether they shot, the angle and the reload differed, and a shot unit was made on some machines only. For a hero sliding as an effect, only its own machine now works the shot out, from the effect itself, and tells every machine, which all shoot or not on the same turn. The caster waits for that answer, and gives up after 2 s (its player most likely gone). Heroes that are units are aimed at by every machine alike, as before.

### 4. Handle ids, which are not synced in Lua

Since patch 1.32, `collectgarbage` cannot be called, and the Lua garbage collector frees handles (and recycles their ids) at a different moment on each machine, all the more when some code runs on one machine only. **Handle ids differ between machines.**

- Never send a handle id in a sync packet.
- Never let a handle id decide an order: a table keyed by handle id walked with `pairs`, or sorted by id.
- Fixed in commit `ed85ea5`: spawned monsters get a registration number used for contacts and chunks (`globals.ts`, `ContactChunks.ts`), the unit recycler uses a plain queue, MEC regions and long-distance move orders are walked in creation order. The LAN repro on big spawns desynced before and no longer does.

### 5. Iteration order of `pairs`

`pairs` walks a table in the order of its internal layout, which depends on its keys and on its history. Walking the same keys in the same table on every machine is only safe if every machine built that table identically. Tables keyed by handles break this (cause 4), and so do tables reused from a pool with a different past (cause 6). Prefer arrays and creation counters whenever the order has an effect.

### 6. The `MemoryHandler` pool used by code running on one machine

`MemoryHandler` hands out recycled tables. A reused table keeps the internal layout of its previous life, so `pairs` over it depends on history. If one machine takes or returns a table the others don't, every machine hands out different tables from then on.

- **Static slide areas** used to be built on demand by the machine of an async hero (`createDiagonalRegions` takes pool tables); they are now built when the level is activated, on every machine (`StaticSlide.activate`).
- Rule: code running on one machine only uses plain `{}` / `[]`, never `MemoryHandler`.
- **Latent**: a static slide added while its level is active, other than through make mode, would still have its areas built on demand.

### 7. Shared Lua state written by local code, read by synced code

A module variable or a field that a local call writes and a synced call later reads.

- **`canTurn` in `To_turn_on_slide.ts`** used to be shared between calls: the local auto turn could leave it `false`, and a synced right click then turned the hero on some machines only. It is now a variable of each call.
- **Own-machine static slide rides**: the lane's rider list differs between machines by design. It must never be walked by synced code to act on the game. **Latent**: `StaticSlide.activate(false)` removes riders while walking the list (it skips one in two), which with different lists could release a synced hero on one machine only.

### 8. Local clocks

`os.clock()` is the clock of one machine. It is fine to decide something local (how long an effect plays, whether the owner of an async hero went silent), never to decide something the game does.

- Contact repetition is counted in **checks** of a timer started on the same turn everywhere, not in seconds.
- Half-turn protection after a slide direction switch reads a game timer (`slideClock`), not `os.clock`.

## How to share local information correctly

Use a sync packet: `BlzSendSyncData` from the machine that knows, `BlzTriggerRegisterPlayerSyncEvent` on every machine. The event fires on the same turn everywhere, **the sender included**, a network round later. Apply everything from the packet's content, not from the local state of the machine applying it. MEC's async slide packets (`AsyncHeroSync.ts`): position `MEC_AHP`, hand-back `MEC_AHT`, death `MEC_AHD`, contact `MEC_AHC`, event `MEC_AHE`, caster aim `MEC_AHA`, afk activity `MEC_AHK`.

## Finding a desync: `-desyncProbe`

The probe runs by itself for the first 2 minutes of every game, started from the initialization before the first level is activated: a desync at the very start comes before anybody can type a command. `-desyncProbe true` meanwhile keeps it on with no limit, `-desyncProbe false` stops it.

`-desyncProbe true` (admin command, heard by every machine) makes each machine write, five times a second, values that must be identical everywhere, to two files in `Documents/Warcraft III/CustomMapData/MEC/` (N = player number on that machine):

- `desync_probe_p<N>.txt`: the last minute, written once a second. The probe stops by itself when a player leaves, so the machines still in the game end this file with the drop. They notice it seconds after it happens, which is why they need the whole minute.
- `desync_probe_p<N>_last.txt`: the last 5 seconds, written at every probe. The machine a desync drops hears of no player leaving: its game just ends, and it loses up to the last second of the first file, the second before its drop, which only it can show.

After a desync, collect **both** files of **every** player (dead players included) and compare the lines with the same probe number, reading the `_last` file of the dropped machine for its final probes. The first field that differs is where to look.

- `rng`: a draw from the shared random generator (cause 2, or anything drawing locally).
- `hid`: id of a handle just made. **Ignore it**: it drifts by thousands in games that don't desync (cause 4).
- `mobs … face … ord`: sums of monster positions, facings and orders.
- `ag e…/… t…/… u…/…`: agents made/unmade by kind since the probe started, counted by wrapping every native that makes or unmakes one, whoever calls it (cause 1). `fr` counts the frames.
- `mh <handed out>/<returned>/<cached>`: `MemoryHandler` pool counters (cause 6).
- Per hero: unit position, facing, fly height, life, alive, sliding as an effect (`e`), sliding, static slide, terrain, speed, coop invulnerability, afk, camera target, invisible unit, power circle. For a hero sliding as an effect, `ss`, `tt` and `sp` read `*` and `fx*` is where that machine sees the effect: those differ **by design**.
- `[probe N death]` lines give where a hero died and its cause as written where the death was decided (contact, death terrain, static slide left sideways, or a stack trace). For an async hero only its own machine knows the cause. Not compared.

The probe only sees what it reads. A desync with no differing field before the drop points to something it doesn't read, or to the last 0.2 s.

## Reproducing locally

- Two instances on one Linux machine can play a LAN game together (see the project memory / setup notes). At 0 ping, races between a machine and the others almost never show: add latency on the loopback with `lan-delay on 50` (50 ms each way).
- Screenshots of two screens taken at the same instant do not show the same game moment: the host runs slightly ahead of the other instances. Compare probe lines, which are written at the same game tick on every machine.
- Make sure every player runs the map built from the code being tested: a probe line without `ag` / `mh` comes from an older build.

## Checklist for code that runs on one machine only

- [ ] No agent created or destroyed, frames included (use pre-created, parked effects or the empty-model trick).
- [ ] No unit ordered, moved, killed, revived, paused; no timer started or trigger enabled.
- [ ] No random draw.
- [ ] No `MemoryHandler` table taken or returned.
- [ ] No shared variable written that synced code reads to act on the game.
- [ ] Anything the game must know goes through a sync packet, applied from its content on every machine.
- [ ] No handle id sent, and no order decided by handle ids.

## Glossary

- **Handle**: a reference to an engine object, as scripts manipulate it.
- **Agent**: the handle types that inherit from `agent` in `common.j` (units, items, destructables, effects, lightnings, sounds, timers, triggers, events, groups, locations, rects, regions, forces…). Frames are agents too since Warcraft III 3.0. Players, text tags and images are handles but not agents.
- **Table**: Lua's only data structure; every TypeScript array, object and class instance compiles to one.
- **Sync packet**: data sent with `BlzSendSyncData`, received on every machine on the same turn.
