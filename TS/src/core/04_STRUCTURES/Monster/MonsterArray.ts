import { ArrayHandler } from '../../../Utils/ArrayHandler'
import { arrayPush, IsUnitBetweenLocs } from '../../01_libraries/Basic_functions'
import { BaseArray } from '../BaseArray'
import { Caster } from '../Caster/Caster'
import type { CasterType } from '../Caster/CasterType'
import type { Level } from '../Level/Level'
import type { Monster } from './Monster'
import type { MonsterType } from './MonsterType'
import { countMonstersAccordingToMode } from './Monster_count'
import {MecHookArray} from "../../API/MecHookArray";

export const MONSTER_NEAR_DIFF_MAX = 64

//represents the monsters in a level
export class MonsterArray extends BaseArray<Monster> {
    // private monsters: { [x: number]: Monster } = {} //same ids as in udg_monsters
    private level?: Level

    //hooks
    public hooks_onBeforeCreateMonsterUnit = new MecHookArray()
    public hooks_onAfterCreateMonsterUnit = new MecHookArray()

    constructor(level?: Level) {
        super(false)
        this.level = level
    }

    getLevel = () => {
        return this.level
    }

    new = (monster: Monster, createUnit: boolean) => {
        this._new(monster)

        if (createUnit) {
            monster.createUnit()
        }

        monster.level = this.level
    }

    count = (mode?: string) => countMonstersAccordingToMode(this.data, mode)

    //Juste remove the monster from this level
    removeMonster = (monsterId: number) => {
        delete this.data[monsterId]
    }

    getMonsterNear = (x: number, y: number, filterMonsterClassName?: string): Monster | null => {
        for (const [_, monster] of pairs(this.data)) {
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

        for (const [_, monster] of pairs(this.data)) {
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
        for (const [_, monster] of pairs(this.data)) {
            monster.createUnit()
        }
    }

    removeMonstersUnits = () => {
        for (const [_, monster] of pairs(this.data)) {
            monster.removeUnit()
        }
    }

    recreateMonstersUnitsOfType = (mt: MonsterType) => {
        for (const [_, monster] of pairs(this.data)) {
            if (monster.getMonsterType() === mt) {
                monster.createUnit()
            }
        }
    }

    //Destroy one monster
    clearMonster = (monsterId: number) => {
        if (this.data[monsterId]) {
            this.data[monsterId].destroy()
            delete this.data[monsterId]
            return true
        } else {
            return false
        }
    }

    //Destroy monsters of one type
    clearMonstersOfType = (mt: MonsterType) => {
        for (const [_, monster] of pairs(this.data)) {
            if (monster.getMonsterType() === mt) {
                delete this.data[monster.getId()]
                monster.destroy()
            }
        }
    }

    //Special casters
    refreshCastersOfType(ct: CasterType) {
        for (const [_, monster] of pairs(this.data)) {
            monster instanceof Caster && monster.getCasterType() === ct && monster.refresh()
        }
    }

    removeCastersOfType(ct: CasterType) {
        for (const [_, monster] of pairs(this.data)) {
            monster instanceof Caster && monster.getCasterType() === ct && monster.destroy()
        }
    }

    containsMonster(monster: Monster) {
        for (const [_, m] of pairs(this.data)) {
            if (m === monster) {
                return true
            }
        }

        return false
    }

    getLast = () => {
        let last = null

        for (const [_, monster] of pairs(this.data)) {
            last = monster
        }

        return last
    }

    removeLast = (destroy = true) => {
        const last = this.getLast()

        if (last) {
            if (destroy) {
                last.destroy()
            }
            delete this.data[last.id]
            return true
        }

        return false
    }

    removeAllWithoutDestroy = () => {
        while (this.removeLast(false));
    }

    onBeforeCreateMonsterUnit = (cb: () => any) => {
        return this.hooks_onBeforeCreateMonsterUnit.new(cb)
    }

    onAfterCreateMonsterUnit = (cb: () => any) => {
        return this.hooks_onAfterCreateMonsterUnit.new(cb)
    }
}
