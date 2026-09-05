import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers } from '../../../globals'
import { Constants } from '../01_libraries/Constants'
import { TurnOnSlide } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import { getAsyncMousePosition, setAsyncMouseActive } from './async/AsyncMouse'
import { screen2World } from './async/Screen2World'
import { getLocalMousePosition, getMousePosition, isTestingLeftClicks } from './hero-effect-common'

/**
 * Made for the slide: on ice the hero is carried along whatever the player does, and all that is
 * controlled is where it looks. So instead of ordering it around, the mode keeps turning it
 * towards the cursor, over and over, while the right click still gives its instant smart order
 * for the parts of the map where one walks.
 *
 * Right click turns it on, left click turns it off.
 *
 * When this is on, the click catcher of "hero-effect-locally-async" is not created: the clicks
 * are read from the synchronized mouse event, the only one that hears the right button. The
 * cursor, on the other hand, still comes from the asynchronous lattice, so the hero faces where
 * the cursor is now rather than where the network says it was a latency ago. That target differs
 * from one machine to another, hence solo only, like the rest of the asynchronous path.
 */
export const AUTO_TURN_MODE = true

/**
 * The slide reads the facing of the hero every SLIDE_PERIOD to know where to carry it, so turning
 * more often than that changes nothing: no one reads it in between.
 */
const AUTO_TURN_PERIOD = Constants.SLIDE_PERIOD

/**
 * off:   nothing is steered, the game behaves as it always did,
 * sync:  the cursor comes from the synchronized mouse event, the same on every machine, and as
 *        late as the network is. No divergence between players,
 * async: the cursor comes from the asynchronous lattice: instant, but only known on the machine
 *        of the player pointing, so it differs from one machine to another.
 */
export type AutoTurnMode = 'off' | 'sync' | 'async'

export const AUTO_TURN_MODES: AutoTurnMode[] = ['off', 'sync', 'async']

const modes: { [escaperId: number]: AutoTurnMode } = {}
/** The mode says where the cursor is read, this says whether the hero is being steered right now */
const steering: { [escaperId: number]: boolean } = {}
const state = { timer: undefined as Timer | undefined }

export const getAutoTurnMode = (escaperId: number) => modes[escaperId] ?? 'off'

export const isSteering = (escaperId: number) => getAutoTurnMode(escaperId) !== 'off' && steering[escaperId] === true

/** The right click hands the steering to the mouse, the left click gives it back */
export const setAutoTurnSteering = (escaperId: number, isOn: boolean) => {
    steering[escaperId] = isOn
}

/** Where that player points, according to the mode they chose */
const getCursorWorldPosition = (escaperId: number) => {
    // the lattice only knows about the cursor of this machine, so it can only serve its own player
    if (getAutoTurnMode(escaperId) === 'async' && escaperId === GetPlayerId(GetLocalPlayer()!)) {
        const asyncMouse = getAsyncMousePosition()
        const asyncWorld = asyncMouse && screen2World(asyncMouse.x, asyncMouse.y)

        return asyncWorld ?? getLocalMousePosition()
    }

    return getMousePosition(escaperId)
}

const turnSliderTowardsCursor = (escaperId: number) => {
    const escaper = getUdgEscapers().get(escaperId)
    const hero = escaper?.getHero()

    // only while sliding: on normal ground the hero is ordered around, not steered
    if (!escaper || !hero || !escaper.isSliding()) {
        return
    }

    const target = getCursorWorldPosition(escaperId)

    if (!target) {
        return
    }

    const angle = Atan2(target.y - GetUnitY(hero), target.x - GetUnitX(hero)) * bj_RADTODEG

    // not SetUnitFacing, which turns progressively, and not BlzSetUnitFacingEx either: this is
    // what the map itself uses, and it honours what the terrain allows (canTurn, canTurnAngle,
    // drunk mode, secondary heroes)
    TurnOnSlide.turnSliderToDirection(escaper, angle)
}

/**
 * The lattice covers the cursor with frames, and those swallow the clicks they cover. But on ice
 * the hero is carried along and nobody clicks, while on walkable ground clicking is everything
 * and the cursor needs no local reading. So the lattice only runs while the hero of this machine
 * is actually sliding, which costs no click at all.
 *
 * The left click test is the exception: it is there to be clicked on, wherever the hero stands.
 */
const updateAsyncMouseNeed = () => {
    const localEscaperId = GetPlayerId(GetLocalPlayer()!)
    const isSlidingWithAsyncTurn =
        getAutoTurnMode(localEscaperId) === 'async' && getUdgEscapers().get(localEscaperId)?.isSliding() === true

    setAsyncMouseActive(isTestingLeftClicks(localEscaperId) || isSlidingWithAsyncTurn)
}

/** One timer for everybody: it is created once and never destroyed, so no handle comes and goes */
const startAutoTurnTimer = () => {
    if (state.timer) {
        return
    }

    state.timer = createTimer(AUTO_TURN_PERIOD, true, () => {
        updateAsyncMouseNeed()

        getUdgEscapers().forAll(escaper => {
            if (isSteering(escaper.getId())) {
                turnSliderTowardsCursor(escaper.getId())
            }
        })
    })
}

export const setAutoTurnMode = (escaperId: number, mode: AutoTurnMode) => {
    modes[escaperId] = mode

    // steering right away, so the mode can be tried without having to right click first
    steering[escaperId] = mode !== 'off'

    if (mode !== 'off') {
        startAutoTurnTimer()
    }
}
