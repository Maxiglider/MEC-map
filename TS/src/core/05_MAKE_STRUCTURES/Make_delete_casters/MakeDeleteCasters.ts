import { IsUnitBetweenLocs } from 'core/01_libraries/Basic_functions'
import { Caster } from 'core/04_STRUCTURES/Caster/Caster'
import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { Text } from '../../01_libraries/Text'
import {MakeDeleteMonsters} from "../Make_delete_monsters/MakeDeleteMonsters";
import {MakeDeleteMonstersAction} from "../MakeLastActions/MakeDeleteMonstersAction";

export class MakeDeleteCasters extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit, mode: string) {
        super(maker, 'deleteCasters', mode)
    }

    doActions() {
        if (super.doBaseActions()) {
            //modes : oneByOne, twoClics
            let caster: Caster | null
            let suppressedCasters: Caster[] = []
            let nbCastersRemoved = 0

            if (this.getMode() == 'oneByOne') {
                //mode oneClick
                const monster = this.escaper.getMakingLevel().monsters.getMonsterNear(this.orderX, this.orderY, 'Caster')
                caster = (monster instanceof Caster) ? monster : null
                if (caster && caster.u) {
                    caster.removeUnit()
                    suppressedCasters.push(caster)
                    nbCastersRemoved = 1
                }
            } else {
                //mode twoClics
                if (!this.isLastLocSavedUsed()) {
                    this.saveLoc(this.orderX, this.orderY)
                    return
                }

                const casters = this.escaper.getMakingLevel().monsters.getMonstersBetweenLocs(this.lastX, this.lastY, this.orderX, this.orderY, 'Caster')

                casters.map(caster => {
                    caster.removeUnit()
                    caster instanceof Caster && suppressedCasters.push(caster)
                    nbCastersRemoved++
                })
            }

            if (nbCastersRemoved <= 1) {
                Text.mkP(this.makerOwner, I2S(nbCastersRemoved) + ' caster removed.')
            } else {
                Text.mkP(this.makerOwner, I2S(nbCastersRemoved) + ' casters removed.')
            }

            if (nbCastersRemoved > 0) {
                this.escaper.newAction(new MakeDeleteMonstersAction(this.escaper.getMakingLevel(), suppressedCasters))
            }
            this.unsaveLocDefinitely()
        }
    }
}
