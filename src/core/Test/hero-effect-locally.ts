import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'
import { Natives } from '../wc3_natives_unsecured/Natives'
import { createHeroEffectSpawnTrigger, setHeroEffectPosition } from './hero-effect-common'

/**
 * Right click moves this effect on the screen of the clicking player only.
 *
 * Frame events are the only asynchronous input of WC3: FRAMEEVENT_CONTROL_CLICK fires on the
 * machine of the clicking player only, immediately, without going through the game turn queue.
 * Nothing is synchronized here, so the effect position is allowed to differ from one machine
 * to another, but it may never be read by synced logic, and no handle may ever be created
 * (or destroyed) inside a "local player" branch, otherwise the game desyncs.
 *
 * A frame event carries no coordinates, hence the mouse position tracked apart, on the
 * (synchronized) mouse move event.
 *
 * FRAMEEVENT_MOUSE_DOWN is used rather than FRAMEEVENT_CONTROL_CLICK (left click only), but no
 * native tells which button fired a frame event: if this catches left clicks too, they cannot
 * be filtered out here.
 */
const state = {
    effect: undefined as effect | undefined,
    // last position of the mouse, per machine: only the local player writes its own one
    mouseX: 0,
    mouseY: 0,
}

const DEBUG = true

const FRAME_WIDTH_4_3 = 0.8
const FRAME_HEIGHT = 0.6

/**
 * Invisible frame covering the 3D view, whose only purpose is to catch the clicks locally.
 * Parented to the game UI: frames parented to the world frame do not reliably receive input.
 *
 * The frame coordinates only span the 4:3 center of the screen (0 to 0.8), so the side bands of
 * a widescreen are computed from the client resolution, otherwise clicks there are not caught.
 * BlzGetLocalClient* is asynchronous, which is harmless here: frame geometry is local anyway.
 */
const createClickCatcherFrame = () => {
    const gameUi = Natives.UBlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
    const clickCatcher = BlzCreateFrameByType('BUTTON', 'HeroEffectLocallyClickCatcher', gameUi, '', 0)

    if (clickCatcher) {
        const screenWidth = FRAME_HEIGHT * (BlzGetLocalClientWidth() / BlzGetLocalClientHeight())
        const sideBandWidth = (screenWidth - FRAME_WIDTH_4_3) / 2

        // above the bottom UI panel, so the command card and the chat stay usable
        BlzFrameSetAbsPoint(clickCatcher, FRAMEPOINT_BOTTOMLEFT, -sideBandWidth, 0.17)
        BlzFrameSetAbsPoint(clickCatcher, FRAMEPOINT_TOPRIGHT, FRAME_WIDTH_4_3 + sideBandWidth, FRAME_HEIGHT)
    }

    return clickCatcher
}

const debugPrint = (message: string) => {
    if (DEBUG) {
        print('hero-effect-locally: ' + message)
    }
}

export const init_HeroEffectLocally = () => {
    createHeroEffectSpawnTrigger(spawnedEffect => (state.effect = spawnedEffect))

    // Keeps track of where the mouse is, as a frame click gives no coordinates
    getUdgEscapers().forAll(escaper => {
        createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, escaper.getPlayer(), EVENT_PLAYER_MOUSE_MOVE)],
            actions: [
                () => {
                    const x = BlzGetTriggerPlayerMouseX()
                    const y = BlzGetTriggerPlayerMouseY()

                    if (x === 0 && y === 0) {
                        // the mouse is not over the terrain (UI, minimap...)
                        return
                    }

                    // from here on: local player only, and no handle operation
                    if (GetLocalPlayer() !== Natives.UGetTriggerPlayer()) {
                        return
                    }

                    state.mouseX = x
                    state.mouseY = y
                },
            ],
        })
    })

    const clickCatcher = createClickCatcherFrame()

    if (!clickCatcher) {
        print('hero-effect-locally: the click catcher frame could not be created.')
        return
    }

    debugPrint('click catcher frame created.')

    // Asynchronous: these actions only run on the machine of the player who clicked.
    // Every mouse-ish frame event is registered, to find out which ones a right click fires.
    const frameEvents: [frameeventtype, string][] = [
        [FRAMEEVENT_MOUSE_DOWN, 'MOUSE_DOWN'],
        [FRAMEEVENT_MOUSE_UP, 'MOUSE_UP'],
        [FRAMEEVENT_CONTROL_CLICK, 'CONTROL_CLICK'],
    ]

    for (const [frameEvent, eventName] of frameEvents) {
        const clickTrigger = CreateTrigger()
        BlzTriggerRegisterFrameEvent(clickTrigger, clickCatcher, frameEvent)
        TriggerAddAction(clickTrigger, () => {
            debugPrint(`${eventName} fired, tracked mouse = ${state.mouseX}, ${state.mouseY}`)

            if (state.mouseX === 0 && state.mouseY === 0) {
                // the mouse position was never tracked, better not to teleport the effect to the map corner
                return
            }

            setHeroEffectPosition(state.effect, state.mouseX, state.mouseY)
        })
    }
}
