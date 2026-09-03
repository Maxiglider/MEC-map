import { EffectUtils } from 'Utils/EffectUtils'
import { GetLocZ } from 'Utils/LocationUtils'
import { createEvent, createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { getUdgEscapers } from '../../../globals'
import { Constants } from '../01_libraries/Constants'
import { EscaperEffectFunctions } from '../04_STRUCTURES/Escaper/EscaperEffect_functions'
import { Natives } from '../wc3_natives_unsecured/Natives'

const TRIGGER_TIME = 10 // game time, in seconds
const MOVE_PERIOD = 0.01
const MOVE_STEP = Constants.HERO_WALK_SPEED * MOVE_PERIOD

const state: {
    effect: effect | undefined
    x: number
    y: number
    moveTimer: Timer | undefined
} = {
    effect: undefined,
    x: 0,
    y: 0,
    moveTimer: undefined,
}

const setEffectPosition = (x: number, y: number) => {
    state.x = x
    state.y = y

    state.effect && BlzSetSpecialEffectPosition(state.effect, x, y, GetLocZ(x, y))
}

/** Returns true once the effect reached the target. */
const stepTowards = (targetX: number, targetY: number) => {
    const dx = targetX - state.x
    const dy = targetY - state.y
    const distance = SquareRoot(dx * dx + dy * dy)

    if (distance <= MOVE_STEP) {
        setEffectPosition(targetX, targetY)
        return true
    }

    setEffectPosition(state.x + (dx / distance) * MOVE_STEP, state.y + (dy / distance) * MOVE_STEP)
    return false
}

const moveEffectTo = (targetX: number, targetY: number) => {
    if (!state.effect) {
        return
    }

    state.moveTimer?.destroy()
    state.moveTimer = undefined

    // first step applied right away, so the effect starts moving on the click itself
    // instead of waiting up to MOVE_PERIOD for the first timer tick
    if (stepTowards(targetX, targetY)) {
        return
    }

    state.moveTimer = createTimer(MOVE_PERIOD, true, () => {
        if (stepTowards(targetX, targetY)) {
            state.moveTimer?.destroy()
            state.moveTimer = undefined
        }
    })
}

export const init_HeroEffect = () => {
    const escaper = getUdgEscapers().get(0)

    if (!escaper) {
        print('hero-effect: there is no first player.')
        return
    }

    // Spawns the effect on the hero of the first player, at TRIGGER_TIME
    createEvent({
        events: [t => TriggerRegisterTimerEventSingle(t, TRIGGER_TIME)],
        actions: [
            () => {
                const hero = escaper.getHero()

                if (!hero) {
                    print("hero-effect: the first player doesn't have a hero.")
                    return
                }

                const modelName = EscaperEffectFunctions.String2EffectStr('light') // same model as "-effect light"

                if (!modelName) {
                    return
                }

                state.effect = EffectUtils.addSpecialEffect(modelName, GetUnitX(hero), GetUnitY(hero))
                setEffectPosition(GetUnitX(hero), GetUnitY(hero))
            },
        ],
    })

    // Moves the effect towards the terrain position right-clicked by the first player
    createEvent({
        events: [t => TriggerRegisterPlayerEvent(t, escaper.getPlayer(), EVENT_PLAYER_MOUSE_DOWN)],
        actions: [
            () => {
                if (Natives.UBlzGetTriggerPlayerMouseButton() !== MOUSE_BUTTON_TYPE_RIGHT) {
                    return
                }

                const x = BlzGetTriggerPlayerMouseX()
                const y = BlzGetTriggerPlayerMouseY()

                if (x === 0 && y === 0) {
                    // the click was not on the terrain (UI, minimap...)
                    return
                }

                moveEffectTo(x, y)
            },
        ],
    })
}
