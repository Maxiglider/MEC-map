import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { globals } from '../../../globals'
import { SyncSaveLoad } from '../../Utils/SaveLoad/TreeLib/SyncSaveLoad'
import { Constants } from '../01_libraries/Constants'
import { Text } from '../01_libraries/Text'
import type { Escaper } from '../04_STRUCTURES/Escaper/Escaper'

/**
 * How the native SetUnitFacing turns a hero, measured in the game, for the turn of the slide to be made to
 * turn the same way: the engine does not tell how it turns a unit, so its facing is read while it does.
 *
 * The hero is turned by itself through a list of scenarios, and every change of its facing is written, with
 * the game time since the scenario started, to Documents/Warcraft III/CustomMapData/MEC/turn_measure.txt:
 *  - single: facing set at once to START_FACING, then SetUnitFacing called once towards that plus degrees,
 *    until the facing stops changing,
 *  - hold: SetUnitFacing called again every slide period towards the current facing plus degrees, as a
 *    cursor kept at that offset does, for HOLD_DURATION,
 *  - each at the turn rate of the hero times turnRateFactor, standing still or moved forward by SetUnitX/Y
 *    at the slide speed, as the slide moves a hero.
 *
 * Turned on by a command, hence on every machine at once: it moves and turns a unit every machine has.
 * Everything it changes on the hero is given back at the end: position, facing, turn rate, pause, and the
 * terrain check, turned off meanwhile so that no terrain starts a slide under a hero moved forward.
 */
const FILE_NAME = 'MEC/turn_measure.txt'

/** How often the facing is read: well below a game tick, so that no change of the facing is missed */
const SAMPLE_PERIOD = 0.001

/** How long the hero is left alone at START_FACING before each scenario */
const SETTLE_TIME = 0.4

/** A single turn is over once the facing has not changed for that long, and after SINGLE_MAX_DURATION anyway */
const STABLE_TIME = 0.25
const SINGLE_MAX_DURATION = 2.5

const HOLD_DURATION = 1.5

const START_FACING = 0

type Scenario = { kind: 'single' | 'hold'; degrees: number; turnRateFactor: number; isMoving: boolean }

const SCENARIOS: Scenario[] = []

const addScenario = (kind: Scenario['kind'], degrees: number, turnRateFactor = 1, isMoving = false) => {
    SCENARIOS[SCENARIOS.length] = { kind, degrees, turnRateFactor, isMoving }
}

for (const degrees of [5, 10, 20, 45, 90, 179]) {
    addScenario('single', degrees)
}

// the other way round, to check that it turns alike
addScenario('single', -45)

for (const degrees of [5, 10, 20, 30, 45, 90]) {
    addScenario('hold', degrees)
}

// how the turn rate of the unit enters
for (const turnRateFactor of [0.5, 2]) {
    addScenario('single', 45, turnRateFactor)
    addScenario('single', 179, turnRateFactor)
    addScenario('hold', 45, turnRateFactor)
}

// whether a unit moved the way the slide moves it turns any differently
addScenario('single', 45, 1, true)
addScenario('single', 179, 1, true)
addScenario('hold', 45, 1, true)

const state = {
    timer: undefined as Timer | undefined,
    clock: undefined as Timer | undefined,
    escaper: undefined as Escaper | undefined,
    index: 0,
    phase: 'settle' as 'settle' | 'run',
    phaseStart: 0,
    lastFacing: 0,
    lastChangeTime: 0,
    lastCallTime: 0,
    lastMoveTime: 0,
    lines: [] as string[],
    original: { x: 0, y: 0, facing: 0, turnRate: 0, isPaused: false, checksTerrain: true },
}

const now = () => state.clock?.elapsed ?? 0

const startSettle = (hero: unit, time: number) => {
    const scenario = SCENARIOS[state.index]
    const turnRate = state.original.turnRate * scenario.turnRateFactor

    BlzSetUnitRealField(hero, UNIT_RF_TURN_RATE, turnRate)
    IssueImmediateOrder(hero, 'stop')
    SetUnitX(hero, state.original.x)
    SetUnitY(hero, state.original.y)
    BlzSetUnitFacingEx(hero, START_FACING)

    state.phase = 'settle'
    state.phaseStart = time

    state.lines[state.lines.length] = string.format(
        '[scenario %d] kind=%s degrees=%d turnRate=%.4f moving=%d',
        state.index + 1,
        scenario.kind,
        scenario.degrees,
        turnRate,
        scenario.isMoving ? 1 : 0
    )
}

const startRun = (hero: unit, scenario: Scenario, time: number) => {
    const facing = GetUnitFacing(hero)

    state.phase = 'run'
    state.phaseStart = time
    state.lastMoveTime = time
    state.lastCallTime = time
    state.lastFacing = facing
    state.lastChangeTime = time

    state.lines[state.lines.length] = string.format('0.0000 %.4f start', facing)

    SetUnitFacing(hero, facing + scenario.degrees)

    if (scenario.kind === 'single') {
        state.lines[state.lines.length] = string.format('target %.4f', facing + scenario.degrees)
    }
}

const finish = (reason?: string) => {
    state.timer?.destroy()
    state.timer = undefined
    state.clock?.destroy()
    state.clock = undefined

    const escaper = state.escaper
    const hero = escaper?.getHero()

    if (escaper && hero) {
        BlzSetUnitRealField(hero, UNIT_RF_TURN_RATE, state.original.turnRate)
        IssueImmediateOrder(hero, 'stop')
        SetUnitX(hero, state.original.x)
        SetUnitY(hero, state.original.y)
        BlzSetUnitFacingEx(hero, state.original.facing)
        PauseUnit(hero, state.original.isPaused)
    }

    escaper?.enableCheckTerrain(state.original.checksTerrain)

    state.lines[state.lines.length] = reason ? '# stopped: ' + reason : '# done'

    SyncSaveLoad().writeFileWithoutPossibleLoading(FILE_NAME, state.lines.join('\n'), false)

    if (escaper) {
        if (reason) {
            Text.erP(escaper.getPlayer(), 'Turn measure stopped: ' + reason)
        } else {
            Text.mkP(escaper.getPlayer(), 'Turn measure done: CustomMapData/' + FILE_NAME)
        }
    }

    state.escaper = undefined
}

const tick = () => {
    const escaper = state.escaper
    const hero = escaper?.getHero()

    if (!escaper || !hero || !escaper.isAlive()) {
        finish('the hero died or is gone')
        return
    }

    const time = now()
    const scenario = SCENARIOS[state.index]

    if (state.phase === 'settle') {
        if (time - state.phaseStart >= SETTLE_TIME) {
            startRun(hero, scenario, time)
        }

        return
    }

    const elapsed = time - state.phaseStart

    if (scenario.isMoving) {
        const step = Constants.HERO_SLIDE_SPEED * (time - state.lastMoveTime)
        const angle = Deg2Rad(GetUnitFacing(hero))
        const x = GetUnitX(hero) + step * Cos(angle)
        const y = GetUnitY(hero) + step * Sin(angle)

        if (x >= globals.MAP_MIN_X && x <= globals.MAP_MAX_X && y >= globals.MAP_MIN_Y && y <= globals.MAP_MAX_Y) {
            SetUnitX(hero, x)
            SetUnitY(hero, y)
        }

        state.lastMoveTime = time
    }

    if (scenario.kind === 'hold' && time - state.lastCallTime >= Constants.SLIDE_PERIOD) {
        SetUnitFacing(hero, GetUnitFacing(hero) + scenario.degrees)
        state.lastCallTime = time
    }

    const facing = GetUnitFacing(hero)

    if (facing !== state.lastFacing) {
        state.lines[state.lines.length] = string.format('%.4f %.4f', elapsed, facing)
        state.lastFacing = facing
        state.lastChangeTime = time
    }

    const isOver =
        scenario.kind === 'hold'
            ? elapsed >= HOLD_DURATION
            : elapsed >= SINGLE_MAX_DURATION || (elapsed >= STABLE_TIME && time - state.lastChangeTime >= STABLE_TIME)

    if (!isOver) {
        return
    }

    state.index++

    if (state.index >= SCENARIOS.length) {
        finish()
        return
    }

    startSettle(hero, time)
}

/** Starts the measure with the hero of that escaper, or tells why it cannot: the same answer on every machine */
export const startTurnMeasure = (escaper: Escaper): string | undefined => {
    if (state.timer) {
        return 'a turn measure is already running'
    }

    const hero = escaper.getHero()

    if (!hero || !escaper.isAlive()) {
        return 'your hero has to be alive'
    }

    if (escaper.isSliding()) {
        return 'your hero has to stand on walkable ground, not slide'
    }

    state.escaper = escaper
    state.index = 0
    state.lines = []
    state.original.x = GetUnitX(hero)
    state.original.y = GetUnitY(hero)
    state.original.facing = GetUnitFacing(hero)
    state.original.turnRate = BlzGetUnitRealField(hero, UNIT_RF_TURN_RATE)
    state.original.isPaused = IsUnitPaused(hero)
    state.original.checksTerrain = escaper.doesCheckTerrain()

    escaper.enableCheckTerrain(false)
    PauseUnit(hero, false)

    state.lines[state.lines.length] = string.format(
        '# turn measure: unit type %d, turn rate %.4f, slide period %.4f, sample period %.4f, %d scenarios',
        GetUnitTypeId(hero),
        state.original.turnRate,
        Constants.SLIDE_PERIOD,
        SAMPLE_PERIOD,
        SCENARIOS.length
    )
    state.lines[state.lines.length] = '# lines: <seconds since the scenario started> <facing in degrees>'

    state.clock = createTimer(3600, false, () => {})
    state.timer = createTimer(SAMPLE_PERIOD, true, tick)

    startSettle(hero, now())

    return undefined
}
