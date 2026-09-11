# Replacing the Warcraft III immolation with MEC's own contact check

Status: **implemented and measured.** The runtime switches, the e2e tests and the chunk index all
exist (`src/core/04_STRUCTURES/Monster/ContactChunks.ts`, driven by `-contactChunks`), monsters of
the levels, spawned monsters and caster shots alike. With 24 heroes on Mumu the check costs **+0.6 ms
per frame where the immolation costs +2.6 ms** - four times cheaper, with better lows (see
[Why](#why)). Still open: the default value of `IMMOLATION_SYSTEM_ENABLED`.

## Why

A hero touching a monster is detected by the engine: every monster unit carries an immolation
ability whose radius is the collision radius of its monster type, and the invisible unit that
follows the hero takes the damage. `src/core/08_GAME/Death/InvisUnit_is_getting_damage.ts` turns
that damage event into everything a contact means — a death, a revived ally, a jump pad, a life
bonus, a cleared mob, a terrain-save event.

Two reasons to replace it:

1. **A hero sliding in async mode is an effect**, and nothing can immolate an effect. That is why
   `src/core/Test/async/AsyncContactCheck.ts` already exists: it measures the very same radii by
   hand for those heroes.
2. **The immolation is expensive**, even with nobody to burn - and the check that replaces it is
   cheaper, as the measurements below say.

### Precise results with MangoHud: average fps of 1min of gametime

One MangoHud recording per mode. Mumu is played with every level activated, so all of its
monsters are on the map at once; Clowny is measured where its monster spawns are heaviest.

| Map    | Monsters    | Heroes | Detection                                                       | Average fps                              | 1% min | 0.1% min | Average frame time |
| ------ | ----------- | ------ | --------------------------------------------------------------- | ---------------------------------------- | ------ | -------- | ------------------ |
| Mumu   | 1518        | 5      | <span style="color: teal">none</span>                           | <span style="color: teal">153.1</span>   | 58.2   | 43.9     | 6.5 ms             |
| Mumu   | 1518        | 5      | <span style="color: orange">immolation</span>                   | <span style="color: orange">117.9</span> | 42.0   | 32.4     | 8.5 ms             |
| Mumu   | 1518        | 5      | <span style="color: green">MEC contact check - optimized</span> | <span style="color: green">148.9</span>  | 56.3   | 43.0     | 6.7 ms             |
| Mumu   | 1518        | 24     | <span style="color: teal">none</span>                           | <span style="color: teal">125.4</span>   | 52.1   | 42.4     | 8.0 ms             |
| Mumu   | 1518        | 24     | <span style="color: orange">immolation</span>                   | <span style="color: orange">94.1</span>  | 39.2   | 30.8     | 10.6 ms            |
| Mumu   | 1518        | 24     | <span style="color: green">MEC contact check - optimized</span> | <span style="color: green">116.5</span>  | 47.7   | 37.5     | 8.6 ms             |
| Mumu   | 1518        | 3      | <span style="color: red">MEC contact check - basic code</span>  | <span style="color: red">~80</span>      |        |          |                    |
| Mumu   | 1518        | 24     | <span style="color: red">MEC contact check - basic code</span>  | <span style="color: red">~0.1</span>     |        |          |                    |
| Clowny | 722 spawned | 5      | <span style="color: orange">immolation</span>                   | <span style="color: orange">105.2</span> | 38.3   | 30.4     | 9.5 ms             |
| Clowny | 722 spawned | 5      | <span style="color: green">MEC contact check - optimized</span> | <span style="color: green">146.9</span>  | 51.4   | 40.9     | 6.8 ms             |

The two basic-code rows are read off the in-game counter rather than MangoHud: at 0.1 fps there
is nothing left to record. Clowny has no "none" recording, so its two rows compare only with
each other: **the check costs 2.7 ms per frame less than the immolation** there (6.8 against
9.5), on a map whose load is made of spawned monsters rather than monsters written in its
levels - 722 of them walking their lines at once.

Read in frame time, which is the metric that adds up. Against detecting nothing at all:

| Heroes | Immolation | Contact check | Ratio |
| ------ | ---------- | ------------- | ----- |
| 5      | +2.0 ms    | +0.2 ms       | 10x   |
| 24     | +2.6 ms    | +0.6 ms       | 4x    |

Two things that says. The **immolation's bill barely moves with the number of heroes** (2.0 to
2.6 ms), because it is mostly paid per monster whether anyone is near it or not. The **check's
bill grows with the heroes** (0.2 to 0.6 ms), as it should, since it is the only thing it is paid
for - and it stays four to ten times under the engine's, while keeping better lows (47.7 against
39.2 at the 1% with 24 heroes, 37.5 against 30.8 at the 0.1%).

### Rougher readings, from the in-game counter

On the whole Mumu map (1518 monsters), with every level activated:

| Monsters | Heroes | Detection                      | fps  |
| -------- | ------ | ------------------------------ | ---- |
| 0        | 0      | none                           | ~200 |
| 1518     | 0      | none                           | ~160 |
| 1518     | 3      | none                           | ~160 |
| 1518     | 24     | none                           | ~140 |
| 1518     | 0      | immolation                     | ~120 |
| 1518     | 3      | immolation                     | ~110 |
| 1518     | 24     | immolation                     | ~80  |
| 1518     | 1      | MEC contact check - basic code | ~120 |
| 1518     | 3      | MEC contact check - basic code | ~80  |
| 1518     | 24     | MEC contact check - basic code | ~0.1 |
| 1518     | 1      | MEC contact check - optimized  | ~160 |
| 1518     | 3      | MEC contact check - optimized  | ~160 |
| 1518     | 24     | MEC contact check - optimized  | ~130 |

The in-game fps reading moves around, so these are the orders of magnitude rather than exact
figures - `scripts/fps-average.py` reads a 20-second average off MangoHud's per-frame log for
the comparisons that need to be closer than that. What they say:

- **the immolation costs ~40 fps with nobody to burn** (160 -> 120), and ~60 fps with 24 heroes
  (140 -> 80). It is paid whether or not anyone is near a monster;
- **the chunk index costs nothing up to 3 heroes** (160, which is the no-detection reading) and
  **~10 fps with 24** (140 -> 130) - about six times cheaper than the engine's own immolation,
  and it is only paid where heroes actually are;
- the same check **without** the index goes from 120 fps for a single hero to a frozen game at
  24, because it is `O(heroes x monsters)` with natives in the inner loop: `24 x 1518 x 50/s` is
  1.8M candidate tests a second, each calling `GetUnitTypeId`, `IsUnitAliveBJ`, `IsUnitHidden`,
  `GetUnitX`, `GetUnitY`. With the index a hero sees a handful of candidates instead of 1518 -
  on Mumu's map-wide last level, 780 monster units spread over 776 chunks means 3.1 candidates
  per chunk and 14 in the worst one.

## What exists today

- **`Immolation_system.ts`** (`src/core/04_STRUCTURES/Monster/`) — `IMMOLATION_SYSTEM_ENABLED` is
  the default state, `isImmolationSystemEnabled()` the runtime reading, and
  `setImmolationSystemEnabled(enabled)` adds or removes the immolation ability on every monster
  unit on the map (`udg_monsters` for the levels, `udg_spawned_monster_units` for the spawned
  ones), temporarily disabled monsters excepted. Two call sites read the flag:
  `NewImmobileMonsterForPlayer` (so monsters born later get none) and `Monster.temporarilyEnable`.
- **`AsyncContactCheck.ts`** (`src/core/Test/async/`) — the check itself, every
  `CONTACT_CHECK_PERIOD` (0.02 s): swept-segment distance against the monsters of the chunks the
  hero stands in, the spawned monsters, and the power circles of the other heroes
  (`Constants.COOP_REVIVE_DIST`). One permanent `ContactContext` per hero, so nothing is allocated
  per tick. `setContactCheckEnabledForEveryHero(enabled)` widens it from the async heroes to all of
  them. A monster whose immolation was temporarily taken away (a disabled clear mob) is skipped, as
  the immolation itself would be.
- **`ContactChunks.ts`** (`src/core/04_STRUCTURES/Monster/`) — the index: the tier ladder, the
  registration, the query, the rebuild and its logs, the stats and the audit. A monster joins its
  chunks in `Monster.createUnit` and leaves them in `Monster.removeUnit`, so the index holds exactly
  the monster units standing on the map, whatever level they belong to.
- **`Monster.describeContactArea`** — how a monster says where it can be found. The base class
  answers for a circle mob (carried around its trigger mob) and otherwise defers to
  `describeOwnContactArea`, reimplemented by `MonsterNoMove` (its point, or its whole wanderable
  region), `MonsterSimplePatrol` (its line), `MonsterMultiplePatrols` (its polyline, closed in
  `normal` mode) and `MonsterTeleport` (its stops, `WAIT` and `HIDE` skipped).
- **`-contactChunks`** (admin) — `stats`, `audit`, `rebuild`, `tiers <size> [<size> ...]`.
- **`applyContact(escaperId, kind, id)`** (`src/core/Test/async/AsyncHeroSync.ts`) — what a contact
  does, which is the handler the immolation used to call. Both roads lead to it.
- **e2e tests** (`src/core/Test/e2e-tests/`): `immolationOff` / `immolationOn`,
  `contactCheckOn` / `contactCheckOff`, plus `activateAllLevels` / `activateFirstLevelOnly` to load
  a whole map at once. `contactCheckOn` + `immolationOff` is the full replacement to measure.

### Rules already settled

- **Packets only for a hero carried by an effect.** Only its own machine knows where it is, so that
  machine looks and tells the others (`sendAsyncContact`, prefix `MEC_AHC`). Every other hero is on
  every machine, all of which find the very same contacts from synced state, so they are handled
  where they are found and the network hears nothing. A packet per machine would have said the same
  thing 24 times.
- **The repeat gate counts checks, not seconds.** A lasting contact (a hero resting on a jump pad
  or a harmless monster) counts again only every `CONTACT_REPEAT_CHECKS` (50 checks = 1 s), which
  is roughly the pace the immolation burned at. It is counted in ticks of the check timer, not with
  `os.clock()`: a machine's clock is its own, and pacing with it would let one machine kill a hero
  a few frames before another.
- **The swept step is dropped when it is not a step.** The check sweeps the segment from the
  previous position, so a fast slide cannot step over a monster. But a hero coming back from an
  async slide, or one this machine had stopped looking at, appears to have crossed the map in one
  tick: `context.lastCheck` / `context.wasTold` and `MAX_SWEPT_STEP` (2 tiles) turn such a step into
  a landing, identically on every machine.
- **Locust.** Monsters carry Locust to be unclickable, and the enumeration natives ignore those, so
  the engine cannot be asked what is nearby: the candidates come from what MEC tracks itself.

## The decided design: chunks

### Vocabulary

- **chunk** — one cell of a grid over the map.
- **tier** — one grid, named by its division (`1x1`, `8x8`, …). Not "level": that word is a MEC
  level.

### The invariant

**Each side pays for its own size.** A monster is registered in every chunk its **own reach**
overlaps around everywhere it can stand. A hero asks for the chunks its **step** went through,
widened by its **own collision size**. For any real contact, the point lying at the monster's reach
from it towards the hero belongs to both areas, so one chunk holds the monster and is asked for:
nothing can be missed.

That split is the whole performance argument. Padding is read at every tick of every hero, while a
query is the business of the one hero making it:

- folding `MAX_SWEPT_STEP` (256) into the padding, as the first version did, cost 8.3 chunks per
  monster on Murloc Slide - where the hero collision size is 0 and the immolations are small -
  against 1 to 4 for the same monsters once it moved to the query;
- folding the hero's collision size in meant taking the **largest hero in play** and padding every
  monster with it, so one hero at 256 would degrade the index for the 23 others, and every size
  change would mean a full rebuild. In the query it costs only the hero it belongs to, and a hero
  growing during the game costs the index nothing at all.

In practice that is one integer key per tier when the step and the hero fit inside a chunk, two to
four when they cross a boundary.

### Registration, once per monster unit

1. Compute the **cells the movement actually visits**, not the bounding box of it: the two points of
   a simple patrol, the segments of `MonsterMultiplePatrols`, the target cells of `MonsterTeleport`
   (whose bbox is huge and whose path is two dots), the single cell of `MonsterNoMove`. This is
   what keeps a long diagonal patrol in a fine tier instead of collapsing it into `1x1`.
2. **Pad** those cells by the monster's own reach (its immolation radius), and by nothing else: the
   hero's collision size and the step it took are the query's business.
3. Choose the **finest tier whose overlapped-chunk count stays under a cap** (generous — 16 to 32
   entries is nothing), going up a tier while the count is over it. `1x1` is mandatory as the last
   fallback: a monster patrolling the whole map on its own has to live somewhere.
4. Register the monster in each of those chunks.

The geometry was brute-forced offline before being trusted: 60k random monsters (points, long
diagonals, polylines, rects) against 720k real contacts drawn around them - a monster position on
its own area, a touching point within reach of it, and a swept step of up to `MAX_SWEPT_STEP`
through that point - checking that the query finds the monster every time. Hero collision sizes were
drawn from 0, 25, 100 and 256, the range a future MEC would vary them over. Zero misses, 4.3 chunks
per monster, 2.15 chunk lookups per tier.

Because entries are cheap and paths are rasterized, almost everything fits a fine tier. The tier
ladder exists only to bound the entry count, so **three tiers** (something fine, something middling,
and `1x1`) should do what six were for — and each hero then costs 3 lookups per tick.

### The query, 50 times per second, per hero

1. Per tier, walk the chunks of the step's bounding box, widened by the hero's collision size -
   usually one.
2. Test the hero against the monsters of those chunks, cheapest first: cached position arithmetic
   before any native.
3. Test the hero against the chunk of each **active monster spawn** (see below).

The hero is **not** inserted into the chunks: nothing needs to know which heroes are in a chunk, so
computing the keys is enough and saves 24 table writes plus clears per tick.

### Membership follows the unit, not the definition

The chunk assignment is computed from the monster's data and is stable for its life, but the
insertion into / removal from the chunks happens on `createUnit` / `removeUnit`. An inactive level's
monsters are then simply absent, and most of the per-candidate `GetUnitTypeId === 0` / dead / hidden
filtering disappears with them.

Each chunk holds a **dense array plus a `monsterId -> index` map**, so removal is a swap with the
last element rather than a hole or a hash walk.

### Re-registration triggers

All deterministic and rare, and all going through `requestContactChunksRebuild()`, which waits
`REBUILD_REQUEST_DELAY` for the rest of the burst that asked for it (a single command changes the
immolation of every monster type, or the collision size of every hero):

- `MonsterType.setImmolation` — `-setMonsterImmolation`, `-patchImmo`: the padding is built on the
  reach.
- `MonsterTeleport.addNewLocAt` / `destroyLastLoc` and `MonsterMultiplePatrols.addNewLocAt` /
  `setLocAt` / `destroyLastLoc` — a path is filled point by point, well after the unit exists.
- `Region.setFlag` / `setFlags` — a `wanderable` region is how far the monsters inside it roam.

Anything else that moves a monster in a way its movement class does not describe is a missed
contact, which is what `-contactChunks audit` is for: it checks that every registered monster unit really
stands in one of its own chunks, and names those that do not.

### Monster spawns and caster shots

A spawned monster moves without pause, but it **never leaves the line it was told to walk**: the
waypoints `LongDistanceMoveOrder` computes all sit on the straight segment to its destination, and a
caster shot flies straight to the end of its range. So a spawned unit is registered exactly like a
monster of a level, once, with that segment as its area - no per-tick tracking of anything.

- a monster spawn registers its mob where it issues the move order, in `MonsterSpawn`'s spawn
  handler, and takes it out of the chunks in `removeMonsterUnit`. Since the unit is hidden and handed
  back to its recycler rather than removed, its bookkeeping is kept for the next time it comes back
  under the same handle;
- a caster shot registers its flight in the `CasterShot` constructor and is forgotten in `destroy`,
  where the unit really is removed;
- **the segment is clamped to the spawn's zone** (`clampWalkToSpawnRegion`, a binary search over the
  convex zone plus one tile of margin for the few frames the watcher takes to notice). The order a
  mob is given reaches past the zone on purpose, and a timed unspawn sends it towards a point it
  never reaches - registering that would stretch its area over the whole map for nothing.

An earlier plan gave each _spawn_ one chunk covering everywhere its mobs can go, and walked its
units from there. That falls apart on a spawn with a wide zone and a lot of mobs, which is common:
every hero inside the zone would walk all of them. Registering the units themselves keeps the cost
where it belongs.

## Tuning the ladder in game

The chunk index is only an accelerator over synced data. As long as it stays exact - padding
correct, and the entry cap **promoting a monster to a coarser tier rather than dropping it** - the
set of contacts found does not depend on the ladder, so a tier size is a pure performance knob: it
cannot change the gameplay and cannot desync, even if two machines disagreed on it.

Three things keep the retuning to one command instead of a rebuild:

1. **Tier sizes are chunk sizes in units, in one array** - `[512, 4096]` plus the implicit
   whole-map tier - and the chunk counts per tier are derived from `globals.MAP_MIN_X/MAX_X` at
   init. Units rather than divisions means the same number means the same thing on any map. Nothing
   outside the chunk module sees a size.
2. **One rebuild entry point**, `rebuildContactChunks()`, walking the live monster units and the
   spawns. 1518 monsters at about 4 entries each is some 6k table writes, a millisecond: a ladder
   change applies in game, with no `yarn build` and no relaunch between two measurements.
3. **A command and a stats readout** - `-contactChunks tiers 512 4096` and `-contactChunks stats` (entries per tier,
   monsters per tier, worst chunk occupancy, average candidates per hero per tick). The tuning loop
   is then: `activateAllLevels`, `immolationOff`, `contactCheckOn`, read fps and stats, retype the
   ladder, again.

### What the padding does to the useful range

A monster's padded square is its own reach, plus the largest hero collision size in play (25,
up to 200), plus the swept step (`MAX_SWEPT_STEP`, 256). For a typical monster that is 100 to 300
units of padding, so a motionless monster already covers some 600 units. Below 512-unit chunks each
monster starts spilling into 4, then 16 chunks: the entry count keeps growing while the candidate
count barely drops. **The padding, not the map size, sets the floor on a useful chunk size**
(roughly: chunk >= 2 x padding).

So the range worth trying is narrow. On a 160x160-tile map (160 x 128 = 20480 units per side; the
MEC dev map is 192x192 tiles, 24576 units), 1518 monsters is one monster per ~270k units^2, which
uniformly gives ~1 per 512-unit chunk, ~4 per 1024 and ~15 per 2048 - times 5 to 10 in the chunks
the escape route runs through. A fine tier of 512 or 1024, a middling one around 4096, then the
whole map.

### Registration logs

The initial registration says so, on every machine:

```
Starting monsters contact check registration...
Monsters contact check registration done. 1518 monsters, 5964 entries in 3 tiers, 14 ms
```

The same pair frames every later rebuild (a `-contactChunks tiers` retune, a level being made), so the cost of
a rebuild is never a guess. The elapsed time is read from `os.clock()`, which is fine here: it is
displayed, never used to decide anything.

## Rejected alternatives, and why

- **One chunk per monster, with a base grid plus one grid offset by half a chunk in x and y.** The
  offsets do not decouple the axes: a square straddling a boundary in x only, comfortable in y,
  fits neither grid and falls up a tier. For a square of side `s` in a chunk of size `c`, with
  `p = s/c`, the probability of fitting neither is `1 - 2(1-p)^2 + (1-2p)^2 = 2p^2`. With the
  natural tier choice (`c >= 2s`), `p` is between 0.25 and 0.5, so **12.5% to 50% of monsters are
  promoted** to a chunk 4x larger in area — roughly a 2x inflation of the candidate tests, on the
  exact metric being optimized.
- **Four lattices per tier** — offsets `(0,0)`, `(1/2,0)`, `(0,1/2)`, `(1/2,1/2)`. This does
  decouple the axes, so any square of side `<= c/2` is guaranteed to fit one of them and
  registration becomes arithmetic with no fallback. Correct, but it costs 4 lookups per tier and
  four tables per tier, and multi-membership gets the same guarantee with one.
- **One chunk per monster, stored by the square's min corner, queried over a 2x2 window.** Exact and
  simpler than four lattices (one grid per tier, no offsets), also 4 lookups per tier. Superseded by
  multi-membership for the same reason.

**Multi-membership wins because padding becomes cheap.** Under single-membership, inflating a square
by the immolation radius, the hero collision size and the swept step could push it over a boundary
and promote it a whole tier — 4x more ground tested for a few hundred units of padding. Under
multi-membership the same padding costs one or two extra table entries, which is what makes the
single-point query legitimate.

## Optimizations orthogonal to the chunks

- **Reorder the candidate test.** Today `testCandidate` calls `GetUnitTypeId`, `IsUnitAliveBJ` and
  `IsUnitHidden` _before_ the arithmetic rejections. Reversed — read the position, reject by
  distance, ask the engine only about what is actually being touched — three natives per
  non-touching candidate disappear.
- **Cache monster positions once per tick.** When 24 heroes crowd the same corridor, which is the
  normal case in an escape map, the same monster's position is read 24 times per tick. One cache
  stamped with the check counter fixes it.
- **Immobile monsters** (`MonsterNoMove`, most of an escape map) could hold their position from
  creation and never be read at all, if the few places that move a monster invalidate it.

## Metrics worth logging while building this

- How many monsters end up in the coarsest tiers (`1x1` and the one above it). A handful of
  map-wide patrols is fine; two hundred of them eats the win.
- Average candidate count per hero per tick, and the total number of chunk entries.

With 16x16 chunks on a ~12000-unit map (750-unit chunks) and monsters spread out, a hero should see
a few dozen candidates per tick: ~40k arithmetic tests per second for 24 heroes, against 1.8M tests
and 9M natives today.

## Order of work

1. ~~The candidate test reordered~~ done. The per-tick position cache was dropped on purpose: with
   the index, a monster is seen by few heroes, so there is nothing left to share.
2. ~~The chunk index for the level monsters, measured against the table at the top~~ done. The
   ladder needed no tuning: on Mumu every monster fits tier 0 (512 units), nothing is promoted, and
   the worst chunk holds 14 of the 780 units of the heaviest level.
3. ~~Monster spawns and caster shots~~ done, on the line each mob is told to walk.
4. Only then: `IMMOLATION_SYSTEM_ENABLED` flipped to `false` by default, and the immolation
   abilities dropped from the monster types.
