import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { Text } from '../../01_libraries/Text'
import { Monster } from '../../04_STRUCTURES/Monster/Monster'

export class MakeDeleteMonsters extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit, mode: string) {
        const acceptedModes = ['oneByOne', 'all', 'noMove', 'move', 'simplePatrol', 'multiplePatrols']
        super(maker, 'deleteMonsters', mode, acceptedModes)
    }

    doActions() {
        if (super.doBaseActions()) {
            //modes : oneByOne, all, noMove, move, simplePatrol, multiplePatrols
            let suppressedMonsters: Monster[] = []
            let nbMonstersRemoved = 0

            if (this.getMode() == 'oneByOne') {
                //mode oneClick
                let monster = this.escaper.getMakingLevel().getMonsterNear(this.orderX, this.orderY)
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

                let monsters = this.escaper
                    .getMakingLevel()
                    .getMonstersBetweenLocs(this.lastX, this.lastY, this.orderX, this.orderY)

                monsters.map(monster => {
                    monster.removeUnit()
                    suppressedMonsters.push(monster)
                })

                nbMonstersRemoved = monsters.length()
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
