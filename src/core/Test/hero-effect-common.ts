import { EffectUtils } from 'Utils/EffectUtils'
import { GetLocZ } from 'Utils/LocationUtils'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'
import { EscaperEffectFunctions } from '../04_STRUCTURES/Escaper/EscaperEffect_functions'

const SPAWN_TIME = 10 // game time, in seconds

/**
 * Spawns, at SPAWN_TIME, the model of the "-effect light" command on the hero of the first
 * player, and hands the created effect over to the caller.
 *
 * The effect is created on every machine (a handle creation may never be local only),
 * so only its position is allowed to diverge afterwards.
 */
export const createHeroEffectSpawnTrigger = (onEffectSpawned: (spawnedEffect: effect | undefined) => void) => {
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

                const spawnedEffect = EffectUtils.addSpecialEffect(modelName, GetUnitX(hero), GetUnitY(hero))

                print('hero-effect: effect spawned = ' + tostring(spawnedEffect !== undefined))

                onEffectSpawned(spawnedEffect)
            },
        ],
    })
}

/** Teleports the effect, on the terrain surface. Creates no handle: local only calls are safe. */
export const setHeroEffectPosition = (heroEffect: effect | undefined, x: number, y: number) => {
    heroEffect && BlzSetSpecialEffectPosition(heroEffect, x, y, GetLocZ(x, y))
}
