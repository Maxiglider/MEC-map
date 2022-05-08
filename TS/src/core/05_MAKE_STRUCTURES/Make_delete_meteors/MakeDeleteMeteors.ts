import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { ArrayHandler } from 'Utils/ArrayHandler'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { Meteor, METEOR_NORMAL, udg_meteors } from '../../04_STRUCTURES/Meteor/Meteor'
import { MakeDeleteMeteorsAction } from '../MakeLastActions/MakeDeleteMeteorsAction'

export class MakeDeleteMeteors extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit, mode: string) {
        super(maker, 'deleteMeteors', mode)
    }

    doActions = () => {
        if (super.doBaseActions()) {
            //modes : oneByOne, twoClics
            let meteor: Meteor
            let suppressedMeteors: Meteor[] = []
            let nbMeteorsRemoved = 0

            if (this.getMode() == 'oneByOne') {
                //mode oneClick
                if (GetItemTypeId(GetOrderTargetItem()) !== METEOR_NORMAL) {
                    return
                }

                meteor = udg_meteors[GetItemUserData(GetOrderTargetItem())]

                if (meteor && meteor.getItem()) {
                    meteor.delete()
                    arrayPush(suppressedMeteors, meteor)
                    nbMeteorsRemoved = 1
                }
            } else {
                //mode twoClics
                if (!this.isLastLocSavedUsed()) {
                    this.saveLoc(this.orderX, this.orderY)
                    return
                }

                const meteors = this.escaper
                    .getMakingLevel()
                    .meteors.getMeteorsBetweenLocs(this.lastX, this.lastY, this.orderX, this.orderY)

                for (const meteor of meteors) {
                    meteor.delete()
                    arrayPush(suppressedMeteors, meteor)
                    nbMeteorsRemoved = nbMeteorsRemoved + 1
                }

                ArrayHandler.clearArray(meteors)
            }

            if (nbMeteorsRemoved <= 1) {
                Text.mkP(this.makerOwner, I2S(nbMeteorsRemoved) + ' meteor removed.')
            } else {
                Text.mkP(this.makerOwner, I2S(nbMeteorsRemoved) + ' meteors removed.')
            }

            if (nbMeteorsRemoved > 0) {
                this.escaper.newAction(new MakeDeleteMeteorsAction(this.escaper.getMakingLevel(), suppressedMeteors))
            }
            this.unsaveLocDefinitely()
        }
    }
}
