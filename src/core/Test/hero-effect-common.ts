import { EffectUtils } from 'Utils/EffectUtils'
import { GetLocZ } from 'Utils/LocationUtils'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'
import { EscaperEffectFunctions } from '../04_STRUCTURES/Escaper/EscaperEffect_functions'
import { Natives } from '../wc3_natives_unsecured/Natives'

const SPAWN_TIME = 3 // game time, in seconds
export const LOG_CLICKS = false

/**
 * The one effect every variant moves, so that the ways of catching a click can be compared on
 * the same object: whichever one just moved it is the one that reacted.
 *
 * It is created on every machine (a handle creation may never be local only), and only its
 * position is allowed to diverge afterwards.
 */
const heroEffect = {
    effect: undefined as effect | undefined,
    isSpawnRegistered: false,
}

/** Spawns, at SPAWN_TIME, the model of the "-effect light" command on the hero of the first player */
export const initHeroEffect = () => {
    if (heroEffect.isSpawnRegistered) {
        return
    }

    heroEffect.isSpawnRegistered = true

    createEvent({
        events: [t => TriggerRegisterTimerEventSingle(t, SPAWN_TIME)],
        actions: [
            () => {
                const hero = getUdgEscapers().get(0)?.getHero()

                if (!hero) {
                    print("hero-effect: the first player doesn't have a hero.")
                    return
                }

                const modelName = EscaperEffectFunctions.String2EffectStr('light')

                if (!modelName) {
                    return
                }

                heroEffect.effect = EffectUtils.addSpecialEffect(modelName, GetUnitX(hero), GetUnitY(hero))
            },
        ],
    })
}

/** Teleports the effect, on the terrain surface. Creates no handle: local only calls are safe. */
export const setHeroEffectPosition = (x: number, y: number) => {
    heroEffect.effect && BlzSetSpecialEffectPosition(heroEffect.effect, x, y, GetLocZ(x, y))
}

/**
 * Last position of the mouse of the local player, tracked apart because neither a frame event
 * nor a key event carries coordinates.
 *
 * Local only: every machine writes the position of its own player, so it may never be read by
 * synced logic. The mouse move event does keep giving terrain coordinates over a frame.
 */
const localMouse = {
    x: 0,
    y: 0,
    isTracked: false,
}

export const trackLocalMousePosition = () => {
    if (localMouse.isTracked) {
        return
    }

    localMouse.isTracked = true

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

                    localMouse.x = x
                    localMouse.y = y
                },
            ],
        })
    })
}

/** Undefined until the mouse has been over the terrain at least once */
export const getLocalMousePosition = () => {
    if (localMouse.x === 0 && localMouse.y === 0) {
        return undefined
    }

    return localMouse
}

/**
 * os.clock() of the last click caught by the asynchronous path, so that the synchronized one can
 * tell how late it arrives for that same click. Local only, like everything it is compared to.
 */
const lastLocalClick = { time: undefined as number | undefined }

export const setLastLocalClickTime = (time: number) => {
    lastLocalClick.time = time
}

/** Reading it consumes it: one synchronized click can only be the twin of one local click */
export const takeLastLocalClickTime = () => {
    const time = lastLocalClick.time
    lastLocalClick.time = undefined

    return time
}
