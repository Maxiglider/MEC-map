import { IsUnitBetweenLocs } from 'core/01_libraries/Basic_functions'
import { Caster } from 'core/04_STRUCTURES/Caster/Caster'
import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { Text } from '../../01_libraries/Text'

export class MakeDeleteCasters extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit, mode: string) {
        super(maker, 'deleteCasters', mode)
    }

    doActions() {
        if (super.doBaseActions()) {
            //modes : oneByOne, twoClics
            let caster: Caster
            let suppressedCasters: Caster[] = []
            let nbCastersRemoved = 0

            if (this.getMode() == 'oneByOne') {
                //mode oneClick
                caster = this.escaper.getMakingLevel().casters.getCasterNear(this.orderX, this.orderY)
                if (caster && caster.casterUnit) {
                    caster.disable()
                    suppressedCasters.push(caster)
                    nbCastersRemoved = 1
                }
            } else {
                //mode twoClics
                if (!this.isLastLocSavedUsed()) {
                    this.saveLoc(this.orderX, this.orderY)
                    return
                }

                const lastInstanceId = this.escaper.getMakingLevel().casters.getLastInstanceId()

                for (let i = 0; i <= lastInstanceId; i++) {
                    caster = this.escaper.getMakingLevel().casters.get(i)
                    if (
                        caster &&
                        caster.casterUnit &&
                        IsUnitBetweenLocs(caster.casterUnit, this.lastX, this.lastY, this.orderX, this.orderY)
                    ) {
                        caster.disable()
                        suppressedCasters.push(caster)
                        nbCastersRemoved = nbCastersRemoved + 1
                    }
                }
            }

            if (nbCastersRemoved <= 1) {
                Text.mkP(this.makerOwner, I2S(nbCastersRemoved) + ' caster removed.')
            } else {
                Text.mkP(this.makerOwner, I2S(nbCastersRemoved) + ' casters removed.')
            }

            if (nbCastersRemoved > 0) {
                this.escaper.newAction(new MakeDeleteCastersAction(this.escaper.getMakingLevel(), suppressedCasters))
            }
            this.unsaveLocDefinitely()
        }
    }
}
