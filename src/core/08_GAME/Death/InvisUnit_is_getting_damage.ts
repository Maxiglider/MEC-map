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
import { cancelKillingEffectPreview, getKillingEffectIndex, rememberKillingEffectOfDeath } from './AsyncKillingEffects'

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

    /**
     * The killing effect of touching that unit when touching it kills the hero for sure, and nothing
     * otherwise. Asked by the machine of an async hero the moment it sees the contact, with the very
     * questions onEscaperTouchingUnit and onEscaperTouchingMonster ask every machine once the contact
     * reaches them. Whatever a monster does rather than killing gets no answer, and neither does a
     * mortar, which only kills once its damage adds up; the touch events of a monster are only known
     * then, so the effect shown for them goes back under the ground (see onEscaperTouchingMonster).
     */
    const getKillingEffectOfTouch = (escaper: Escaper, touchedUnit: unit, heroZ: number): string | undefined => {
        if (!escaper.getHero() || !escaper.isAlive() || escaper.isGodModeOn() || escaper.isCoopInvul()) {
            return undefined
        }

        if (RAbsBJ(heroZ - (BlzGetUnitZ(touchedUnit) + GetUnitFlyHeight(touchedUnit))) >= TAILLE_UNITE) {
            return undefined
        }

        if (GetUnitTypeId(touchedUnit) === Constants.DUMMY_POWER_CIRCLE) {
            return undefined
        }

        const monster = udg_monsters[GetUnitUserData(touchedUnit)] as Monster | undefined

        if (
            monster &&
            (monster.getClearMob() ||
                monster.getPortalMob() ||
                monster.getCircleMob() ||
                monster.getJumpPad() !== undefined ||
                monster.getMonsterType()?.getLifeBonus() ||
                monster.hasAttackGroundPos())
        ) {
            return undefined
        }

        return (
            monster?.getMonsterType()?.getKillingEffectStr() ||
            udg_spawned_monsters[GetHandleId(touchedUnit)]?.getKillingEffectStr()
        )
    }

    return {
        TAILLE_UNITE,
        gg_trg_InvisUnit_is_getting_damage,
        onEscaperTouchingUnit,
        setTailleUnite,
        getKillingEffectOfTouch,
    }
}

/** What touching a monster does, telling whether it went the way that kills */
const touchMonster = (escaper: Escaper, killingUnit: unit, damage: number): boolean => {
    const hero = escaper.getHero()

    if (!hero) {
        return false
    }

    if (!escaper.isAlive()) {
        return false
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
            return false
        } else if (portalMob) {
            portalMob.activate(monster, escaper, hero)
            return false
        } else if (circleMob) {
            return false
        } else if (jumpPad !== undefined) {
            escaper.setOldDiffZ(jumpPad)
            const effect = monster.getJumpPadEffect()

            if (effect) {
                EffectUtils.destroyEffect(
                    EffectUtils.addSpecialEffect(effect, GetUnitX(killingUnit), GetUnitY(killingUnit))
                )
            }

            return false
        } else if (lifeBonus) {
            monster?.onEscaperReachingThisLifeBonus(escaper)
            return false
        } else if (monsterTouchEvents.length > 0) {
            for (const event of monsterTouchEvents) {
                event.fire()
            }
            return false
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

        return false
    }

    if (!escaper.isCoopInvul()) {
        // todo find a solution for mortars with async slide control
        if (monster?.hasAttackGroundPos()) {
            SetWidgetLife(hero, GetWidgetLife(hero) - damage)
        }

        const effectStr =
            monster?.getMonsterType()?.getKillingEffectStr() ||
            udg_spawned_monsters[GetHandleId(killingUnit)]?.getKillingEffectStr()

        // A hero sliding async whose pool holds that model has it explode where it dies, on every
        // machine, named by its death packet (see AsyncKillingEffects) - rather than here, where each
        // machine sees the hero at a place of its own.
        const isExplodedAtDeath =
            !!effectStr && escaper.isHeroAsEffect() && getKillingEffectIndex(escaper.getId(), effectStr) !== -1

        if (!monster?.hasAttackGroundPos() || (monster.hasAttackGroundPos() && GetWidgetLife(hero) - damage <= 0.405)) {
            if (effectStr && escaper.isHeroAsEffect()) {
                rememberKillingEffectOfDeath(escaper.getId(), effectStr)
            }

            escaper.kill()
        }

        //effet de tuation du héros par le monstre, suivant le type du monstre
        if (effectStr && !isExplodedAtDeath) {
            const eff = EffectUtils.addSpecialEffect(effectStr, escaper.getHeroX(), escaper.getHeroY())
            EffectUtils.destroyEffect(eff)
        }

        return true
    }

    return false
}

const onEscaperTouchingMonster = (escaper: Escaper, killingUnit: unit, damage: number) => {
    // the killing effect the machine of an async hero showed at once goes back under the ground,
    // unless this touch does go the way that kills
    if (!touchMonster(escaper, killingUnit, damage)) {
        cancelKillingEffectPreview(escaper.getId())
    }
}

const Trig_InvisUnit_is_getting_damage = InitTrig_InvisUnit_is_getting_damage()

export const init_InvisUnit_is_getting_damage = () => {
    return {
        onEscaperTouchingMonster,
        onEscaperTouchingUnit: Trig_InvisUnit_is_getting_damage.onEscaperTouchingUnit,
        getKillingEffectOfTouch: Trig_InvisUnit_is_getting_damage.getKillingEffectOfTouch,
        Trig_InvisUnit_is_getting_damage,
    }
}

export type IInvisUnit_is_getting_damage = ReturnType<typeof init_InvisUnit_is_getting_damage>
