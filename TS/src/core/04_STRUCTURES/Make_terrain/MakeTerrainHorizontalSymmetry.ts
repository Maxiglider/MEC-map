import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeTerrainHorizontalSymmetry extends Make {
    lastX: real
    lastY: real
    private lastLocIsSaved: boolean
    private lastLocSavedIsUsed: boolean
    private unitLastClic: unit

    isLastLocSavedUsed = (): boolean => {
        return this.lastLocSavedIsUsed
    }

    // TODO; Used to be static
    create = (maker: unit): MakeTerrainHorizontalSymmetry => {
        let m: MakeTerrainHorizontalSymmetry
        if (maker === null) {
            return 0
        }
        m = MakeTerrainHorizontalSymmetry.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'terrainHorizontalSymmetry'
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        m.lastLocIsSaved = false
        m.lastLocSavedIsUsed = false
        return m
    }

    destroy = () => {
        DestroyTrigger(this.t)
        this.t = null
        RemoveUnit(this.unitLastClic)
        this.unitLastClic = null
        this.maker = null
    }

    saveLoc = (x: number, y: number) => {
        this.lastX = x
        this.lastY = y
        this.lastLocIsSaved = true
        this.lastLocSavedIsUsed = true
        if (this.unitLastClic === null) {
            this.unitLastClic = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
        } else {
            SetUnitX(this.unitLastClic, x)
            SetUnitY(this.unitLastClic, y)
        }
        EscaperFunctions.Hero2Escaper(this.maker).destroyCancelledActions()
    }

    unsaveLoc = (): boolean => {
        if (!this.lastLocSavedIsUsed) {
            return false
        }
        RemoveUnit(this.unitLastClic)
        this.unitLastClic = null
        this.lastLocSavedIsUsed = false
        return true
    }

    unsaveLocDefinitely = () => {
        this.unsaveLoc()
        this.lastLocIsSaved = false
    }

    cancelLastAction = (): boolean => {
        return this.unsaveLoc()
    }

    redoLastAction = (): boolean => {
        if (this.lastLocIsSaved && !this.lastLocSavedIsUsed) {
            this.saveLoc(this.lastX, this.lastY)
            return true
        }
        return false
    }
}
