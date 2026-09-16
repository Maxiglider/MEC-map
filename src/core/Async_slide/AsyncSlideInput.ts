import { createTimer } from 'Utils/mapUtils'
import { getAsyncMousePosition } from './AsyncMouse'
import { getLocalMousePosition, isTestingLeftClicks, setHeroEffectPosition, setLastLocalClickTime } from './HeroEffect'
import { initScreen2World, screen2World } from './Screen2World'

/**
 * Clicking moves this effect instantly, on the screen of the clicking player only, for "-testLeftClicks":
 * fully asynchronous, as every input event of WC3 is turn gated.
 *
 *  - the left button is read by BlzIsMouseButtonPressed, a native of Warcraft III 3.0 answering at once
 *    on this machine, polled while the player of this machine runs the test,
 *  - the cursor position comes from AsyncMouse, in screen coordinates,
 *  - which Screen2World turns into a world point, through the local camera.
 *
 * Everything read here is local, so each player moves their own copy of the effect and nothing may feed
 * synced logic. No frame is made: 3.0 made frames agents, and the buttons that caught the clicks before
 * came in a number depending on the width of the screen.
 */
const POLL_INTERVAL = 0.005

/** The click line itself, in teal, to tell it apart from its synchronized counterpart at a glance */
const TEAL = '|cff1ce6b9'

const onPressDetected = () => {
    const mouse = getAsyncMousePosition()
    const world = screen2World(mouse.x, mouse.y)

    if (!world) {
        return
    }

    const clickTime = os.clock()
    setLastLocalClickTime(clickTime)

    // the synchronized position is the true one, so the gap is what the screen to world conversion costs
    const syncedMouse = getLocalMousePosition()
    const errorX = syncedMouse && math.floor(world.x - syncedMouse.x)
    const errorY = syncedMouse && math.floor(world.y - syncedMouse.y)

    print(
        TEAL +
            `LOCAL left click at ${math.floor(world.x)}, ${math.floor(world.y)} ` +
            `(t = ${math.floor(clickTime * 1000)} ms, ecart ${errorX}, ${errorY})|r`
    )

    setHeroEffectPosition(world.x, world.y)
}

/**
 * The timers are made at the initialization, on every machine alike, and never destroyed: only what
 * they read differs from one machine to another.
 */
export const initAsyncSlideInput = () => {
    initScreen2World()

    let wasPressed = false

    createTimer(POLL_INTERVAL, true, () => {
        // only whoever asked for the test has any use of a locally read click
        if (!isTestingLeftClicks(GetPlayerId(GetLocalPlayer()!))) {
            wasPressed = false
            return
        }

        const isPressed = BlzIsMouseButtonPressed(MOUSE_BUTTON_TYPE_LEFT)

        // the press is what counts, not the button held down nor its release
        if (isPressed && !wasPressed) {
            onPressDetected()
        }

        wasPressed = isPressed
    })
}
