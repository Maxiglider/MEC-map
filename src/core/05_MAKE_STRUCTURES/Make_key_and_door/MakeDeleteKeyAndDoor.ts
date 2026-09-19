import { Text } from '../../01_libraries/Text'
import { MakeOneByOneOrTwoClicks } from '../Make/MakeOneByOneOrTwoClicks'

/** -deleteKeyAndDoor: a click on a door or its key deletes both; -deleteKeyAndDoorBetweenPoints: two clicks */
export class MakeDeleteKeyAndDoor extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit, mode: string) {
        super(maker, 'keyAndDoorDelete', mode)
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const level = this.escaper.getMakingLevel()

            if (this.getMode() === 'oneByOne') {
                const keyAndDoor = level.keyAndDoors.getNear(this.orderX, this.orderY)
                if (!keyAndDoor) {
                    Text.erP(this.makerOwner, 'no door or key clicked for your making level')
                    return
                }
                keyAndDoor.destroy()
                Text.mkP(this.makerOwner, 'key and door removed')
                return
            }

            if (!this.isLastLocSavedUsed()) {
                this.saveLoc(this.orderX, this.orderY)
                return
            }

            const between = level.keyAndDoors.getBetweenLocs(this.lastX, this.lastY, this.orderX, this.orderY)
            for (const keyAndDoor of between) {
                keyAndDoor.destroy()
            }
            Text.mkP(this.makerOwner, `${between.length} key(s) and door(s) removed`)
            this.unsaveLocDefinitely()
        }
    }
}
