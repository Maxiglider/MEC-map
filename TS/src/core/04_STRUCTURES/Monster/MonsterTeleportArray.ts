import { MonsterTeleportt } from './MonsterTeleport'
export class MonsterTeleportArray {
    //50 niveaux * 500 monstres

    private monsters: MonsterTeleport[]
    private lastInstance = -1

    getFirstEmpty = (): number => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.monsters[i] === 0) break
            i = i + 1
        }
        return i
    }

    get = (arrayId: number): MonsterTeleport => {
        if (arrayId < 0 || arrayId > this.lastInstance) {
            return 0
        }
        return this.monsters[arrayId]
    }

    getLastInstanceId = (): number => {
        return this.lastInstance
    }

    new = (mt: MonsterType, period: number, angle: number, mode: string, createUnit: boolean): MonsterTeleport => {
        let n: number
        if (
            (mode !== 'normal' && mode !== 'string') ||
            period < MonsterTeleportt.MONSTER_TELEPORT_PERIOD_MIN ||
            period > MonsterTeleportt.MONSTER_TELEPORT_PERIOD_MAX
        ) {
            return 0
        }
        //n = this.getFirstEmpty()
        n = this.lastInstance + 1
        if (n >= MAX_NB_MONSTERS) {
            return 0
        }
        //if (n > this.lastInstance) then
        this.lastInstance = n
        //endif
        this.monsters[n] = new MonsterTeleport(mt, period, angle, mode)
        if (createUnit) {
            this.monsters[n].createUnit()
        }
        this.monsters[n].level = udg_levels.getLevelFromMonsterTeleportArray(this)
        this.monsters[n].arrayId = n
        return this.monsters[n]
    }

    count = (): number => {
        let nb = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] !== 0) {
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
            if (this.monsters[i] !== 0) {
                this.monsters[i].destroy()
            }
            i = i + 1
        }
        this.lastInstance = -1
    }

    setMonsterNull = (monsterArrayId: number) => {
        this.monsters[monsterArrayId] = 0
    }

    clearMonster = (monsterId: number): boolean => {
        let i = 0
        while (true) {
            if (this.monsters[i] === MonsterTeleport(monsterId) || i > this.lastInstance) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return false
        }
        this.monsters[i].destroy()
        return true
    }

    getMonsterNear = (x: number, y: number): MonsterTeleport => {
        let xMob: number
        let yMob: number
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] != 0 && this.monsters[i].u != null) {
                xMob = GetUnitX(this.monsters[i].u)
                yMob = GetUnitY(this.monsters[i].u)
                if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                    return this.monsters[i]
                }
            }
            i = i + 1
        }
        return 0
    }

    createMonsters = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] !== 0) {
                this.monsters[i].createUnit()
            }
            i = i + 1
        }
    }

    removeMonsters = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] !== 0) {
                this.monsters[i].removeUnit()
            }
            i = i + 1
        }
    }

    recreateMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] != 0 && this.monsters[i].getMonsterType() == mt && this.monsters[i].u != null) {
                this.monsters[i].createUnit()
            }
            i = i + 1
        }
    }

    removeMonstersOfType = (mt: MonsterType) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.monsters[i] != 0 && this.monsters[i].getMonsterType() == mt) {
                this.monsters[i].destroy()
            }
            i = i + 1
        }
    }
}
