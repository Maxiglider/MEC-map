import { EffectUtils } from 'Utils/EffectUtils'
import { GetLocZ } from 'Utils/LocationUtils'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'
import { EscaperEffectFunctions } from '../04_STRUCTURES/Escaper/EscaperEffect_functions'
import { Natives } from '../wc3_natives_unsecured/Natives'

/**
 * The effect the left click test moves, so that the ways of catching a click can be compared on
 * the same object: whichever one just moved it is the one that reacted.
 *
 * It is created on demand, by the "-testLeftClicks" command, and on every machine: a handle
 * creation may never be local only. Only its position is allowed to diverge afterwards.
 */
const heroEffect = {
    effect: undefined as effect | undefined,
}

/** Per player, as each one turns the test on for themselves */
const testLeftClicks: { [escaperId: number]: boolean } = {}

export const isTestingLeftClicks = (escaperId: number) => testLeftClicks[escaperId] === true

/**
 * Creates the model of the "-effect light" command on the hero of that player, and destroys it
 * when the test is turned off. Called from a chat command, hence from a synchronized event,
 * hence on every machine at the same moment: the handle comes and goes for everybody at once.
 */
export const setTestLeftClicks = (escaperId: number, isTesting: boolean) => {
    testLeftClicks[escaperId] = isTesting

    if (!isTesting) {
        // as long as somebody else is still testing, the effect has to stay
        for (const [_id, isSomeoneTesting] of pairs(testLeftClicks)) {
            if (isSomeoneTesting) {
                return
            }
        }

        EffectUtils.destroyEffect(heroEffect.effect)
        heroEffect.effect = undefined

        return
    }

    if (heroEffect.effect) {
        return
    }

    const hero = getUdgEscapers().get(escaperId)?.getHero()
    const modelName = EscaperEffectFunctions.String2EffectStr('light')

    if (hero && modelName) {
        heroEffect.effect = EffectUtils.addSpecialEffect(modelName, GetUnitX(hero), GetUnitY(hero))
    }
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
/**
 * Last position of the mouse of every player, tracked apart because neither a frame event nor a
 * key event carries coordinates.
 *
 * The mouse move event is synchronized, so every machine knows where every player points: these
 * positions are the same everywhere and can feed synced logic, unlike the asynchronous lattice.
 * They are just as late as the network is.
 */
const mousePositions: { [escaperId: number]: { x: number; y: number } } = {}
const tracker = { isTracked: false }

export const trackMousePositions = () => {
    if (tracker.isTracked) {
        return
    }

    tracker.isTracked = true

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

                    mousePositions[GetPlayerId(Natives.UGetTriggerPlayer())] = { x, y }
                },
            ],
        })
    })
}

/** Undefined until that player has had their mouse over the terrain at least once */
export const getMousePosition = (escaperId: number) => mousePositions[escaperId]

/** Same thing for the player sitting in front of this machine */
export const getLocalMousePosition = () => getMousePosition(GetPlayerId(GetLocalPlayer()!))

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
