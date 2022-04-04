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
                let invisUnit: unit | null = GetTriggerUnit()
                let n = GetUnitUserData(invisUnit)
                const escaper = getUdgEscapers().get(n)

                if (!escaper) {
                    return
                }

                let killingUnit: unit | null = GetEventDamageSource()
                let clearMob: ClearMob | undefined
                let moc: Monster
                let effectStr: string | null
                let eff: effect | null
                let x: number
                let y: number

                const hero = escaper.getHero()

                if (!hero) {
                    return
                }

                let heroPos: location | null = GetUnitLoc(hero)
                const hauteurHero = GetLocationZ(heroPos) + GetUnitFlyHeight(hero)
                let killingUnitPos: location | null = GetUnitLoc(killingUnit)
                let hauteurKillingUnit = GetLocationZ(killingUnitPos) + GetUnitFlyHeight(killingUnit)

                RemoveLocation(heroPos)
                RemoveLocation(killingUnitPos)
                heroPos = null
                killingUnitPos = null
                if (!escaper.isAlive()) {
                    invisUnit = null
                    killingUnit = null
                    return
                }

                if (RAbsBJ(hauteurHero - hauteurKillingUnit) < TAILLE_UNITE) {
                    if (GetUnitTypeId(killingUnit) === DUMMY_POWER_CIRCLE) {
                        getUdgEscapers().get(GetUnitUserData(killingUnit))?.coopReviveHero()
                        invisUnit = null
                        killingUnit = null
                        return
                    } else {
                        const monster = udg_monsters[GetUnitUserData(killingUnit)]
                        clearMob = monster.getClearMob()
                        if (clearMob) {
                            clearMob.activate()
                        } else if (escaper.isGodModeOn()) {
                            if (escaper.doesGodModeKills()) {
                                if (GetUnitUserData(killingUnit) !== 0) {
                                    monster.killUnit() //on ne tue pas directement le monstre, pour pouvoir exécuter des actions secondaires
                                    monster.destroy()
                                } else {
                                    KillUnit(killingUnit)
                                }
                            }
                            x = GetUnitX(killingUnit)
                            y = GetUnitY(killingUnit)
                            eff = AddSpecialEffect(GM_KILLING_EFFECT, x, y)
                            DestroyEffect(eff)
                            eff = null
                            invisUnit = null
                            killingUnit = null
                            return
                        }
                        if (!escaper.isCoopInvul()) {
                            escaper.kill()

                            //effet de tuation du héros par le monstre, suivant le type du monstre
                            effectStr = getUdgMonsterTypes().monsterUnit2KillEffectStr(killingUnit)
                            if (effectStr !== null) {
                                x = GetUnitX(invisUnit)
                                y = GetUnitY(invisUnit)
                                eff = AddSpecialEffect(effectStr, x, y)
                                TriggerSleepAction(3)
                                DestroyEffect(eff)
                                eff = null
                            }
                        }
                    }
                }

                invisUnit = null
                killingUnit = null
            },
        ],
    })

    return { TAILLE_UNITE, gg_trg_InvisUnit_is_getting_damage }
}

export const Trig_InvisUnit_is_getting_damage = InitTrig_InvisUnit_is_getting_damage()
