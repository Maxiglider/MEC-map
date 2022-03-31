import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import {countMonstersAccordingToMode, Monster} from "./Monster";
import {Level} from "../Level/Level";
import {MonsterSimplePatrol} from "./MonsterSimplePatrol";
import {MonsterMultiplePatrols} from "./MonsterMultiplePatrols";
import {MonsterNoMove} from "./MonsterNoMove";
import {MonsterType} from "./MonsterType";

export const MONSTER_NEAR_DIFF_MAX = 64


//represents the monsters in a level
export class MonstersArray {
    private monsters: Monster[] //same ids as in udg_monsters
    private level: Level

    constructor(level: Level) {
        this.level = level
        this.monsters = []
    }

    get(monsterId: number) {
        return this.monsters[monsterId]
    }

    new = (monster: Monster, createUnit: boolean) => {
        let n = monster.getId()
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

    getMonsterNear = (x: number, y: number) => {
        this.monsters.map(monster => {
            if(monster && monster.u){
                const xMob = GetUnitX(monster.u)
                const yMob = GetUnitY(monster.u)

                if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                    return monster
                }
            }
        })

        return null
    }

    createMonstersUnits = () => {
        this.monsters.map(monster => {
            if(monster){
                monster.createUnit()
            }
        })
    }

    removeMonstersUnits = () => {
        this.monsters.map(monster => {
            if(monster){
                monster.removeUnit()
            }
        })
    }

    recreateMonstersUnitsOfType = (mt: MonsterType) => {
        this.monsters.filter(monster => monster && monster.getMonsterType() == mt).map(monster => {
            monster.createUnit()
        })
    }

    //Destroy one monster
    clearMonster = (monsterId: number) => {
        this.monsters[monsterId].destroy()
        delete this.monsters[monsterId]
        return true
    }

    //Destroy monsters of one type
    clearMonstersOfType = (mt: MonsterType) => {
        this.monsters.filter(monster => monster && monster.getMonsterType() == mt).map(monster => {
            delete this.monsters[monster.getId()]
            monster.destroy()
        })
    }

    //Destroy everything including the monsters
    destroy = () => {
        this.monsters.map(monster => {
            monster.destroy()
        })
    }
}
