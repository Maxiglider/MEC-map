import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeStart extends Make {
    lastX: number
    lastY: number
    private unitLastClic: unit
    private lastLocIsSaved: boolean
    private lastLocSavedIsUsed: boolean
    private forNextB: boolean //à true si on veut créer le start du niveau suivant

    // TODO; Used to be static
    create = (maker: unit, forNext: boolean): MakeStart => {
        let m: MakeStart
        if (maker === null) {
            return 0
        }
        m = MakeStart.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'startCreate'
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        m.lastLocIsSaved = false
        m.lastLocSavedIsUsed = false
        m.forNextB = forNext
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

    isLastLocSavedUsed = (): boolean => {
        return this.lastLocSavedIsUsed
    }

    cancelLastAction = (): boolean => {
        return this.unsaveLoc()
    }

    redoLastAction = (): boolean => {
        if (!this.lastLocSavedIsUsed && this.lastLocIsSaved) {
            this.saveLoc(this.lastX, this.lastY)
            return true
        }
        return false
    }

    forNext = (): boolean => {
        return this.forNextB
    }
}
