# Slide turn

_Français : [SLIDE_TURN.fr.md](./SLIDE_TURN.fr.md)_

How a sliding hero turns towards the angle it is asked for in the `max` sliding mode: the physical turn model, its settings (rotation speed, acceleration degrees, braking degrees, inertia) and how they combine, what the native `SetUnitFacing` was measured to do, the debug rays of `-debugSlideInertia`, and the cases the settings must stay clear of, whose bounds are not decided yet.

Every number below was computed by running the compiled `SlidingMax` module of `dist/map.w3x/war3map.lua` in Lua 5.3, period by period, at the default rotation speed (0.9549 rounds per second) unless stated otherwise.

## Where the turn happens

- Every slide period (`Constants.SLIDE_PERIOD`, 0.0075 s), the slide of a hero in the `max` mode calls `computeSlideTurnForOnePeriod` (`src/core/07_TRIGGERS/Slide_and_CheckTerrain_triggers/SlidingMax.ts`) with the degrees left to turn, the most a period may turn (the rotation speed, in degrees per period), the turn per period reached so far and the inertia. It turns the hero by what it answers.
- The degrees left are set as `AnglesDiff(angle asked for, facing)`, the shortest way, between -180 and 180. A right click sets them once; the auto turn (`src/core/Async_slide/AutoTurn.ts`) sets them again every period from the cursor.
- A hero sliding async: its own machine turns the effect, and every machine carries the unit on from the last movement packet through the same function. The inertia travels in the packets; the settings of `-physicalTurn` and `-legacySlideInertia` are changed by commands, which every machine hears at once. The function takes and gives nothing but numbers, so every machine turns the unit alike.

## The settings

| Setting                           | Default                              | Given by                                                                                                  |
| --------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| Rotation speed, rounds per second | `HERO_ROTATION_SPEED` = 0.9549       | slide terrain (`-setTerrainRotationSpeed`), or forced per hero (`-rotationSpeed`, `-normalRotationSpeed`) |
| Acceleration degrees              | `PHYSICAL_ACCELERATION_DEGREES` = 25 | `-physicalTurn`, for every hero                                                                           |
| Braking degrees                   | `PHYSICAL_BRAKING_DEGREES` = 80      | `-physicalTurn`, for every hero                                                                           |
| Inertia, a factor                 | `SLIDE_INERTIA_FACTOR` = 1           | slide terrain (`-setTerrainSlideInertia`), or forced per hero (`-slideInertia`, `-normalSlideInertia`)    |
| Legacy turn                       | off                                  | `-legacySlideInertia`                                                                                     |

## The physical turn

With `m` the most a period may turn, `A` and `B` the acceleration and braking degrees, and `I` the inertia:

- `c = m² / (2·A·I)`: the most the turn per period may change in one period, **both ways**.
- `b = m² / (2·B·I)`: the deceleration the hero brakes with on arrival.
- Turning `s` degrees in a period, then `s - b`, `s - 2b`… until it stops covers about `s² / 2b + s / 2` degrees. So the fastest turn per period that still stops on the angle is `s_b = -b/2 + √(b²/4 + 2·b·|degrees left|)`.
- The turn aims at `min(m, s_b)` towards the angle, moves towards that aim by at most `c`, and never turns past the angle: the last period is cut to the degrees left.

Going from no rotation to `m` by `c` per period turns about `m² / 2c` degrees, which is `A·I`. That is why the settings are in degrees rather than seconds:

- speeding up to the maximum rotation speed always takes `A·I` degrees;
- braking always starts about `B·I` degrees before the angle;
- whatever the rotation speed of the terrain or the hero. In seconds, a faster rotation braked over more degrees, and a cursor held still circled below the maximum speed.

The two values do not play the same part:

- **Acceleration** is a capacity: how fast the hero can change its rotation speed at all. It serves to start a turn, and also to counter-steer, since `c` limits the change both ways.
- **Braking** is a softness chosen for the arrival. It only works when the hero can hold it, that is when `B ≥ A` (then `b ≤ c`). Otherwise the hero cannot slow down as the braking curve asks, arrives fast, and stops dry on the angle.

### Behaviour with the defaults

| Situation                                       | Result                                                                    |
| ----------------------------------------------- | ------------------------------------------------------------------------- |
| Maximum rotation speed reached, from rest       | after 0.15 s                                                              |
| A 90° turn from rest                            | 0.56 s, the last period at 7.8°/s                                         |
| A cursor held 20° / 45° / 90° off               | 170 / 256 / 343°/s (the maximum is 343.8°/s)                              |
| At full speed, the cursor 90° to the other side | carries on 23.7° the old way, then turns back; on the cursor after 0.74 s |

A cursor held still on a fixed camera makes the hero circle around it 90° off, so it circles at the maximum speed as long as `B·I` stays under about 88°. A camera locked on the hero keeps the cursor ahead: the hero goes straight.

## Inertia

One inertia multiplies both degrees. That is the physics of a rotation: to go from a rotation speed `ω` to none, or from none to `ω`, a body of inertia `I` under a torque `τ` turns `ω²·I / 2τ`. The inertia belongs to the body (the hero on that terrain); the two degrees stand for two torques, the one starting the turn and the one braking it.

- Both degrees grow by the same factor, so their ratio stays, and so does a soft arrival (`B ≥ A`), whatever the terrain.
- The work splits cleanly: the degrees are how the turn feels, the inertia is how heavy the mapmaker wants a terrain.
- What one inertia cannot give is a "drifting" terrain, quick to start turning but slow to stop. That would take a braking factor of its own per terrain, kept so that braking never falls under acceleration.
- A deliberate departure from the physics: in degrees, the distances do not grow with the rotation speed, as if the torque grew with it. That keeps the settings readable and the circles at full speed.

Defaults (25° / 80°) under various inertias:

| Inertia | Effective A / B | 90° turn from rest | Cursor held 90° off | Counter-steer, cursor 90° to the other side  |
| ------- | --------------- | ------------------ | ------------------- | -------------------------------------------- |
| 0.5     | 12.5° / 40°     | 0.41 s             | 343°/s              | carries on 11.2°, on the cursor after 0.50 s |
| 1       | 25° / 80°       | 0.56 s             | 343°/s              | carries on 23.7°, 0.74 s                     |
| 1.1     | 27.5° / 88°     | 0.58 s             | 343°/s              | carries on 26.2°, 0.79 s                     |
| 1.5     | 37.5° / 120°    | 0.67 s             | 295°/s              | carries on 36.2°, 0.99 s                     |
| 2       | 50° / 160°      | 0.78 s             | 256°/s              | carries on 48.7°, 1.23 s                     |
| 3       | 75° / 240°      | 0.96 s             | 209°/s              | carries on 73.7°, 1.70 s                     |

## What SetUnitFacing does

Measured with `-measureTurn` (`src/core/Log/TurnMeasure.ts`, a temporary admin command): the hero turns itself through single turns and cursors held at an offset, and every change of its facing is written to `CustomMapData/MEC/turn_measure.txt`.

- The facing changes once per 0.03 s game tick.
- The maximum is 10.3124° per tick: 343.75°/s, 0.9549 rounds per second, now `HERO_ROTATION_SPEED`.
- It reaches that maximum in about 0.108 s.
- It brakes as a function of the degrees left, far softer than it speeds up, with a long tail: a cursor held 5° off turns the unit at 35°/s, 45° off at 267°/s.
- Changing the turn rate of the unit at runtime changes nothing, nor does moving the unit while it turns.

The physical turn started from a fit on those measures, single turns within about a degree. Its defaults were then tuned in the game for feel rather than for `SetUnitFacing`: the players of slide maps today mostly play MEC maps, where the turn can feel better than the native one.

## Legacy turn

`-legacySlideInertia on` brings back the turn from before the physical model, unchanged (`computeLegacySlideTurnForOnePeriod`):

- it speeds up towards the maximum over `HERO_ROTATION_TIME_FOR_MAXIMUM_SPEED` (0.11 s) times the inertia;
- under 51° times the inertia from the angle, it slows down along the table `SPEED_AT_LEAST_THAN_50_DEGREES`, read at the degrees left divided by the inertia.

A cursor held under 51° off never lets the hero reach its maximum speed, and a higher inertia widens the circles.

## Debug rays: -debugSlideInertia

`-debugSlideInertia` (`debsi`) `<boolean>` (`src/core/Async_slide/SlideTurnDebug.ts`) draws two rays from your sliding hero, 700 long, `A·I` degrees on each side of where it heads: how far the hero turns from rest before it reaches its maximum rotation speed.

- **Red** while your cursor stands between them, **green** otherwise.
- **None** while the cursor is not known (the async cursor not found yet, no mouse read), off the `max` mode, or while `-legacySlideInertia` is on.
- Lightnings are agents: the command, which every machine hears, makes and destroys a green and a red pair, folded into a point under the ground. Only your machine unfolds the right pair along the rays.
- A pair of each color rather than `SetLightningColor`. The lightning codes of `Draw_lines` all have a white texture, colored by `LightningData.slk`, and `SetLightningColor` replaces that color: the rays turned white.

## Cases to stay clear of

Nothing breaks whatever the values: no division by zero (the inertia is guarded, `-physicalTurn` refuses values that are not positive), no turn past the angle, no oscillation, no desync. But three behaviours spoil the game:

| Case                                                                                                                                                                                                                                                                                                           | Happens when                                                                                    | Measured                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **The counter-steer goes the long way round.** At full speed, the hero carries on about `A·I` degrees before it can turn back; meanwhile the shortest way to the cursor switches to its own side, and it turns all the way round. Only with a steering that sets the angle again every period (the auto turn). | `A·I` > about 180° minus the offset of the cursor: about 90° for a cursor 90° to the other side | A = B = 90: carries on 88.7°, turns back. A = B = 95: goes 270° the long way |
| **Dry arrivals.** The hero cannot hold the braking, arrives fast and stops at once on the angle.                                                                                                                                                                                                               | `B < A`, whatever the inertia                                                                   | A = 180, B = 80: 101°/s on the last period of a 90° turn, instead of 8°/s    |
| **Circles below the maximum speed** with a cursor held still.                                                                                                                                                                                                                                                  | `B·I` > about 88°                                                                               | B·I = 90: 340.5 of 343.8°/s. 120: 295. 160: 256                              |

The same values grow worse together. A = 60 and B = 90:

| Inertia | 90° turn | Cursor held 90° off | Counter-steer, cursor 90° to the other side |
| ------- | -------- | ------------------- | ------------------------------------------- |
| 1       | 0.66 s   | 340°/s              | carries on 59°, turns back                  |
| 2       | 0.94 s   | 241°/s              | 270° the long way                           |
| 3       | 1.15 s   | 197°/s              | 270° the long way                           |
| 4       | 1.33 s   | 171°/s              | 270° the long way                           |

These cases are not bound to player values: the defaults under an inertia of 4 already give `A·I` = 100°. But a mapmaker tries an inertia with the defaults, and a player with higher values would meet them on terrains where the mapmaker never did.

## Open: bounds and a player setting

`-physicalTurn` feels more like a mouse sensitivity than a cheat: it changes neither the maximum rotation speed nor the slide speed, only how the hero follows the cursor. Unlike a sensitivity, though, it changes what a hero can do: at `-physicalTurn 1 1` the inertia all but vanishes, and tight zigzags become easier. The idea under discussion:

- the two degrees become a setting of each player, in the `all` commands, still heard by every machine;
- a global `-physicalTurn` stays a cheat, for tests and for the defaults of everyone;
- bounds keep the player values, together with a maximum inertia, clear of the cases above.

The bounds conflict with the braking tried in the game: guaranteeing full-speed circles means `B·I ≤ 88°`, so with B = 80 an inertia of at most 1.1, which leaves inertia able to lighten a terrain but not to make it heavier. So a choice remains:

1. **Guarantee the counter-steer and soft arrivals only** (`A·I ≤ 90°`, `B ≥ A`), and accept slower circles on heavy terrains, which is what heaviness means. For instance acceleration 10 to 45°, a maximum inertia of 2 (45 × 2 = 90°; A = B = 45 under an inertia of 2 carries on 88.7° and turns back), B = 80 kept.
2. **Guarantee everything by lowering the braking**, for instance B at most 60° and an inertia of at most 1.4 (84°).
3. **Guarantee everything by keeping B = 80**, with an inertia of at most about 1.1.

Also possible, as a change of the computation rather than of the values: keep the side a counter-steer chose instead of switching to the other one when the hero's own carry-on flips the shortest way. It would remove the long way round even under the high inertias a mapmaker chooses.

## Commands

| Command                                                                                    | Group | What it does                                                      |
| ------------------------------------------------------------------------------------------ | ----- | ----------------------------------------------------------------- |
| `-physicalTurn` (`pt`) `[<accelerationDegrees> <brakingDegrees> \| default]`               | cheat | shows or changes the two degrees, for every hero                  |
| `-legacySlideInertia` (`lsi`) `<on\|off>`                                                  | cheat | the legacy turn                                                   |
| `-rotationSpeed` (`rs`) `<roundsPerSecond> [all\|player]` / `-normalRotationSpeed` (`nrs`) | cheat | forces the rotation speed of a hero, or gives it back to terrains |
| `-slideInertia` (`si`) `<factor> [all\|player]` / `-normalSlideInertia` (`nsi`)            | cheat | forces the inertia of a hero, or gives it back to terrains        |
| `-setTerrainRotationSpeed` (`settrs`) `<slideTerrainLabel> <rotationSpeed\|default>`       | make  | rotation speed of a slide terrain                                 |
| `-setTerrainSlideInertia` (`settsi`) `<slideTerrainLabel> <inertia\|default>`              | make  | inertia of a slide terrain                                        |
| `-debugSlideInertia` (`debsi`) `<boolean>`                                                 | all   | the debug rays                                                    |
| `-measureTurn`                                                                             | admin | measures `SetUnitFacing` (temporary)                              |
