//évènement ajouté à la création de l'unité invisible

import { DUMMY_POWER_CIRCLE, GM_KILLING_EFFECT } from 'core/01_libraries/Constants'
import { ServiceManager } from 'Services'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers, getUdgMonsterTypes, udg_monsters } from '../../../../globals'

export const InitTrig_InvisUnit_is_getting_damage = () => {
    let TAILLE_UNITE = 100

    const gg_trg_InvisUnit_is_getting_damage = createEvent({
        events: [],
        actions: [
            () => {
                const invisUnit = GetTriggerUnit()
                const n = GetUnitUserData(invisUnit)
                const escaper = getUdgEscapers().get(n)

                if (!escaper) {
                    return
                }

                const killingUnit = GetEventDamageSource()
                let eff: effect | null

                const hero = escaper.getHero()

                if (!hero) {
                    return
                }

                const hauteurHero = BlzGetUnitZ(hero) + GetUnitFlyHeight(hero)
                const hauteurKillingUnit = BlzGetUnitZ(killingUnit) + GetUnitFlyHeight(killingUnit)

                if (!escaper.isAlive()) {
                    return
                }

                if (RAbsBJ(hauteurHero - hauteurKillingUnit) < TAILLE_UNITE) {
                    if (GetUnitTypeId(killingUnit) === DUMMY_POWER_CIRCLE) {
                        if (!escaper.isEscaperSecondary()) {
                            ServiceManager.getService('Multiboard').increasePlayerScore(
                                GetPlayerId(escaper.getPlayer()),
                                'saves'
                            )
                        }

                        getUdgEscapers().get(GetUnitUserData(killingUnit))?.coopReviveHero()
                        return
                    } else {
                        const monster = udg_monsters[GetUnitUserData(killingUnit)]

                        if (monster) {
                            const clearMob = monster.getClearMob()
                            const portalMob = monster.getPortalMob()
                            const circleMob = monster.getCircleMob()
                            const jumpPad = monster.getJumpPad()

                            if (clearMob) {
                                clearMob.activate()
                                return
                            } else if (portalMob) {
                                portalMob.activate(monster, escaper, hero)
                                return
                            } else if (circleMob) {
                                return
                            } else if (jumpPad !== undefined) {
                                escaper.setOldDiffZ(jumpPad)
                                return
                            }
                        }

                        if (escaper.isGodModeOn()) {
                            //god mode effect
                            eff = AddSpecialEffect(GM_KILLING_EFFECT, GetUnitX(killingUnit), GetUnitY(killingUnit))
                            DestroyEffect(eff)

                            //kill monster
                            if (escaper.doesGodModeKills()) {
                                if (monster) {
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
                            if (monster) {
                                const effectStr = getUdgMonsterTypes().monsterUnit2KillEffectStr(killingUnit)

                                if (effectStr) {
                                    eff = AddSpecialEffect(effectStr, GetUnitX(invisUnit), GetUnitY(invisUnit))
                                    TriggerSleepAction(3)
                                    DestroyEffect(eff)
                                }
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
