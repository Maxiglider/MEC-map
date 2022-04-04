import { IsUnitBetweenLocs } from '../../01_libraries/Basic_functions'
import { Caster } from '../Caster/Caster'
import type { CasterType } from '../Caster/CasterType'
import type { Level } from '../Level/Level'
import { countMonstersAccordingToMode } from './Monster_count'
import type {Monster} from './Monster'
import type { MonsterType } from './MonsterType'

export const MONSTER_NEAR_DIFF_MAX = 64

//represents the monsters in a level
export class MonsterArray {
    private monsters: Monster[] //same ids as in udg_monsters
    private level?: Level

    constructor(level?: Level) {
        this.level = level
        this.monsters = []
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

    count = (mode?: string) => {
        return countMonstersAccordingToMode(this.monsters, mode)
    }

    //Juste remove the monster from this level
    removeMonster = (monsterId: number) => {
        delete this.monsters[monsterId]
    }

    getMonsterNear = (x: number, y: number, filterMonsterClassName?: string): Monster | null => {
        this.monsters.map(monster => {
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
        })

        return null
    }

    getMonstersBetweenLocs(x1: number, y1: number, x2: number, y2: number, filterMonsterClassName?: string) {
        return this.monsters.filter(monster => {
            if (monster && monster.u) {
                if (!filterMonsterClassName || monster.constructor.name === filterMonsterClassName) {
                    //todomax check that the filter like that works
                    if (IsUnitBetweenLocs(monster.u, x1, y1, x2, y2)) {
                        return true
                    }
                }
            }

            return false
        })
    }

    createMonstersUnits = () => {
        this.monsters.map(monster => {
            if (monster) {
                monster.createUnit()
            }
        })
    }

    removeMonstersUnits = () => {
        this.monsters.map(monster => {
            if (monster) {
                monster.removeUnit()
            }
        })
    }

    recreateMonstersUnitsOfType = (mt: MonsterType) => {
        this.monsters
            .filter(monster => monster && monster.getMonsterType() == mt)
            .map(monster => {
                monster.createUnit()
            })
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
        this.monsters
            .filter(monster => monster && monster.getMonsterType() == mt)
            .map(monster => {
                delete this.monsters[monster.getId()]
                monster.destroy()
            })
    }

    //Special casters
    refreshCastersOfType(ct: CasterType) {
        this.monsters.map(monster => {
            monster instanceof Caster && monster.getCasterType() === ct && monster.refresh()
        })
    }

    removeCastersOfType(ct: CasterType) {
        this.monsters.map(monster => {
            monster instanceof Caster && monster.getCasterType() === ct && monster.destroy()
        })
    }

    containsMonster(monster: Monster){
        return this.monsters.filter(mob => mob == monster).length > 0
    }

    getLast = () => {
        const filteredMonsters = this.monsters.filter(monster => monster !== undefined)
        return filteredMonsters[filteredMonsters.length - 1]
    }

    removeLast = () => {
        let i = this.monsters.length - 1

        while(i >= 0){
            if(this.monsters[i]){
                this.monsters[i].destroy()
                delete this.monsters[i]
                return true
            }
            i--
        }

        return false
    }

    executeForAll(callback: Function){
        this.monsters.filter(monster => monster !== undefined).map(monster => {
            callback(monster)
        })
    }

    //Destroy everything including the monsters
    destroy = () => {
        this.monsters.map(monster => {
            monster.destroy()
        })
    }
}
