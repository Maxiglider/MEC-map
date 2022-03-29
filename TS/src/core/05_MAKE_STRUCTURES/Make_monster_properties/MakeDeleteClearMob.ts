import { Make } from '../Make/Make'
import {Text} from "../../01_libraries/Text";
import {ClearMob} from "../../04_STRUCTURES/Monster_properties/ClearMob";

export class MakeDeleteClearMob extends Make {
    constructor(maker: unit){
        super(maker, 'deleteClearMob')
    }

    clickMade = (clearMob: ClearMob) => {
        clearMob.destroy()
        Text.mkP(this.makerOwner, 'clear mob removed')
    }

    doActions() {
        //todomax make Caster extend Monster

        //recherche du monsterOrCaster cliqué
        let clearMob = this.escaper.getMakingLevel().getClearMobNear(this.orderX, this.orderY)
        if (clearMob) {
            this.clickMade(clearMob)
        }else{
            Text.erP(this.makerOwner, 'no clear mob clicked for your making level')
        }
    }

    cancelLastAction = (): boolean => {
        return false
    }

    redoLastAction = (): boolean => {
        return false
    }
}
