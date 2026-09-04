import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers } from '../../../globals'
import { Constants } from '../01_libraries/Constants'
import { TurnOnSlide } from '../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import { getAsyncMousePosition } from './async/AsyncMouse'
import { screen2World } from './async/Screen2World'
import { getLocalMousePosition } from './hero-effect-common'

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

const state = {
    timer: undefined as Timer | undefined,
    escaperId: -1,
}

/** The cursor of the local player: the asynchronous position first, the synchronized one as a fallback */
const getCursorWorldPosition = () => {
    const asyncMouse = getAsyncMousePosition()
    const asyncWorld = asyncMouse && screen2World(asyncMouse.x, asyncMouse.y)

    return asyncWorld ?? getLocalMousePosition()
}

export const startAutoTurn = (escaperId: number) => {
    stopAutoTurn()

    state.escaperId = escaperId
    state.timer = createTimer(AUTO_TURN_PERIOD, true, () => {
        const escaper = getUdgEscapers().get(state.escaperId)
        const hero = escaper?.getHero()

        // only while sliding: on normal ground the hero is ordered around, not steered
        if (!escaper || !hero || !escaper.isSliding()) {
            return
        }

        const target = getCursorWorldPosition()

        if (!target) {
            return
        }

        const angle = Atan2(target.y - GetUnitY(hero), target.x - GetUnitX(hero)) * bj_RADTODEG

        // not SetUnitFacing, which turns progressively, and not BlzSetUnitFacingEx either: this
        // is what the map itself uses, and it honours what the terrain allows (canTurn,
        // canTurnAngle, drunk mode, secondary heroes)
        TurnOnSlide.turnSliderToDirection(escaper, angle)
    })
}

export const stopAutoTurn = () => {
    state.timer?.destroy()
    state.timer = undefined
}
