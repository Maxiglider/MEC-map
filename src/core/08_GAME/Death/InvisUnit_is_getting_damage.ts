//évènement ajouté à la création de l'unité invisible

import { ServiceManager } from 'Services'
import { EffectUtils } from 'Utils/EffectUtils'
import { createEvent } from 'Utils/mapUtils'
import { Constants } from 'core/01_libraries/Constants'
import { Monster } from 'core/04_STRUCTURES/Monster/Monster'
import { hooks } from 'core/API/GeneralHooks'
import { getUdgEscapers, getUdgTerrainSaves, udg_monsters, udg_spawned_monsters } from '../../../../globals'
import type { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import { Natives } from '../../wc3_natives_unsecured/Natives'

const InitTrig_InvisUnit_is_getting_damage = () => {
    let TAILLE_UNITE = 100

    /**
     * What happens when the hero touches something, whether the game told us through the
     * immolation of a monster or our own contact check found it. An effect cannot be immolated,
     * so an async slide has to look for its contacts by hand, and both roads end up here.
     *
     * heroZ comes from the machine that told the contact of a hero sliding as an effect. Every
     * machine holds that hero at a place of its own, and each one reading its height there would
     * have some of them see the contact and the others not: a dead ally revived on some machines
     * only, which is a desync.
     */
    const onEscaperTouchingUnit = (escaper: Escaper, touchedUnit: unit, damage: number, heroZ = escaper.getHeroZ()) => {
        const hero = escaper.getHero()

        if (!hero || !escaper.isAlive()) {
            return
        }

        const hauteurHero = heroZ
        const hauteurKillingUnit = BlzGetUnitZ(touchedUnit) + GetUnitFlyHeight(touchedUnit)

        if (RAbsBJ(hauteurHero - hauteurKillingUnit) >= TAILLE_UNITE) {
            return
        }

        if (GetUnitTypeId(touchedUnit) === Constants.DUMMY_POWER_CIRCLE) {
            const targetPlayer = GetUnitUserData(touchedUnit)

            if (escaper.alliedState[targetPlayer]) {
                const targetEscaper = getUdgEscapers().get(targetPlayer)

                if (!escaper.isEscaperSecondary()) {
                    ServiceManager.getService('Multiboard').increasePlayerScore(
                        GetPlayerId(escaper.getPlayer()),
                        'saves'
                    )

                    if (targetEscaper && hooks.hooks_onCoopHeroRevive) {
                        for (const hook of hooks.hooks_onCoopHeroRevive.getHooks()) {
                            hook.execute2(escaper, targetEscaper)
                        }
                    }
                }

                targetEscaper?.coopReviveHero()
            }

            return
        }

        // TODO; monsterSpawn mobs are null here, need a reference somehow as they're not in udg_monsters
        onEscaperTouchingMonster(escaper, touchedUnit, damage)
    }

    const gg_trg_InvisUnit_is_getting_damage = createEvent({
        events: [],
        actions: [
            () => {
                if (GetEventDamage() === 0) {
                    return
                }

                const invisUnit = Natives.UGetTriggerUnit()
                const escaper = getUdgEscapers().get(GetUnitUserData(invisUnit))
                const killingUnit = GetEventDamageSource()

                if (!escaper || !killingUnit) {
                    return
                }

                onEscaperTouchingUnit(escaper, killingUnit, GetEventDamage())
            },
        ],
    })

    const setTailleUnite = (newSize: number) => {
        TAILLE_UNITE = newSize
    }

    return { TAILLE_UNITE, gg_trg_InvisUnit_is_getting_damage, onEscaperTouchingUnit, setTailleUnite }
}

const onEscaperTouchingMonster = (escaper: Escaper, killingUnit: unit, damage: number) => {
    const hero = escaper.getHero()

    if (!hero) {
        return
    }

    if (!escaper.isAlive()) {
        return
    }

    const monster = udg_monsters[GetUnitUserData(killingUnit)] as Monster | undefined

    if (monster) {
        const clearMob = monster.getClearMob()
        const portalMob = monster.getPortalMob()
        const circleMob = monster.getCircleMob()
        const jumpPad = monster.getJumpPad()
        const lifeBonus = monster.getMonsterType()?.getLifeBonus()
        const monsterTouchEvents = getUdgTerrainSaves().findMonsterTouchEventsByMonsterId(monster.getId())

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
                    EffectUtils.addSpecialEffect(effect, GetUnitX(killingUnit), GetUnitY(killingUnit))
                )
            }

            return
        } else if (lifeBonus) {
            monster?.onEscaperReachingThisLifeBonus(escaper)
            return
        } else if (monsterTouchEvents.length > 0) {
            for (const event of monsterTouchEvents) {
                event.fire()
            }
            return
        }
    }

    if (escaper.isGodModeOn()) {
        //god mode effect
        EffectUtils.destroyEffect(
            EffectUtils.addSpecialEffect(Constants.GM_KILLING_EFFECT, GetUnitX(killingUnit), GetUnitY(killingUnit))
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
        // todo find a solution for mortars with async slide control
        if (monster?.hasAttackGroundPos()) {
            SetWidgetLife(hero, GetWidgetLife(hero) - damage)
        }

        if (!monster?.hasAttackGroundPos() || (monster.hasAttackGroundPos() && GetWidgetLife(hero) - damage <= 0.405)) {
            escaper.kill()
        }

        const effectStr =
            monster?.getMonsterType()?.getKillingEffectStr() ||
            udg_spawned_monsters[GetHandleId(killingUnit)]?.getKillingEffectStr()

        //effet de tuation du héros par le monstre, suivant le type du monstre
        if (effectStr) {
            const eff = EffectUtils.addSpecialEffect(effectStr, escaper.getHeroX(), escaper.getHeroY())
            EffectUtils.destroyEffect(eff)
        }
    }
}

const Trig_InvisUnit_is_getting_damage = InitTrig_InvisUnit_is_getting_damage()

export const init_InvisUnit_is_getting_damage = () => {
    return {
        onEscaperTouchingMonster,
        onEscaperTouchingUnit: Trig_InvisUnit_is_getting_damage.onEscaperTouchingUnit,
        Trig_InvisUnit_is_getting_damage,
    }
}

export type IInvisUnit_is_getting_damage = ReturnType<typeof init_InvisUnit_is_getting_damage>
