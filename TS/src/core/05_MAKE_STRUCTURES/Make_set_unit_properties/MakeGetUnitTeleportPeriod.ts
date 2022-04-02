import { Text } from '../../01_libraries/Text'
import { Make } from '../Make/Make'

export class MakeGetUnitTeleportPeriod extends Make {
    constructor(maker: unit) {
        super(maker, 'getUnitTeleportPeriod')
    }

    doActions() {
        if (super.doBaseActions()) {
            let monsterTP = this.escaper.getMakingLevel().monstersTeleport.getMonsterNear(this.orderX, this.orderY)
            if (monsterTP) {
                Text.mkP(this.makerOwner, 'period : ' + R2S(monsterTP.getPeriod()) + ' s')
            }
        }
    }
}
