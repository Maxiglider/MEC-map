import { StopUnit } from 'core/01_libraries/Basic_functions'
import { ArrayHandler } from 'Utils/ArrayHandler'
import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { Escaper } from '../Escaper/Escaper'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/Monster'

export const PORTAL_MOB_MAX_FREEZE_DURATION = 10

export class PortalMob {
    level?: Level
    private triggerMob: Monster | null
    private targetMob: Monster | null
    private freezeDuration: number
    private portalEffect: string | null
    private portalEffectDuration: number

    id: number = -1

    private timers = ArrayHandler.getNewArray<Timer>()

    constructor(
        triggerMob: Monster,
        freezeDuration: number,
        portalEffect: string | null,
        portalEffectDuration: number | null
    ) {
        if (freezeDuration < 0 || freezeDuration > PORTAL_MOB_MAX_FREEZE_DURATION) {
            throw this.constructor.name + ' : invalid freeze duration'
        }

        this.triggerMob = triggerMob
        this.targetMob = null

        triggerMob.setPortalMob(this)

        this.freezeDuration = freezeDuration
        this.portalEffect = portalEffect
        this.portalEffectDuration = portalEffectDuration || freezeDuration || 1
    }

    getTriggerMob = () => this.triggerMob

    getTargetMob = () => this.targetMob

    initialize = () => {}

    close = () => {}

    redoTriggerMobPermanentEffect = () => {}

    setTriggerMob = (monster: Monster | null): boolean => {
        if (this.triggerMob) {
            return false
        }

        this.triggerMob = monster
        this.triggerMob?.setPortalMob(this)

        return true
    }

    setTargetMob = (monster: Monster | null): boolean => {
        if (this.targetMob) {
            return false
        }

        this.targetMob = monster
        this.targetMob?.setPortalMob(this)

        return true
    }

    destroy = () => {
        this.triggerMob?.removePortalMob()
        this.targetMob?.removePortalMob()

        this.level && this.level.portalMobs.removePortalMob(this.id)

        ArrayHandler.clearArray(this.timers)
    }

    activate = (monster: Monster, escaper: Escaper, hero: unit) => {
        if (!this.targetMob || escaper.isPortalCooldown()) {
            return
        }

        const targetMob = this.triggerMob === monster ? this.targetMob : this.triggerMob

        if (!targetMob?.u) {
            return
        }

        StopUnit(hero)
        SetUnitX(hero, GetUnitX(targetMob.u))
        SetUnitY(hero, GetUnitY(targetMob.u))

        escaper.enablePortalCooldown()
        this.portalEffect && escaper.createPortalEffect(this.portalEffect)

        if (this.freezeDuration > 0) {
            SetUnitAnimation(hero, 'channel')
            escaper.absoluteSlideSpeed(0)

            this.timers.push(
                createTimer(this.freezeDuration, false, () => {
                    escaper.stopAbsoluteSlideSpeed()
                    SetUnitAnimation(hero, 'stand')

                    escaper.disablePortalCooldown(0.5)
                })
            )
        } else {
            escaper.disablePortalCooldown(0.5)
        }

        this.portalEffect &&
            this.timers.push(
                createTimer(this.portalEffectDuration, false, () => {
                    escaper.destroyPortalEffect()
                })
            )

        // TODO; SECONDARYHERO?
    }

    toJson = () => ({
        id: this.id,
        triggerMobId: this.triggerMob?.id,
        targetMobId: this.targetMob?.id,
        freezeDuration: this.freezeDuration,
        portalEffect: this.portalEffect,
        portalEffectDuration: this.portalEffectDuration,
    })
}
