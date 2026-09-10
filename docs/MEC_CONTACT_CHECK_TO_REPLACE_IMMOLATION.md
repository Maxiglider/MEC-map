# Replacing the Warcraft III immolation with MEC's own contact check

Status: **implemented for the monsters of the levels.** The runtime switches, the e2e tests and the
chunk index all exist (`src/core/04_STRUCTURES/Monster/ContactChunks.ts`, driven by `-cc`). Still
open: the monster spawns and the casters, which the check still walks in full, and the default value
of `IMMOLATION_SYSTEM_ENABLED`.

Not measured in game yet: the numbers in [Why](#why) are the ones this replaces.

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
2. **The immolation is expensive**, even with nobody to burn. Measured on the whole Mumu map
   (1518 monsters), fps read in game:

    | Monsters | Heroes | Detection                  | fps  |
    | -------- | ------ | -------------------------- | ---- |
    | 1518     | 0      | immolation                 | ~120 |
    | 1518     | 3      | immolation                 | ~110 |
    | 1518     | 24     | immolation                 | ~80  |
    | 1518     | 0      | none                       | ~160 |
    | 1518     | 3      | none                       | ~160 |
    | 1518     | 24     | none                       | ~120 |
    | 0        | 0      | none                       | ~200 |
    | 1518     | 1      | contact check, unoptimized | ~120 |
    | 1518     | 3      | contact check, unoptimized | ~80  |
    | 1518     | 24     | contact check, unoptimized | ~0.1 |

    So the immolation costs ~40 fps with no hero at all, and ~40 more for 24 heroes. **That is the
    budget to beat**: 24 heroes above ~80 fps beats the engine, above ~120 fps beats an idle map.

    The unoptimized contact check collapses because it is `O(heroes x monsters)` with natives in the
    inner loop: `24 x 1518 x 50/s` is 1.8M candidate tests per second, each calling
    `GetUnitTypeId`, `IsUnitAliveBJ`, `IsUnitHidden`, `GetUnitX`, `GetUnitY`.

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
- **`-cc`** (`-contactChunks`, admin) — `stats`, `audit`, `rebuild`, `tiers <size> [<size> ...]`.
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

A monster is registered in **every chunk its padded movement area overlaps**, at one tier. A hero
can only touch that monster if the hero's own position is inside that padded area, hence inside one
of those chunks. So the query is: **the single chunk containing the hero's point, at each tier.**
One integer key per tier, no neighbour scan, nothing missed.

### Registration, once per monster unit

1. Compute the **cells the movement actually visits**, not the bounding box of it: the two points of
   a simple patrol, the segments of `MonsterMultiplePatrols`, the target cells of `MonsterTeleport`
   (whose bbox is huge and whose path is two dots), the single cell of `MonsterNoMove`. This is
   what keeps a long diagonal patrol in a fine tier instead of collapsing it into `1x1`.
2. **Pad** those cells by the monster's own reach (its immolation radius) plus the hero side of the
   contact (the largest hero collision size in play) plus `MAX_SWEPT_STEP`. Padding the monster
   rather than the query is what allows the query to be a single point: if the swept segment came
   within reach, its arrival point is within `reach + step`.
3. Choose the **finest tier whose overlapped-chunk count stays under a cap** (generous — 16 to 32
   entries is nothing), going up a tier while the count is over it. `1x1` is mandatory as the last
   fallback: a monster patrolling the whole map on its own has to live somewhere.
4. Register the monster in each of those chunks.

The geometry was brute-forced offline before being trusted: 60k random monsters (points, long
diagonals, polylines, rects) against 700k hero positions drawn around them, checking that every
hero within the padding of a monster finds it in its own chunk. Zero misses, 6.4 chunks per monster
on average.

Because entries are cheap and paths are rasterized, almost everything fits a fine tier. The tier
ladder exists only to bound the entry count, so **three tiers** (something fine, something middling,
and `1x1`) should do what six were for — and each hero then costs 3 lookups per tick.

### The query, 50 times per second, per hero

1. Per tier, compute the key of the chunk containing the hero's arrival point.
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
- `Escaper.setHeroCollisionSize` — and `setHeroBaseCollisionSize` through it: the padding covers the
  largest hero in play.
- `MonsterTeleport.addNewLocAt` / `destroyLastLoc` and `MonsterMultiplePatrols.addNewLocAt` /
  `setLocAt` / `destroyLastLoc` — a path is filled point by point, well after the unit exists.
- `Region.setFlag` / `setFlags` — a `wanderable` region is how far the monsters inside it roam.

Anything else that moves a monster in a way its movement class does not describe is a missed
contact, which is what `-cc audit` is for: it checks that every registered monster unit really
stands in one of its own chunks, and names those that do not.

### Monster spawns

Spawns are few, so a linear scan over the active ones is fine. Each spawn gets **one custom chunk**:
the smallest square containing any position its spawned monsters can reach during the spawn's life
(region plus travel). A hero inside that square is tested against that spawn's units.

Keep a **dense per-spawn array of its live units** rather than reaching into
`udg_spawned_monster_units` or the spawn's `group`: a plain Lua loop over ten units beats any group
enumeration.

The caveat is a spawn whose region plus travel covers the map — its chunk is then the map, and all
its units are tested by every hero.

### Casters

`CasterShot` creates temporary monsters that fly across the map for a second or two. Not decided
yet; probably the same shape as a spawn — a per-caster list with the flight's bbox as its chunk.

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
3. **A command and a stats readout** - `-cc tiers 512, 4096` and `-cc stats` (entries per tier,
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

The same pair frames every later rebuild (a `-cc tiers` retune, a level being made), so the cost of
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
2. ~~The chunk index for the level monsters~~ done. Left to do: measure `contactCheckOn` +
   `immolationOff` against the table at the top, and tune the ladder with `-cc tiers`.
3. Monster spawns (still walked in full, which is cheap while they are few).
4. Casters.
5. Only then: `IMMOLATION_SYSTEM_ENABLED` flipped to `false` by default, and the immolation
   abilities dropped from the monster types.
