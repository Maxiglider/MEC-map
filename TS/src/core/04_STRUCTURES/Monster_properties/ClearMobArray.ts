import { ClearMob } from './ClearMob'

export class ClearMobArray {
    //50 niveaux * 160 monstres

    private clearMobs: ClearMob[] = []
    private lastInstance = -1

    getFirstEmpty = (): number => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.clearMobs[i] === 0) break
            i = i + 1
        }
        return i
    }

    get = (arrayId: number): ClearMob => {
        if (arrayId < 0 || arrayId > this.lastInstance) {
            return 0
        }
        return this.clearMobs[arrayId]
    }

    getLastInstanceId = (): number => {
        return this.lastInstance
    }

    new = (triggerMob: monster, disableDuration: number, initialize: boolean): ClearMob => {
        //local integer n = this.getFirstEmpty()
        let n = this.lastInstance + 1
        if (n >= MAX_NB_CLEAR_MOB_BY_LEVEL) {
            return 0
        }
        //if (n > this.lastInstance) then
        this.lastInstance = n
        //endif
        this.clearMobs[n] = new ClearMob(triggerMobId, disableDuration)
        if (initialize) {
            this.clearMobs[n].initialize()
        }
        this.clearMobs[n].level = udg_levels.getLevelFromClearMobArray(this)
        this.clearMobs[n].arrayId = n
        return this.clearMobs[n]
    }

    count = (): number => {
        let nb = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.clearMobs[i] !== 0) {
                nb = nb + 1
            }
            i = i + 1
        }
        return nb
    }

    destroy = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.clearMobs[i] !== 0) {
                this.clearMobs[i].destroy()
            }
            i = i + 1
        }
        this.lastInstance = -1
    }

    setClearMobNull = (clearMobArrayId: number) => {
        this.clearMobs[clearMobArrayId] = 0
    }

    clearClearMob = (clearMobId: number): boolean => {
        let i = 0
        while (true) {
            if (this.clearMobs[i] === ClearMob(clearMobId) || i > this.lastInstance) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return false
        }
        this.clearMobs[i].destroy()
        return true
    }

    getClearMobNear = (x: number, y: number): ClearMob => {
        let xMob: number
        let yMob: number
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.clearMobs[i] != 0 && this.clearMobs[i].getTriggerMob().getUnit() != null) {
                xMob = GetUnitX(this.clearMobs[i].getTriggerMob().getUnit())
                yMob = GetUnitY(this.clearMobs[i].getTriggerMob().getUnit())
                if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                    return this.clearMobs[i]
                }
            }
            i = i + 1
        }
        return 0
    }

    initializeClearMobs = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.clearMobs[i] !== 0) {
                this.clearMobs[i].initialize()
            }
            i = i + 1
        }
    }

    closeClearMobs = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.clearMobs[i] !== 0) {
                this.clearMobs[i].close()
            }
            i = i + 1
        }
    }
}
