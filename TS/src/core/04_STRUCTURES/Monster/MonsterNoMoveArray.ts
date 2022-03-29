import { MAX_NB_MONSTERS_BY_LEVEL } from 'core/01_libraries/Constants'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { MonsterNoMove } from './MonsterNoMove'

export const MONSTER_NEAR_DIFF_MAX = 64

export class MonsterNoMoveArray {
    private monsters: MonsterNoMove[]
    private lastInstance = -1

    constructor() {}

    getFirstEmpty = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.monsters[i] === null) break
            i = i + 1
        }
        return i
    }

    get = (arrayId: number) => {
        if (arrayId < 0 || arrayId > this.lastInstance) {
            return null
        }

        return this.monsters[arrayId]
    }

    getLastInstanceId = () => {
        return this.lastInstance
    }

    new = (mt: MonsterType, x: number, y: number, angle: number, createUnit: boolean) => {
        //local integer n = this.getFirstEmpty()
        let n = this.lastInstance + 1
        if (n >= MAX_NB_MONSTERS_BY_LEVEL) {
            return null
        }
        //if (n > this.lastInstance) then
        this.lastInstance = n
        //endif
        this.monsters[n] = new MonsterNoMove(mt, x, y, angle)
        if (createUnit) {
            this.monsters[n].createUnit()
        }
        this.monsters[n].level = udg_levels.getLevelFromMonsterNoMoveArray(this)
        this.monsters[n].arrayId = n
        return this.monsters[n]
    }

    count = () => {
        let nb = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] !== null) {
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
            if (this.monsters[i] !== null) {
                this.monsters[i].destroy()
            }
            i = i + 1
        }
        this.lastInstance = -1
    }

    setMonsterNull = (monsterArrayId: number) => {
        this.monsters[monsterArrayId] = null
    }

    clearMonster = (monsterId: number) => {
        let i = 0
        while (true) {
            if (this.monsters[i] === MonsterNoMove(monsterId) || i > this.lastInstance) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return false
        }
        this.monsters[i].destroy()
        return true
    }

    getMonsterNear = (x: number, y: number) => {
        let xMob: number
        let yMob: number
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] != null && this.monsters[i].u != null) {
                xMob = GetUnitX(this.monsters[i].u)
                yMob = GetUnitY(this.monsters[i].u)
                if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                    return this.monsters[i]
                }
            }
            i = i + 1
        }

        return null
    }

    createMonsters = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] !== null) {
                this.monsters[i].createUnit()
            }
            i = i + 1
        }
    }

    removeMonsters = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] !== null) {
                this.monsters[i].removeUnit()
            }
            i = i + 1
        }
    }

    recreateMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] != null && this.monsters[i].getMonsterType() == mt && this.monsters[i].u != null) {
                this.monsters[i].createUnit()
            }
            i = i + 1
        }
    }

    removeMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] != null && this.monsters[i].getMonsterType() == mt) {
                this.monsters[i].destroy()
            }
            i = i + 1
        }
    }
}
