import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { MONSTER_NEAR_DIFF_MAX } from '../Monster/MonsterNoMoveArray'
import { Meteor } from './Meteor'

const MAX_NB_METEORS = 100

export class MeteorArray {
    private meteors: Meteor[] = []
    private lastInstance = -1

    getFirstEmpty = (): number => {
        let i = 0
        while (true) {
            if (i > this.lastInstance || this.meteors[i] === null) break
            i = i + 1
        }
        return i
    }

    get = (arrayId: number) => {
        if (arrayId < 0 || arrayId > this.lastInstance) {
            return null
        }

        return this.meteors[arrayId]
    }

    new = (x: number, y: number, createMeteor: boolean) => {
        //local integer n = this.getFirstEmpty()
        let n = this.lastInstance + 1
        if (n >= MAX_NB_METEORS) {
            return null
        }
        //if (n > this.lastInstance) then
        this.lastInstance = n
        //endif
        this.meteors[n] = new Meteor(x, y)
        if (createMeteor) {
            this.meteors[n].createMeteor()
        }
        this.meteors[n].level = udg_levels.getLevelFromMeteorArray(this)
        this.meteors[n].arrayId = n
        return this.meteors[n]
    }

    setMeteorNull = (arrayId: number): void => {
        this.meteors[arrayId] = 0
    }

    count = (): number => {
        let n = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.meteors[i] !== null) {
                n = n + 1
            }
            i = i + 1
        }
        return n
    }

    destroy = (): void => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.meteors[i] !== null) {
                this.meteors[i].destroy()
            }
            i = i + 1
        }
        this.lastInstance = -1
    }

    clearMeteor = (meteorId: number): boolean => {
        let i = 0
        while (true) {
            if (this.meteors[i] === Meteor(meteorId) || i > this.lastInstance) break
            i = i + 1
        }
        if (i > this.lastInstance) {
            return false
        }
        this.meteors[i].destroy()
        this.meteors[i] = 0
        return true
    }

    createMeteors = (): void => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.meteors[i] !== null) {
                this.meteors[i].createMeteor()
            }
            i = i + 1
        }
    }

    removeMeteors = (): void => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.meteors[i] !== null) {
                this.meteors[i].removeMeteor()
            }
            i = i + 1
        }
    }

    getMeteorNear = (x: number, y: number) => {
        let xMeteor: number
        let yMeteor: number
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.meteors[i] != null && this.meteors[i].getItem() != null) {
                xMeteor = GetItemX(this.meteors[i].getItem())
                yMeteor = GetItemY(this.meteors[i].getItem())
                if (RAbsBJ(x - xMeteor) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMeteor) < MONSTER_NEAR_DIFF_MAX) {
                    return this.meteors[i]
                }
            }
            i = i + 1
        }
        return null
    }

    getLastInstanceId = (): number => {
        return this.lastInstance
    }
}
