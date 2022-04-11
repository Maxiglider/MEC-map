import { ArrayHandler } from '../../../Utils/ArrayHandler'
import { arrayPush, IsUnitBetweenLocs } from '../../01_libraries/Basic_functions'
import { Caster } from '../Caster/Caster'
import type { CasterType } from '../Caster/CasterType'
import type { Level } from '../Level/Level'
import type { Monster } from './Monster'
import type { MonsterType } from './MonsterType'
import { countMonstersAccordingToMode } from './Monster_count'

export const MONSTER_NEAR_DIFF_MAX = 64

//represents the monsters in a level
export class MonsterArray {
    private monsters: { [x: number]: Monster } = {} //same ids as in udg_monsters
    private level?: Level

    constructor(level?: Level) {
        this.level = level
    }

    getLevel = () => {
        return this.level
    }

    get(monsterId: number) {
        return this.monsters[monsterId]
    }

    new = (monster: Monster, createUnit: boolean) => {
        const n = monster.getId()
        this.monsters[n] = monster

        if (createUnit) {
            monster.createUnit()
        }
        monster.level = this.level
    }

    count = (mode?: string) => countMonstersAccordingToMode(this.monsters, mode)

    //Juste remove the monster from this level
    removeMonster = (monsterId: number) => {
        delete this.monsters[monsterId]
    }

    getMonsterNear = (x: number, y: number, filterMonsterClassName?: string): Monster | null => {
        for (const [_, monster] of pairs(this.monsters)) {
            if (monster && monster.u) {
                const xMob = GetUnitX(monster.u)
                const yMob = GetUnitY(monster.u)

                if (!filterMonsterClassName || monster.constructor.name === filterMonsterClassName) {
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                        //todomax check that the filter like that works
                        return monster
                    }
                }
            }
        }

        return null
    }

    getMonstersBetweenLocs(x1: number, y1: number, x2: number, y2: number, filterMonsterClassName?: string | string[]) {
        let filterMonsterClassNameArr: string[] | null = null
        let clearArrayAtEnd = false

        if (filterMonsterClassName) {
            if (typeof filterMonsterClassName == 'string') {
                filterMonsterClassNameArr = ArrayHandler.getNewArray()
                clearArrayAtEnd = true
                filterMonsterClassNameArr[0] = filterMonsterClassName
            } else {
                filterMonsterClassNameArr = filterMonsterClassName
            }
        }

        const filteredMonsters = ArrayHandler.getNewArray<Monster>()

        for (const [_, monster] of pairs(this.monsters)) {
            if (monster.u) {
                if (!filterMonsterClassNameArr || filterMonsterClassNameArr.includes(monster.constructor.name)) {
                    //todomax check that the filter like that works
                    if (IsUnitBetweenLocs(monster.u, x1, y1, x2, y2)) {
                        arrayPush(filteredMonsters, monster)
                    }
                }
            }
        }

        if (clearArrayAtEnd) {
            filterMonsterClassNameArr && ArrayHandler.clearArray(filterMonsterClassNameArr)
        }

        return filteredMonsters
    }

    createMonstersUnits = () => {
        for (const [_, monster] of pairs(this.monsters)) {
            monster.createUnit()
        }
    }

    removeMonstersUnits = () => {
        for (const [_, monster] of pairs(this.monsters)) {
            monster.removeUnit()
        }
    }

    recreateMonstersUnitsOfType = (mt: MonsterType) => {
        for (const [_, monster] of pairs(this.monsters)) {
            if (monster.getMonsterType() === mt) {
                monster.createUnit()
            }
        }
    }

    //Destroy one monster
    clearMonster = (monsterId: number) => {
        if (this.monsters[monsterId]) {
            this.monsters[monsterId].destroy()
            delete this.monsters[monsterId]
            return true
        } else {
            return false
        }
    }

    //Destroy monsters of one type
    clearMonstersOfType = (mt: MonsterType) => {
        for (const [_, monster] of pairs(this.monsters)) {
            if (monster.getMonsterType() === mt) {
                delete this.monsters[monster.getId()]
                monster.destroy()
            }
        }
    }

    //Special casters
    refreshCastersOfType(ct: CasterType) {
        for (const [_, monster] of pairs(this.monsters)) {
            monster instanceof Caster && monster.getCasterType() === ct && monster.refresh()
        }
    }

    removeCastersOfType(ct: CasterType) {
        for (const [_, monster] of pairs(this.monsters)) {
            monster instanceof Caster && monster.getCasterType() === ct && monster.destroy()
        }
    }

    containsMonster(monster: Monster) {
        for (const [_, m] of pairs(this.monsters)) {
            if (m === monster) {
                return true
            }
        }

        return false
    }

    getLast = () => {
        return this.monsters[this.count() - 1]
    }

    removeLast = () => {
        let i = this.count() - 1

        while (i >= 0) {
            if (this.monsters[i]) {
                this.monsters[i].destroy()
                delete this.monsters[i]
                return true
            }
            i--
        }

        return false
    }

    executeForAll(callback: Function) {
        for (const [_, monster] of pairs(this.monsters)) {
            callback(monster)
        }
    }

    //Destroy everything including the monsters
    destroy = () => {
        for (const [_, monster] of pairs(this.monsters)) {
            monster.destroy()
        }
    }
}
