import type { Level } from '../Level/Level'
import type { Monster } from '../Monster/Monster'
import { MONSTER_NEAR_DIFF_MAX } from '../Monster/MonsterArray'
import { ClearMob } from './ClearMob'

export class ClearMobArray {
    private level: Level
    private clearMobs: { [x: number]: ClearMob } = {}

    constructor(level: Level) {
        this.level = level
    }

    get(arrayId: number) {
        if (arrayId < 0 || arrayId > this.count() - 1) {
            return null
        }
        return this.clearMobs[arrayId]
    }

    getLastInstanceId = (): number => {
        return this.count() - 1
    }

    new = (triggerMob: Monster, disableDuration: number, initialize: boolean): ClearMob => {
        let n = this.count()

        this.clearMobs[n] = new ClearMob(triggerMob, disableDuration)
        if (initialize) {
            this.clearMobs[n].initialize()
        }
        this.clearMobs[n].level = this.level
        this.clearMobs[n].id = n

        return this.clearMobs[n]
    }

    count = () => {
        let n = 0

        for (const [_k, _v] of pairs(this.clearMobs)) {
            n++
        }

        return n
    }

    destroy = () => {
        for (const [_, clearMob] of pairs(this.clearMobs)) {
            clearMob.destroy()
        }
    }

    removeClearMob = (clearMobArrayId: number) => {
        delete this.clearMobs[clearMobArrayId]
    }

    clearClearMob = (clearMobId: number): boolean => {
        if (this.clearMobs[clearMobId]) {
            this.clearMobs[clearMobId].destroy()
            delete this.clearMobs[clearMobId]
            return true
        } else {
            return false
        }
    }

    getClearMobNear(x: number, y: number) {
        let xMob: number
        let yMob: number
        let i = 0

        while (i <= this.count()) {
            if (this.clearMobs[i]) {
                const unit = this.clearMobs[i].getTriggerMob().u

                if (unit) {
                    xMob = GetUnitX(unit)
                    yMob = GetUnitY(unit)
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                        return this.clearMobs[i]
                    }
                }
            }
            i++
        }

        return null
    }

    initializeClearMobs = () => {
        for (const [_, clearMob] of pairs(this.clearMobs)) {
            clearMob.initialize()
        }
    }

    closeClearMobs = () => {
        for (const [_, clearMob] of pairs(this.clearMobs)) {
            clearMob.close()
        }
    }
}
