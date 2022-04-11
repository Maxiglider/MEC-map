//évènement ajouté à la création de l'unité invisible

import { DUMMY_POWER_CIRCLE, GM_KILLING_EFFECT } from 'core/01_libraries/Constants'
import { Monster } from 'core/04_STRUCTURES/Monster/Monster'
import { ClearMob } from 'core/04_STRUCTURES/Monster_properties/ClearMob'
import { createEvent } from 'Utils/mapUtils'
import {
    getUdgEscapers,
    getUdgMonsterTypes, udg_monsters,
} from '../../../../globals'






export const InitTrig_InvisUnit_is_getting_damage = () => {
    let TAILLE_UNITE = 100

    let gg_trg_InvisUnit_is_getting_damage = createEvent({
        events: [],
        actions: [
            () => {
                let invisUnit: unit = GetTriggerUnit()
                let n = GetUnitUserData(invisUnit)
                const escaper = getUdgEscapers().get(n)

                if (!escaper) {
                    return
                }

                let killingUnit: unit = GetEventDamageSource()
                let clearMob: ClearMob | undefined
                let eff: effect | null
                let x: number
                let y: number

                const hero = escaper.getHero()

                if (!hero) {
                    return
                }

                const hauteurHero = BlzGetUnitZ(hero) + GetUnitFlyHeight(hero)
                let hauteurKillingUnit = BlzGetUnitZ(killingUnit) + GetUnitFlyHeight(killingUnit)

                if (!escaper.isAlive()) {
                    return
                }

                if (RAbsBJ(hauteurHero - hauteurKillingUnit) < TAILLE_UNITE) {
                    if (GetUnitTypeId(killingUnit) === DUMMY_POWER_CIRCLE) {
                        getUdgEscapers().get(GetUnitUserData(killingUnit))?.coopReviveHero()
                        return
                    } else {
                        const monster = udg_monsters[GetUnitUserData(killingUnit)]
                        clearMob = monster.getClearMob()
                        if (clearMob) {
                            clearMob.activate()
                        } else if (escaper.isGodModeOn()) {
                            //god mode effect
                            x = GetUnitX(killingUnit)
                            y = GetUnitY(killingUnit)
                            eff = AddSpecialEffect(GM_KILLING_EFFECT, x, y)
                            DestroyEffect(eff)

                            //kill monster
                            if (escaper.doesGodModeKills()) {
                                print("monster killing")
                                if (GetUnitUserData(killingUnit) !== 0) {
                                    monster.killUnit() //on ne tue pas directement le monstre, pour pouvoir exécuter des actions secondaires éventuelles de la méthode killUnit
                                } else {
                                    KillUnit(killingUnit)
                                }
                            }
                            return
                        }

                        if (!escaper.isCoopInvul()) {
                            escaper.kill()

                            //effet de tuation du héros par le monstre, suivant le type du monstre
                            const effectStr = getUdgMonsterTypes().monsterUnit2KillEffectStr(killingUnit)
                            if (effectStr) {
                                x = GetUnitX(invisUnit)
                                y = GetUnitY(invisUnit)
                                eff = AddSpecialEffect(effectStr, x, y)
                                TriggerSleepAction(3)
                                DestroyEffect(eff)
                            }
                        }
                    }
                }
            },
        ],
    })

    const setTailleUnite = (newSize: number) => {
        TAILLE_UNITE = newSize
    }

    return { TAILLE_UNITE, gg_trg_InvisUnit_is_getting_damage, setTailleUnite }
}

export const Trig_InvisUnit_is_getting_damage = InitTrig_InvisUnit_is_getting_damage()
