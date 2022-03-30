import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { Monster } from '../Monster/MonsterInterface'
import { Caster } from './Caster'
import { CasterType } from './CasterType'

export class CasterArray {
    private casters: Caster[] = []
    private lastInstance = -1

    getFirstEmpty = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.casters[i] === null) break
            i = i + 1
        }
        return i
    }

    get = (arrayId: number) => {
        if (arrayId < 0 || arrayId > this.lastInstance) {
            return null
        }
        return this.casters[arrayId]
    }

    getLastInstanceId = () => {
        return this.lastInstance
    }

    newCaster = (casterType: CasterType, x: number, y: number, angle: number, enable: boolean) => {
        //local integer n = this.getFirstEmpty()
        let n = this.lastInstance + 1
        if (n >= Monster.MAX_NB_MONSTERS) {
            return null
        }
        //if (n > this.lastInstance) then
        this.lastInstance = n
        //endif
        this.casters[n] = new Caster(casterType, x, y, angle)
        if (enable) {
            this.casters[n].enable()
        }
        this.casters[n].level = udg_levels.getLevelFromCasterArray(this)
        this.casters[n].arrayId = n
        return this.casters[n]
    }

    count = (): number => {
        let nb = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.casters[i] !== null) {
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
            if (this.casters[i] !== null) {
                this.casters[i].destroy()
            }
            i = i + 1
        }
        this.lastInstance = -1
    }

    setCasterNull = (casterArrayId: number) => {
        this.casters[casterArrayId] = 0
    }

    clearCaster = (casterId: number): boolean => {
        let i = 0
        while (true) {
            if (this.casters[i] === Caster(casterId) || i > this.lastInstance) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return false
        }
        this.casters[i].destroy()
        return true
    }

    getCasterNear = (x: number, y: number): Caster => {
        let xCaster: number
        let yCaster: number
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.casters[i] != null && this.casters[i].casterUnit != null) {
                xCaster = GetUnitX(this.casters[i].casterUnit)
                yCaster = GetUnitY(this.casters[i].casterUnit)
                if (RAbsBJ(x - xCaster) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yCaster) < MONSTER_NEAR_DIFF_MAX) {
                    return this.casters[i]
                }
            }
            i = i + 1
        }
        return 0
    }

    createCasters = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.casters[i] !== null) {
                this.casters[i].enable()
            }
            i = i + 1
        }
    }

    removeCasters = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.casters[i] !== null) {
                this.casters[i].disable()
            }
            i = i + 1
        }
    }

    refreshCastersOfType = (casterType: CasterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (
                this.casters[i] != null &&
                this.casters[i].getCasterType() == casterType &&
                this.casters[i].casterUnit != null
            ) {
                this.casters[i].refresh()
            }
            i = i + 1
        }
    }

    removeCastersOfType = (casterType: CasterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.casters[i] != null && this.casters[i].getCasterType() == casterType) {
                this.casters[i].destroy()
            }
            i = i + 1
        }
    }
}
