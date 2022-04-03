import { Text } from 'core/01_libraries/Text'
import {Make, MAKE_LAST_CLIC_UNIT_ID} from 'core/05_MAKE_STRUCTURES/Make/Make'
import {MakeTerrainCopyPasteAction} from "../MakeLastActions/MakeTerrainCopyPasteAction";

export class MakeTerrainCopyPaste extends Make {
    x1: number = 0
    y1: number = 0
    x2: number = 0
    y2: number = 0
    x3: number = 0
    y3: number = 0
    private unitLastClic1?: unit
    private unitLastClic2?: unit
    private unitLastClic3?: unit
    private isPoint1Saved: boolean
    private isPoint2Saved: boolean
    private isPoint3Saved: boolean
    private isPoint1Used: boolean
    private isPoint2Used: boolean
    private isPoint3Used: boolean


    constructor(maker: unit) {
        super(maker, 'terrainCopyPaste', false)

        this.isPoint1Saved = false
        this.isPoint2Saved = false
        this.isPoint3Saved = false
        this.isPoint1Used = false
        this.isPoint2Used = false
        this.isPoint3Used = false
    }

    destroy = () => {
        super.destroy()

        this.unitLastClic1 && RemoveUnit(this.unitLastClic1)
        this.unitLastClic2 && RemoveUnit(this.unitLastClic2)
        this.unitLastClic3 && RemoveUnit(this.unitLastClic3)
    }

    private createUnitClic = (u: unit | undefined, x: number, y: number): unit => {
        if (!u) {
            u = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
        } else {
            SetUnitX(u, x)
            SetUnitY(u, y)
        }
        return u
    }

    unsaveLoc = (locId: number) => {
        if (locId === 1) {
            this.isPoint1Used = false
            this.unitLastClic1 && RemoveUnit(this.unitLastClic1)
        } else if (locId === 2) {
            this.isPoint2Used = false
            this.unitLastClic2 && RemoveUnit(this.unitLastClic2)
        } else if (locId === 3) {
            this.isPoint3Used = false
            this.unitLastClic3 && RemoveUnit(this.unitLastClic3)
        }
    }

    unsaveLocDefinitely = (locId: number) => {
        this.unsaveLoc(locId)
        if (locId === 1) {
            this.isPoint1Saved = false
        } else if (locId === 2) {
            this.isPoint2Saved = false
        } else if (locId === 3) {
            this.isPoint3Saved = false
        }
    }


    unsaveLocsDefinitely = () => {
        this.unsaveLocDefinitely(1)
        this.unsaveLocDefinitely(2)
        this.unsaveLocDefinitely(3)
    }

    saveLoc = (x: number, y: number) => {
        if (!this.isPoint1Used) {
            this.unitLastClic1 = this.createUnitClic(this.unitLastClic1, x, y)
            this.x1 = x
            this.y1 = y
            this.isPoint1Saved = true
            this.isPoint1Used = true
            this.unsaveLocDefinitely(2)
            this.unsaveLocDefinitely(3)
        } else {
            if (!this.isPoint2Used) {
                this.unitLastClic2 = this.createUnitClic(this.unitLastClic2, x, y)
                this.x2 = x
                this.y2 = y
                this.isPoint2Saved = true
                this.isPoint2Used = true
                this.unsaveLocDefinitely(3)
            } else {
                if (!this.isPoint3Used) {
                    this.unitLastClic3 = this.createUnitClic(this.unitLastClic3, x, y)
                    this.x3 = x
                    this.y3 = y
                    this.isPoint3Saved = true
                    this.isPoint3Used = true
                } else {
                    try{
                        const action = new MakeTerrainCopyPasteAction(this.x1, this.y1, this.x2, this.y2, this.x3, this.y3, x, y)
                        this.unsaveLocsDefinitely()
                        this.escaper.newAction(action)
                    }catch(error){
                        if(typeof error == 'string')                        {
                            Text.erP(this.makerOwner, error)
                        }
                    }
                }
            }
        }

        this.escaper.destroyCancelledActions()
    }

    cancelLastAction = (): boolean => {
        if (this.isPoint3Used) {
            this.unsaveLoc(3)
            return true
        } else if (this.isPoint2Used) {
            this.unsaveLoc(2)
            return true
        } else if (this.isPoint1Used) {
            this.unsaveLoc(1)
            return true
        }

        return false
    }

    redoLastAction = (): boolean => {
        if (this.isPoint1Saved && !this.isPoint1Used) {
            this.saveLoc(this.x1, this.y1)
            return true
        } else if (this.isPoint2Saved && !this.isPoint2Used) {
            this.saveLoc(this.x2, this.y2)
            return true
        } else if (this.isPoint3Saved && !this.isPoint3Used) {
            this.saveLoc(this.x3, this.y3)
            return true
        }

        return false
    }

    doActions() {
        if(super.doBaseActions()){
            this.saveLoc(this.orderX, this.orderY)
        }
    }
}
