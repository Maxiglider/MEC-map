import { Constants } from 'core/01_libraries/Constants'
import type { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { globals } from '../../../../globals'

/**
 * The slide speed control: a hero sliding async speeds up while its player holds the right click, and slows down
 * while they hold the left one, within bounds and at rates the game constants give as ratios of the base slide
 * speed - the one of the slide terrain under the hero, or the one -setSlideSpeed gave it.
 *
 * Async only, on purpose: the buttons are read by BlzIsMouseButtonPressed on the machine of the player, at once,
 * and the speed they give travels to the others in the movement packets like any speed of an async hero. The
 * synchronized mouse events a sync hero would need cost too much of the network and raise the ping of everybody.
 */

/** How long a button has to be held before it acts, so that a click turning the hero does not also speed it up */
export const SLIDE_SPEED_CONTROL_HOLD_TIME = 0.2

/** What the player is doing with the slide speed, which the effect of the hero shows */
export const SLIDE_SPEED_CONTROL = { braking: -1, none: 0, accelerating: 1 }

/** How long each button of the player of this machine has been held while sliding, in seconds */
const held = { right: 0, left: 0 }

/**
 * Whether the speed of that hero answers the buttons: the control is on, the hero slides as an effect, no static
 * slide carries it, and no speed was forced on it but the one of -setSlideSpeed, which counts as a base speed.
 */
export const isSlideSpeedControlled = (escaper: Escaper) =>
    globals.slideSpeedControl &&
    escaper.isHeroAsEffect() &&
    !escaper.isStaticSliding() &&
    escaper.isSlideSpeedModulable()

/**
 * A speed within the bounds the base speed gives, keeping the sign of that base: a reverse slide is bounded by the
 * value of its speed, and going faster on it is going faster backwards.
 */
export const clampSlideSpeedToControlBounds = (speed: number, baseSpeed: number) => {
    const baseValue = RAbsBJ(baseSpeed)
    const value = RMinBJ(
        RMaxBJ(RAbsBJ(speed), baseValue * globals.slideSpeedControlMin),
        baseValue * globals.slideSpeedControlMax
    )

    return baseSpeed < 0 ? -value : value
}

/**
 * Run at every slide period for the hero of this machine's player only, while it slides as an effect. It changes
 * nothing but that hero's own speed and the animation of its effect, which this machine alone decides while the
 * hero is async: no handle is made, and the speed reaches the others through the packets.
 */
export const updateLocalSlideSpeedControl = (escaper: Escaper) => {
    if (!isSlideSpeedControlled(escaper)) {
        held.right = 0
        held.left = 0
        escaper.setSlideSpeedControlState(SLIDE_SPEED_CONTROL.none, 1)

        return
    }

    held.right = BlzIsMouseButtonPressed(MOUSE_BUTTON_TYPE_RIGHT) ? held.right + Constants.SLIDE_PERIOD : 0
    held.left = BlzIsMouseButtonPressed(MOUSE_BUTTON_TYPE_LEFT) ? held.left + Constants.SLIDE_PERIOD : 0

    const isAccelerating = held.right >= SLIDE_SPEED_CONTROL_HOLD_TIME
    const isBraking = held.left >= SLIDE_SPEED_CONTROL_HOLD_TIME

    // both held: neither wins
    const state =
        isAccelerating && !isBraking
            ? SLIDE_SPEED_CONTROL.accelerating
            : isBraking && !isAccelerating
              ? SLIDE_SPEED_CONTROL.braking
              : SLIDE_SPEED_CONTROL.none

    const baseSpeed = escaper.getSlideSpeedBase()
    const baseValue = RAbsBJ(baseSpeed)

    if (state !== SLIDE_SPEED_CONTROL.none && baseValue > 0) {
        const rate =
            state === SLIDE_SPEED_CONTROL.accelerating
                ? globals.slideSpeedControlAcceleration
                : -globals.slideSpeedControlBraking
        const value = RAbsBJ(escaper.getSlideSpeed()) + rate * baseValue * Constants.SLIDE_PERIOD

        escaper.setSlideSpeed(clampSlideSpeedToControlBounds(baseSpeed < 0 ? -value : value, baseSpeed))
    }

    escaper.setSlideSpeedControlState(state, baseValue > 0 ? RAbsBJ(escaper.getSlideSpeed()) / baseValue : 1)
}
