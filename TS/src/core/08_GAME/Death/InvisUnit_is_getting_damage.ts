//évènement ajouté à la création de l'unité invisible

import { ServiceManager } from 'Services'
import { EffectUtils } from 'Utils/EffectUtils'
import { createEvent } from 'Utils/mapUtils'
import { DUMMY_POWER_CIRCLE, GM_KILLING_EFFECT } from 'core/01_libraries/Constants'
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
                        const targetPlayer = GetUnitUserData(killingUnit)

                        if (escaper.alliedState[targetPlayer]) {
                            if (!escaper.isEscaperSecondary()) {
                                ServiceManager.getService('Multiboard').increasePlayerScore(
                                    GetPlayerId(escaper.getPlayer()),
                                    'saves'
                                )
                            }

                            getUdgEscapers().get(targetPlayer)?.coopReviveHero()
                        }

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
                                const effect = monster.getJumpPadEffect()

                                if (effect) {
                                    EffectUtils.destroyEffect(
                                        EffectUtils.addSpecialEffect(
                                            effect,
                                            GetUnitX(killingUnit),
                                            GetUnitY(killingUnit)
                                        )
                                    )
                                }

                                return
                            }
                        }

                        if (escaper.isGodModeOn()) {
                            //god mode effect
                            EffectUtils.destroyEffect(
                                EffectUtils.addSpecialEffect(
                                    GM_KILLING_EFFECT,
                                    GetUnitX(killingUnit),
                                    GetUnitY(killingUnit)
                                )
                            )

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
                            if (monster.hasAttackGroundPos()) {
                                SetWidgetLife(hero, GetWidgetLife(hero) - GetEventDamage())
                            }

                            if (
                                !monster.hasAttackGroundPos() ||
                                (monster.hasAttackGroundPos() && GetWidgetLife(hero) - GetEventDamage() <= 0.405)
                            ) {
                                escaper.kill()
                            }

                            //effet de tuation du héros par le monstre, suivant le type du monstre
                            if (monster) {
                                const effectStr = getUdgMonsterTypes().monsterUnit2KillEffectStr(killingUnit)

                                if (effectStr) {
                                    const eff = EffectUtils.addSpecialEffect(
                                        effectStr,
                                        GetUnitX(invisUnit),
                                        GetUnitY(invisUnit)
                                    )
                                    TriggerSleepAction(3)
                                    EffectUtils.destroyEffect(eff)
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
