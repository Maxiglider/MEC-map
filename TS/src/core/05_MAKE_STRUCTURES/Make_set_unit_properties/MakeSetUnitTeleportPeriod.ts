import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import {BasicFunctions} from "../../01_libraries/Basic_functions";
import {Text} from "../../01_libraries/Text";

export class MakeSetUnitTeleportPeriod extends MakeOneByOneOrTwoClicks {
    private period: number

    constructor(maker: unit, mode: string, period: number) {
        super(maker, 'setUnitTeleportPeriod', mode)
        
        if (period < MONSTER_TELEPORT_PERIOD_MIN || period > MONSTER_TELEPORT_PERIOD_MAX) {
            throw this.constructor.name + " : wrong period \"" + period + "\""
        }
        
        this.period = period
    }

    getPeriod = (): number => {
        return this.period
    }
    
    doActions() {
        let nbMonstersFixed = 0

        if (this.getMode() == 'oneByOne') {
            let monsterTP = this.escaper.getMakingLevel().monstersTeleport.getMonsterNear(this.orderX, this.orderY)
            if (monsterTP) {
                monsterTP.setPeriod(this.getPeriod())
                nbMonstersFixed = 1
            }
        } else {
            //mode twoClics
            if (!this.isLastLocSavedUsed()) {
                this.saveLoc(this.orderX, this.orderY)
                return
            }

            //todomax make all Monster<SpecificType>Array extend a new abstract class MonsterArray
            let monstersTP = this.escaper.getMakingLevel().monstersTeleport.getMonstersBetweenLocs(this.orderX, this.orderY)
            monstersTP.map(monsterTP => {
                monsterTP.setPeriod(this.getPeriod())
                nbMonstersFixed++
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
