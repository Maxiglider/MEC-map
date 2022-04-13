import { BaseArray } from '../BaseArray'
import type { Level } from '../Level/Level'
import type { Monster } from '../Monster/Monster'
import { MONSTER_NEAR_DIFF_MAX } from '../Monster/MonsterArray'
import { ClearMob } from './ClearMob'

export class ClearMobArray extends BaseArray<ClearMob> {
    private level: Level

    constructor(level: Level) {
        super()
        this.level = level
    }

    new = (triggerMob: Monster, disableDuration: number, initialize: boolean): ClearMob => {
        const clearMob = new ClearMob(triggerMob, disableDuration)

        initialize && clearMob.initialize()
        clearMob.level = this.level

        this._new(clearMob)

        return clearMob
    }

    removeClearMob = (clearMobArrayId: number) => {
        delete this.data[clearMobArrayId]
    }

    clearClearMob = (clearMobId: number): boolean => {
        if (this.data[clearMobId]) {
            this.data[clearMobId].destroy()
            delete this.data[clearMobId]
            return true
        } else {
            return false
        }
    }

    getClearMobNear(x: number, y: number) {
        let xMob: number
        let yMob: number
        let i = 0

        while (i <= this.lastInstanceId) {
            if (this.data[i]) {
                const unit = this.data[i].getTriggerMob().u

                if (unit) {
                    xMob = GetUnitX(unit)
                    yMob = GetUnitY(unit)
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                        return this.data[i]
                    }
                }
            }
            i++
        }

        return null
    }

    initializeClearMobs = () => {
        for (const [_, clearMob] of pairs(this.data)) {
            clearMob.initialize()
        }
    }

    closeClearMobs = () => {
        for (const [_, clearMob] of pairs(this.data)) {
            clearMob.close()
        }
    }
}
