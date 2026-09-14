import { createEvent, createTimer } from 'Utils/mapUtils'
import { pathingBlockerUtils } from 'Utils/PathingBlockerUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers, getUdgLevels, getUdgTerrainTypes, globals } from '../../../globals'
import { AnglesDiff } from '../01_libraries/Basic_functions'
import { Constants } from '../01_libraries/Constants'
import type { Escaper } from '../04_STRUCTURES/Escaper/Escaper'
import type { Level } from '../04_STRUCTURES/Level/Level'
import type { TerrainType } from '../04_STRUCTURES/TerrainType/TerrainType'
import { TerrainTypeSlide } from '../04_STRUCTURES/TerrainType/TerrainTypeSlide'
import { computeSlideTurnForOnePeriod, slideTurn } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/SlidingMax'
import { Natives } from '../wc3_natives_unsecured/Natives'
import { clearVirtualCursor, setAutoTurnMode, setVirtualCursor } from './AutoTurn'

/**
 * The computer plays the hero of a player towards the end of each level, as that player would with the
 * mouse, sliding async (first version: death terrains avoided, monsters not).
 *
 * Only the machine of that player decides, as only it knows where the effect of its hero really is:
 *  - while the hero slides as an effect, it points a virtual cursor (see AutoTurn.setVirtualCursor), which
 *    the auto turn follows exactly as it follows the real cursor, and the movement packets carry the
 *    result to every machine as usual,
 *  - while the hero walks, it tells every machine where to right click (MOVE_PREFIX), and every machine
 *    orders the hero there on the same turn: an order given on one machine alone desyncs the game.
 *
 * Everything else runs on that machine alone, and follows the rules of code of one machine: no agent made
 * or destroyed (the effects, the location and the timer are made and destroyed by the command, which every
 * machine hears), no random draw, no table from the pool of MemoryHandler, nothing written that the game
 * reads. Reading the game is fine.
 *
 * Where to go comes from a map of distances, in terrain tiles, from every walkable or slide tile to the end
 * of the current level (see buildField). While sliding, a few headings are tried ahead with the very turn and
 * movement of the slide, and the one ending nearest to the end without dying is kept.
 */
const CELL = Constants.LARGEUR_CASE
const PERIOD = Constants.SLIDE_PERIOD

const PLAN_PERIOD = 0.1

/** How far ahead a heading is tried, and in how many slide periods at once */
const HORIZON = 1.2
const PERIODS_PER_STEP = 4
const HEADING_COUNT = 16

/** The virtual cursor stands that far along the heading: far enough for its angle not to shift as the hero moves */
const STEERING_DISTANCE = 1000
const CURSOR_DISPLAY_DISTANCE = 300

/** How many tiles ahead a walk order aims, along the map of distances */
const WALK_LOOKAHEAD_CELLS = 4
/** A walk order is given again after that many plans even when it aims at the same point */
const WALK_ORDER_REPEAT_PLANS = 10

/** A change of heading shown as a right click */
const CLICK_ANGLE = 20
const CLICK_SHOWN_PLANS = 5

const DEAD_SCORE = 1000000000
const UNREACHABLE_SCORE = 1000000
/** Prefers the heading already taken, all else being equal: steadier, and less of a click show */
const HEADING_CHANGE_COST = 0.01

const PARKED_Z = -1000
const MOVE_PREFIX = 'MEC_APM'
const CURSOR_MODEL = 'UI\\Feedback\\RallyPoint\\RallyPoint.mdl'
const CLICK_MODEL = 'UI\\Feedback\\Confirmation\\Confirmation.mdl'

const NEIGHBOR_DX = [1, -1, 0, 0, 1, 1, -1, -1]
const NEIGHBOR_DY = [0, 0, 1, -1, 1, -1, 1, -1]

type Pilot = { timer: Timer; cursorEffect?: effect; clickEffect?: effect; zLocation: location }

/** Made and destroyed by the command, on every machine alike */
const pilots: { [escaperId: number]: Pilot | undefined } = {}
let moveTrigger: trigger | undefined

type Field = {
    levelId: number
    minCx: number
    minCy: number
    width: number
    height: number
    terrains: (TerrainType | false)[]
    /** Tiles from the end of the level, -1 for a tile that does not lead there */
    distances: number[]
}

/** What the machine of the pilot keeps between two plans: filled on that machine only */
const local = {
    field: undefined as Field | undefined,
    heading: undefined as number | undefined,
    orderX: 0,
    orderY: 0,
    plansSinceOrder: 0,
    clickPlansLeft: 0,
}

const resetLocalState = () => {
    local.field = undefined
    local.heading = undefined
    local.orderX = 0
    local.orderY = 0
    local.plansSinceOrder = 0
    local.clickPlansLeft = 0
}

/** Terrain tiles are centered on multiples of CELL */
const cellOf = (coordinate: number) => Math.floor(coordinate / CELL + 0.5)

const indexOf = (field: Field, cx: number, cy: number) => {
    const column = cx - field.minCx
    const row = cy - field.minCy

    if (column < 0 || row < 0 || column >= field.width || row >= field.height) {
        return -1
    }

    return row * field.width + column
}

const terrainAt = (field: Field, x: number, y: number) => {
    const index = indexOf(field, cellOf(x), cellOf(y))

    return index === -1 ? undefined : field.terrains[index] || undefined
}

const distanceAt = (field: Field, x: number, y: number) => {
    const index = indexOf(field, cellOf(x), cellOf(y))

    return index === -1 ? -1 : field.distances[index]
}

/** A tile a unit cannot cross: the four quarters of it hold a pathing blocker */
const isCellBlocked = (x: number, y: number) =>
    !!pathingBlockerUtils.isBlocked(x - 32, y - 32) &&
    !!pathingBlockerUtils.isBlocked(x + 32, y - 32) &&
    !!pathingBlockerUtils.isBlocked(x - 32, y + 32) &&
    !!pathingBlockerUtils.isBlocked(x + 32, y + 32)

/**
 * The distance in tiles from every walkable or slide tile to the end of the level, by a breadth first search
 * from the tiles of its end region, never cutting the corner of a tile that does not lead anywhere. Also
 * keeps the terrain of every tile, read once, for the slide to be tried ahead without asking the game again.
 */
const buildField = (level: Level): Field | undefined => {
    const end = level.getEnd()

    if (!end) {
        return undefined
    }

    const minCx = Math.ceil(globals.MAP_MIN_X / CELL)
    const minCy = Math.ceil(globals.MAP_MIN_Y / CELL)
    const width = Math.floor(globals.MAP_MAX_X / CELL) - minCx + 1
    const height = Math.floor(globals.MAP_MAX_Y / CELL) - minCy + 1

    const field: Field = { levelId: level.id, minCx, minCy, width, height, terrains: [], distances: [] }
    const isPassable: boolean[] = []
    const terrainTypes = getUdgTerrainTypes()

    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            const index = row * width + column
            const x = (minCx + column) * CELL
            const y = (minCy + row) * CELL
            const terrainType = terrainTypes.getTerrainType(x, y)
            const kind = terrainType?.getKind()
            const isBlocked = (kind === 'walk' || !globals.canSlideOverPathingBlockers) && isCellBlocked(x, y)

            field.terrains[index] = terrainType ?? false
            field.distances[index] = -1
            isPassable[index] = (kind === 'walk' || kind === 'slide') && !isBlocked
        }
    }

    const queue: number[] = []

    for (let cy = cellOf(end.minY); cy <= cellOf(end.maxY); cy++) {
        for (let cx = cellOf(end.minX); cx <= cellOf(end.maxX); cx++) {
            const index = indexOf(field, cx, cy)

            if (index !== -1 && isPassable[index]) {
                field.distances[index] = 0
                queue[queue.length] = index
            }
        }
    }

    for (let head = 0; head < queue.length; head++) {
        const index = queue[head]
        const cx = field.minCx + (index % width)
        const cy = field.minCy + Math.floor(index / width)

        for (let n = 0; n < NEIGHBOR_DX.length; n++) {
            const dx = NEIGHBOR_DX[n]
            const dy = NEIGHBOR_DY[n]
            const neighbor = indexOf(field, cx + dx, cy + dy)

            if (neighbor === -1 || !isPassable[neighbor] || field.distances[neighbor] !== -1) {
                continue
            }

            if (dx !== 0 && dy !== 0) {
                const alongX = indexOf(field, cx + dx, cy)
                const alongY = indexOf(field, cx, cy + dy)

                if (alongX === -1 || alongY === -1 || !isPassable[alongX] || !isPassable[alongY]) {
                    continue
                }
            }

            field.distances[neighbor] = field.distances[index] + 1
            queue[queue.length] = neighbor
        }
    }

    return field
}

/**
 * Where the hero ends after HORIZON aiming at that heading, the way the slide turns and moves it, as a score:
 * the distance to the end there, lower being better, far above that if it dies on the way, and sooner worse.
 */
const tryHeading = (escaper: Escaper, field: Field, heading: number) => {
    let x = escaper.getHeroX()
    let y = escaper.getHeroY()
    let facing = escaper.getHeroFacing()
    let turnPerPeriod = escaper.getSlideCurrentTurnPerPeriod()
    let slideSpeed = escaper.getSlideSpeed()
    let maxTurnPerPeriod = escaper.getMaxSlideTurnPerPeriod()
    let slideInertia = escaper.getSlideInertia()
    let terrainType = escaper.getLastTerrainType()

    const steps = Math.floor(HORIZON / (PERIOD * PERIODS_PER_STEP))

    for (let step = 0; step < steps; step++) {
        for (let period = 0; period < PERIODS_PER_STEP; period++) {
            // moved along the facing it had before the turn of this period, as the slide moves it
            const angle = Deg2Rad(facing)

            if (
                maxTurnPerPeriod !== 0 &&
                computeSlideTurnForOnePeriod(
                    AnglesDiff(heading, facing),
                    maxTurnPerPeriod,
                    turnPerPeriod,
                    escaper.rotationTimeForMaximumSpeed,
                    slideInertia
                )
            ) {
                turnPerPeriod = slideTurn.turnPerPeriod
                facing = facing + slideTurn.diffToApply
            }

            x = x + slideSpeed * PERIOD * Cos(angle)
            y = y + slideSpeed * PERIOD * Sin(angle)
        }

        const reached = terrainAt(field, x, y)
        const kind = reached?.getKind()

        if (!reached || kind === 'death') {
            return DEAD_SCORE + (steps - step)
        }

        if (kind === 'walk') {
            const distance = distanceAt(field, x, y)

            return distance === -1 ? UNREACHABLE_SCORE : distance
        }

        // a slide terrain of its own gives its speeds, as it gives them to the hero
        if (reached !== terrainType && reached instanceof TerrainTypeSlide) {
            if (!escaper.isAbsoluteSlideSpeed()) {
                const newSlideSpeed = (escaper.getSlideMirror() ? -1 : 1) * reached.getSlideSpeed()

                // a reverse slide turns the hero half a turn
                if (newSlideSpeed < 0 !== slideSpeed < 0) {
                    facing = facing + 180
                }

                slideSpeed = newSlideSpeed
            }

            if (!escaper.isAbsoluteRotationSpeed()) {
                maxTurnPerPeriod = reached.getRotationSpeed() * PERIOD * 360
            }

            if (!escaper.isAbsoluteSlideInertia()) {
                slideInertia = reached.getSlideInertia()
            }

            terrainType = reached
        }
    }

    const distance = distanceAt(field, x, y)

    return distance === -1 ? UNREACHABLE_SCORE : distance
}

const showCursor = (pilot: Pilot, x: number, y: number) => {
    if (!pilot.cursorEffect) {
        return
    }

    MoveLocation(pilot.zLocation, x, y)
    BlzSetSpecialEffectPosition(pilot.cursorEffect, x, y, GetLocationZ(pilot.zLocation))
}

/** Plays the click effect there, as a right click shows */
const showClick = (pilot: Pilot, x: number, y: number) => {
    if (!pilot.clickEffect) {
        return
    }

    MoveLocation(pilot.zLocation, x, y)
    BlzSetSpecialEffectPosition(pilot.clickEffect, x, y, GetLocationZ(pilot.zLocation))
    BlzPlaySpecialEffect(pilot.clickEffect, ANIM_TYPE_BIRTH)
    BlzSetSpecialEffectTime(pilot.clickEffect, 0)
    BlzSetSpecialEffectTimeScale(pilot.clickEffect, 1)
    local.clickPlansLeft = CLICK_SHOWN_PLANS
}

const planSlide = (escaper: Escaper, pilot: Pilot, field: Field) => {
    const currentHeading = local.heading ?? escaper.getHeroFacing()
    let bestHeading = currentHeading
    let bestScore = tryHeading(escaper, field, currentHeading)

    for (let i = 0; i < HEADING_COUNT; i++) {
        const heading = (i * 360) / HEADING_COUNT
        const score =
            tryHeading(escaper, field, heading) + RAbsBJ(AnglesDiff(heading, currentHeading)) * HEADING_CHANGE_COST

        if (score < bestScore) {
            bestScore = score
            bestHeading = heading
        }
    }

    const x = escaper.getHeroX()
    const y = escaper.getHeroY()
    const radians = Deg2Rad(bestHeading)

    setVirtualCursor(escaper.getId(), x + STEERING_DISTANCE * Cos(radians), y + STEERING_DISTANCE * Sin(radians))

    const shownX = x + CURSOR_DISPLAY_DISTANCE * Cos(radians)
    const shownY = y + CURSOR_DISPLAY_DISTANCE * Sin(radians)

    showCursor(pilot, shownX, shownY)

    if (local.heading === undefined || RAbsBJ(AnglesDiff(bestHeading, local.heading)) >= CLICK_ANGLE) {
        showClick(pilot, shownX, shownY)
    }

    local.heading = bestHeading
}

/** Whether a unit walking straight there crosses no death terrain, nor a tile leading nowhere */
const isWalkLineClear = (field: Field, fromX: number, fromY: number, toX: number, toY: number) => {
    const dx = toX - fromX
    const dy = toY - fromY
    const samples = Math.max(1, Math.ceil(SquareRoot(dx * dx + dy * dy) / 32))

    for (let sample = 1; sample <= samples; sample++) {
        const x = fromX + (dx * sample) / samples
        const y = fromY + (dy * sample) / samples

        if (distanceAt(field, x, y) === -1) {
            return false
        }
    }

    return true
}

const planWalk = (escaper: Escaper, pilot: Pilot, field: Field) => {
    const heroX = escaper.getHeroX()
    const heroY = escaper.getHeroY()
    const heroCx = cellOf(heroX)
    const heroCy = cellOf(heroY)
    let cx = heroCx
    let cy = heroCy
    let index = indexOf(field, cx, cy)

    // standing on a tile leading nowhere, or at the end already
    if (index === -1 || field.distances[index] <= 0) {
        return
    }

    let distance = field.distances[index]

    for (let step = 0; step < WALK_LOOKAHEAD_CELLS; step++) {
        let nextCx = cx
        let nextCy = cy
        let nextDistance = distance

        for (let n = 0; n < NEIGHBOR_DX.length; n++) {
            const neighbor = indexOf(field, cx + NEIGHBOR_DX[n], cy + NEIGHBOR_DY[n])

            if (neighbor !== -1 && field.distances[neighbor] !== -1 && field.distances[neighbor] < nextDistance) {
                nextCx = cx + NEIGHBOR_DX[n]
                nextCy = cy + NEIGHBOR_DY[n]
                nextDistance = field.distances[neighbor]
            }
        }

        if (nextDistance === distance || !isWalkLineClear(field, heroX, heroY, nextCx * CELL, nextCy * CELL)) {
            break
        }

        cx = nextCx
        cy = nextCy
        distance = nextDistance
    }

    if (cx === heroCx && cy === heroCy) {
        return
    }

    const x = cx * CELL
    const y = cy * CELL

    showCursor(pilot, x, y)

    local.plansSinceOrder++

    if (x === local.orderX && y === local.orderY && local.plansSinceOrder < WALK_ORDER_REPEAT_PLANS) {
        return
    }

    local.orderX = x
    local.orderY = y
    local.plansSinceOrder = 0

    // every machine orders it, on the same turn (see onMovePacket)
    BlzSendSyncData(MOVE_PREFIX, string.format('%d|%d', x, y))
    showClick(pilot, x, y)
}

const plan = (escaperId: number) => {
    const pilot = pilots[escaperId]
    const escaper = getUdgEscapers().get(escaperId)

    if (!pilot || !escaper || GetLocalPlayer() !== escaper.getPlayer()) {
        return
    }

    if (local.clickPlansLeft > 0) {
        local.clickPlansLeft--

        if (local.clickPlansLeft === 0 && pilot.clickEffect) {
            BlzSetSpecialEffectZ(pilot.clickEffect, PARKED_Z)
        }
    }

    if (!escaper.getHero() || !escaper.isAlive()) {
        return
    }

    const level = getUdgLevels().getCurrentLevel(escaper)

    if (!local.field || local.field.levelId !== level.id) {
        local.field = buildField(level)
        local.heading = undefined
    }

    if (!local.field) {
        return
    }

    if (escaper.isHeroAsEffect()) {
        planSlide(escaper, pilot, local.field)
    } else if (!escaper.isSliding()) {
        planWalk(escaper, pilot, local.field)
    }
}

/** The right click the machine of a pilot tells every machine about, applied on the same turn by all of them */
const onMovePacket = () => {
    const escaperId = GetPlayerId(Natives.UGetTriggerPlayer())
    const escaper = getUdgEscapers().get(escaperId)
    const hero = escaper?.getHero()

    if (!escaper || !hero || !pilots[escaperId] || !escaper.isAlive() || escaper.isSliding()) {
        return
    }

    const fields: number[] = []

    for (const [field] of string.gmatch(Natives.UBlzGetTriggerSyncData(), '[^|]+')) {
        fields[fields.length] = tonumber(field) ?? 0
    }

    if (fields.length < 2) {
        return
    }

    IssuePointOrder(hero, 'move', fields[0], fields[1])
}

export const isAutopilotEnabled = (escaperId: number) => pilots[escaperId] !== undefined

/**
 * Turns the autopilot of that hero on or off. Called by the command, on every machine at once: it makes and
 * destroys the effects, the location and the timer of the pilot, and switches the hero to the async slide.
 */
export const setAutopilotEnabled = (escaper: Escaper, isEnabled: boolean) => {
    const escaperId = escaper.getId()
    const pilot = pilots[escaperId]

    if (isEnabled === (pilot !== undefined)) {
        return false
    }

    if (pilot) {
        pilot.timer.destroy()
        pilot.cursorEffect && DestroyEffect(pilot.cursorEffect)
        pilot.clickEffect && DestroyEffect(pilot.clickEffect)
        RemoveLocation(pilot.zLocation)
        delete pilots[escaperId]

        clearVirtualCursor(escaperId)

        if (GetLocalPlayer() === escaper.getPlayer()) {
            resetLocalState()
        }

        return true
    }

    if (!moveTrigger) {
        moveTrigger = createEvent({
            events: [
                t => {
                    for (let i = 0; i < Constants.NB_PLAYERS_MAX; i++) {
                        BlzTriggerRegisterPlayerSyncEvent(t, Natives.UPlayer(i), MOVE_PREFIX, false)
                    }
                },
            ],
            actions: [onMovePacket],
        })
    }

    // the virtual cursor steers the async slide, and turning it on starts the steering
    setAutoTurnMode(escaperId, 'async')

    const cursorEffect = AddSpecialEffect(CURSOR_MODEL, 0, 0)
    cursorEffect && BlzSetSpecialEffectZ(cursorEffect, PARKED_Z)

    const clickEffect = AddSpecialEffect(CLICK_MODEL, 0, 0)
    clickEffect && BlzSetSpecialEffectZ(clickEffect, PARKED_Z)

    pilots[escaperId] = {
        cursorEffect,
        clickEffect,
        zLocation: Location(0, 0),
        timer: createTimer(PLAN_PERIOD, true, () => plan(escaperId)),
    }

    return true
}
