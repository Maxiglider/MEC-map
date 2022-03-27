import { BasicFunctions } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { Make, MakeConsts } from '../Make/Make'

const { MAKE_LAST_CLIC_UNIT_ID } = MakeConsts
const { IsUnitBetweenLocs } = BasicFunctions

export class MakeDeleteCasters extends Make {
    lastX: number = 0
    lastY: number = 0

    private lastLocIsSaved: boolean
    private lastLocSavedIsUsed: boolean
    private unitLastClic?: unit
    private mode: string

    constructor(maker: unit, mode: string) {
        //modes : oneByOne, twoClics
        if (mode !== 'oneByOne' && mode !== 'twoClics') {
            throw 'MakeDeleteCasters : wrong mode "' + mode + '"'
        }

        super(maker, 'monsterSpawnCreate')

        this.mode = mode
        this.lastLocIsSaved = false
        this.lastLocSavedIsUsed = false
    }

    isLastLocSavedUsed() {
        return this.lastLocSavedIsUsed
    }

    saveLoc(x: number, y: number) {
        this.lastX = x
        this.lastY = y
        this.lastLocIsSaved = true
        this.lastLocSavedIsUsed = true

        if (!this.unitLastClic) {
            this.unitLastClic = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
        } else {
            SetUnitX(this.unitLastClic, x)
            SetUnitY(this.unitLastClic, y)
        }

        this.escaper.destroyCancelledActions()
    }

    unsaveLoc() {
        if (!this.lastLocSavedIsUsed) {
            return false
        }

        this.unitLastClic && RemoveUnit(this.unitLastClic)
        this.lastLocSavedIsUsed = false

        return true
    }

    unsaveLocDefinitely() {
        this.unsaveLoc()
        this.lastLocIsSaved = false
    }

    cancelLastAction() {
        return this.unsaveLoc()
    }

    redoLastAction() {
        if (this.lastLocIsSaved && !this.lastLocSavedIsUsed) {
            this.saveLoc(this.lastX, this.lastY)
            return true
        }
        return false
    }

    getMode() {
        return this.mode
    }

    doActions() {
        if (super.doBaseActions()) {
            //modes : oneByOne, twoClics
            let caster: Caster
            let suppressedCasters: Caster[] = []
            let nbCastersRemoved = 0
            let i: number

            if (this.getMode() == 'oneByOne') {
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
                        BasicFunctions.IsUnitBetweenLocs(
                            caster.casterUnit,
                            this.lastX,
                            this.lastY,
                            this.orderX,
                            this.orderY
                        )
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
