import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import {MonsterType} from "../../04_STRUCTURES/Monster/MonsterType";
import {Monster} from "../../04_STRUCTURES/Monster/Monster";
import {Text} from "../../01_libraries/Text";

export class MakeSetUnitMonsterType extends MakeOneByOneOrTwoClicks {
    private mt: MonsterType

    constructor(maker: unit, mode: string, mt: MonsterType) {
        super(maker, 'setUnitMonsterType', mode)
        this.mt = mt
    }

    getMonsterType = (): MonsterType => {
        return this.mt
    }
    
    doActions() {
        //modes : oneByOne, twoClics
        let nbMonstersFixed = 0

        if (this.getMode() == 'oneByOne') {
            let monster = this.escaper.getMakingLevel().getMonsterNear(this.orderX, this.orderY)
            if (monster) {
                if (monster.setMonsterType(this.getMonsterType())) {
                    nbMonstersFixed = 1
                }
            }
        } else {
            //mode twoClics
            if (!this.isLastLocSavedUsed()) {
                this.saveLoc(this.orderX, this.orderY)
                return
            }

            //todomax getMonsters method in Level class to union all types of Monsters in an array of Monster
            let monsters = escaper.getMakingLevel().getMonstersBetweenLocs(this.orderX, this.orderY)
            monsters.map(monster => {
                if(monster.setMonsterType(this.getMonsterType())){
                    nbMonstersFixed++
                }
            })
        }

        if (nbMonstersFixed <= 1) {
            Text.mkP(this.makerOwner, I2S(nbMonstersFixed) + ' monster fixed.')
        } else {
            Text.mkP(this.makerOwner, I2S(nbMonstersFixed) + ' monsters fixed.')
        }
        this.unsaveLocDefinitely()
    }
}
