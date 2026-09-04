import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'
import { Natives } from '../wc3_natives_unsecured/Natives'
import { createHeroEffectSpawnTrigger, setHeroEffectPosition } from './hero-effect-common'

/**
 * Left click moves this effect for everybody: EVENT_PLAYER_MOUSE_DOWN is a synchronized
 * event, so the click travels through the game turn queue exactly like a unit order, and
 * the effect only moves once the click has been delivered to every machine (= latency).
 *
 * See "hero-effect-locally" for the asynchronous counterpart.
 */
const state = {
    effect: undefined as effect | undefined,
}

export const init_HeroEffectOnNetwork = () => {
    createHeroEffectSpawnTrigger(spawnedEffect => (state.effect = spawnedEffect))

    getUdgEscapers().forAll(escaper => {
        createEvent({
            events: [t => TriggerRegisterPlayerEvent(t, escaper.getPlayer(), EVENT_PLAYER_MOUSE_DOWN)],
            actions: [
                () => {
                    if (Natives.UBlzGetTriggerPlayerMouseButton() !== MOUSE_BUTTON_TYPE_LEFT) {
                        return
                    }

                    const x = BlzGetTriggerPlayerMouseX()
                    const y = BlzGetTriggerPlayerMouseY()

                    if (x === 0 && y === 0) {
                        // the click was not on the terrain (UI, minimap...)
                        return
                    }

                    setHeroEffectPosition(state.effect, x, y)
                },
            ],
        })
    })
}
