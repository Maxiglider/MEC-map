import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { Text } from '../../01_libraries/Text'
import { Monster } from '../../04_STRUCTURES/Monster/Monster'
import { MakeDeleteMonstersAction } from '../MakeLastActions/MakeDeleteMonstersAction'
import {ArrayHandler} from "../../../Utils/ArrayHandler";
import {MonsterNoMove} from "../../04_STRUCTURES/Monster/MonsterNoMove";
import {arrayPush} from "../../01_libraries/Basic_functions";
import {MonsterSimplePatrol} from "../../04_STRUCTURES/Monster/MonsterSimplePatrol";
import {MonsterMultiplePatrols} from "../../04_STRUCTURES/Monster/MonsterMultiplePatrols";

export class MakeDeleteMonsters extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit, mode: string) {
        super(maker, 'deleteMonsters', mode, ['oneByOne', 'all', 'noMove', 'move', 'simplePatrol', 'multiplePatrols'])
    }

    doActions = () => {
        if (super.doBaseActions()) {
            //modes : oneByOne, all, noMove, move, simplePatrol, multiplePatrols
            let suppressedMonsters: Monster[] = []
            let nbMonstersRemoved = 0

            if (this.getMode() == 'oneByOne') {
                //mode oneClick
                let monster = this.escaper.getMakingLevel().monsters.getMonsterNear(this.orderX, this.orderY)
                if (monster) {
                    monster.removeUnit()
                    suppressedMonsters.push(monster)
                    nbMonstersRemoved = 1
                }
            } else {
                //mode twoClics
                if (!this.isLastLocSavedUsed()) {
                    this.saveLoc(this.orderX, this.orderY)
                    return
                }

                let filterMonsterClassNameArr: string[] | undefined = undefined

                if (this.getMode() != 'all') {
                    filterMonsterClassNameArr = ArrayHandler.getNewArray()

                    if (this.getMode() == 'noMove') {
                        arrayPush(filterMonsterClassNameArr, 'MonsterNoMove')
                    } else {
                        if(this.getMode() == 'move' || this.getMode() == 'simplePatrol'){
                            arrayPush(filterMonsterClassNameArr, 'MonsterSimplePatrol')
                        }
                        if(this.getMode() == 'move' || this.getMode() == 'multiplePatrols'){
                            arrayPush(filterMonsterClassNameArr, 'MonsterMultiplePatrols')
                        }
                    }
                }

                let monsters = this.escaper
                        .getMakingLevel()
                        .monsters.getMonstersBetweenLocs(this.lastX, this.lastY, this.orderX, this.orderY, filterMonsterClassNameArr)

                if(filterMonsterClassNameArr){
                    ArrayHandler.clearArray(filterMonsterClassNameArr)
                }

                for (const monster of monsters) {
                    monster.removeUnit()
                    suppressedMonsters.push(monster)
                }

                nbMonstersRemoved = monsters.length
            }

            if (nbMonstersRemoved <= 1) {
                Text.mkP(this.makerOwner, I2S(nbMonstersRemoved) + ' monster removed.')
            } else {
                Text.mkP(this.makerOwner, I2S(nbMonstersRemoved) + ' monsters removed.')
            }

            if (nbMonstersRemoved > 0) {
                this.escaper.newAction(new MakeDeleteMonstersAction(this.escaper.getMakingLevel(), suppressedMonsters))
            }
            this.unsaveLocDefinitely()
        }
    }
}
