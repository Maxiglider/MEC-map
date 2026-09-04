import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers } from '../../../globals'
import { Constants } from '../01_libraries/Constants'
import { TurnOnSlide } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import { getAsyncMousePosition } from './async/AsyncMouse'
import { screen2World } from './async/Screen2World'
import { getLocalMousePosition, getMousePosition } from './hero-effect-common'

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
const state = { timer: undefined as Timer | undefined }

export const getAutoTurnMode = (escaperId: number) => modes[escaperId] ?? 'off'

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

/** One timer for everybody: it is created once and never destroyed, so no handle comes and goes */
const startAutoTurnTimer = () => {
    if (state.timer) {
        return
    }

    state.timer = createTimer(AUTO_TURN_PERIOD, true, () => {
        getUdgEscapers().forAll(escaper => {
            if (getAutoTurnMode(escaper.getId()) !== 'off') {
                turnSliderTowardsCursor(escaper.getId())
            }
        })
    })
}

export const setAutoTurnMode = (escaperId: number, mode: AutoTurnMode) => {
    modes[escaperId] = mode

    if (mode !== 'off') {
        startAutoTurnTimer()
    }
}
