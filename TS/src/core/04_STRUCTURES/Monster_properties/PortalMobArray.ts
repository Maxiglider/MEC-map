import type { Level } from '../Level/Level'
import type { Monster } from '../Monster/Monster'
import { MONSTER_NEAR_DIFF_MAX } from '../Monster/MonsterArray'
import { PortalMob } from './PortalMob'

let lastInstance = -1

export class PortalMobArray {
    private level: Level
    private portalMobs: { [x: number]: PortalMob } = {}

    constructor(level: Level) {
        this.level = level
    }

    get(arrayId: number) {
        if (arrayId < 0 || arrayId > lastInstance) {
            return null
        }
        return this.portalMobs[arrayId]
    }

    getLastInstanceId = (): number => {
        return lastInstance
    }

    new = (triggerMob: Monster, disableDuration: number, initialize: boolean): PortalMob => {
        let n = ++lastInstance

        this.portalMobs[n] = new PortalMob(triggerMob, disableDuration)
        if (initialize) {
            this.portalMobs[n].initialize()
        }
        this.portalMobs[n].level = this.level
        this.portalMobs[n].id = n

        return this.portalMobs[n]
    }

    count = () => {
        let n = 0

        for (const [_k, _v] of pairs(this.portalMobs)) {
            n++
        }

        return n
    }

    destroy = () => {
        for (const [_, portalMob] of pairs(this.portalMobs)) {
            portalMob.destroy()
        }
    }

    removePortalMob = (portalMobArrayId: number) => {
        delete this.portalMobs[portalMobArrayId]
    }

    portalPortalMob = (portalMobId: number): boolean => {
        if (this.portalMobs[portalMobId]) {
            this.portalMobs[portalMobId].destroy()
            delete this.portalMobs[portalMobId]
            return true
        } else {
            return false
        }
    }

    getPortalMobNear(x: number, y: number) {
        let xMob: number
        let yMob: number
        let i = 0

        while (i <= lastInstance) {
            if (this.portalMobs[i]) {
                const unit = this.portalMobs[i].getTriggerMob()?.u

                if (unit) {
                    xMob = GetUnitX(unit)
                    yMob = GetUnitY(unit)
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                        return this.portalMobs[i]
                    }
                }
            }
            i++
        }

        return null
    }

    initializePortalMobs = () => {
        for (const [_, portalMob] of pairs(this.portalMobs)) {
            portalMob.initialize()
        }
    }

    closePortalMobs = () => {
        for (const [_, portalMob] of pairs(this.portalMobs)) {
            portalMob.close()
        }
    }
}
