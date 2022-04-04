import {Make, MAKE_LAST_CLIC_UNIT_ID} from 'core/05_MAKE_STRUCTURES/Make/Make'


export abstract class MakeOneByOneOrTwoClicks extends Make {
    lastX: number = 0
    lastY: number = 0

    private lastLocIsSaved: boolean
    private lastLocSavedIsUsed: boolean
    private unitLastClic?: unit
    private mode: string
    private acceptedModes: string[] = ['oneByOne', 'twoClics']

    constructor(maker: unit, kind: string, mode: string = "", acceptedModes: string[] | null = null, forSpecificLevel = true) {
        //modes : oneByOne, twoClics
        super(maker, kind, forSpecificLevel)

        if (acceptedModes) {
            this.acceptedModes = acceptedModes
        }

        if (!this.acceptedModes.includes(mode)) {
            throw this.constructor.name + ' : wrong mode "' + mode + '"'
        }

        this.mode = mode
        this.lastLocIsSaved = false
        this.lastLocSavedIsUsed = false
    }

    isLastLocSavedUsed = () => {
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

    unsaveLoc = () => {
        if (!this.lastLocSavedIsUsed) {
            return false
        }

        this.unitLastClic && RemoveUnit(this.unitLastClic)
        this.lastLocSavedIsUsed = false

        return true
    }

    unsaveLocDefinitely = () => {
        this.unsaveLoc()
        this.lastLocIsSaved = false
    }

    cancelLastAction = () => {
        return this.unsaveLoc()
    }

    redoLastAction = () => {
        if (this.lastLocIsSaved && !this.lastLocSavedIsUsed) {
            this.saveLoc(this.lastX, this.lastY)
            return true
        }
        return false
    }

    getMode = () => {
        return this.mode
    }

    destroy = () => {
        super.destroy()

        if (this.unitLastClic) {
            RemoveUnit(this.unitLastClic)
        }
    }
}
