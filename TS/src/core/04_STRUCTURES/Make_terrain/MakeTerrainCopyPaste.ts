import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeTerrainCopyPaste extends Make {
    x1: real
    y1: real
    x2: real
    y2: real
    x3: real
    y3: real
    private unitLastClic1: unit
    private unitLastClic2: unit
    private unitLastClic3: unit
    private isPoint1Saved: boolean
    private isPoint2Saved: boolean
    private isPoint3Saved: boolean
    private isPoint1Used: boolean
    private isPoint2Used: boolean
    private isPoint3Used: boolean

    // TODO; Used to be static
    create = (maker: unit): MakeTerrainCopyPaste => {
        let m: MakeTerrainCopyPaste
        if (maker === null) {
            return 0
        }
        m = MakeTerrainCopyPaste.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'terrainCopyPaste'
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        m.isPoint1Saved = false
        m.isPoint2Saved = false
        m.isPoint3Saved = false
        m.isPoint1Used = false
        m.isPoint2Used = false
        m.isPoint3Used = false
        return m
    }

    destroy = () => {
        DestroyTrigger(this.t)
        this.t = null
        RemoveUnit(this.unitLastClic1)
        this.unitLastClic1 = null
        RemoveUnit(this.unitLastClic2)
        this.unitLastClic2 = null
        RemoveUnit(this.unitLastClic3)
        this.unitLastClic3 = null
        this.maker = null
    }

    private createUnitClic = (u: unit, x: number, y: number): unit => {
        if (u === null) {
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
            RemoveUnit(this.unitLastClic1)
            this.unitLastClic1 = null
        } else {
            if (locId === 2) {
                this.isPoint2Used = false
                RemoveUnit(this.unitLastClic2)
                this.unitLastClic2 = null
            } else {
                if (locId === 3) {
                    this.isPoint3Used = false
                    RemoveUnit(this.unitLastClic3)
                    this.unitLastClic3 = null
                }
            }
        }
    }

    unsaveLocDefinitely = (locId: number) => {
        this.unsaveLoc(locId)
        if (locId === 1) {
            this.isPoint1Saved = false
        } else {
            if (locId === 2) {
                this.isPoint2Saved = false
            } else {
                if (locId === 3) {
                    this.isPoint3Saved = false
                }
            }
        }
    }

    unsaveLocsDefinitely = () => {
        this.unsaveLocDefinitely(1)
        this.unsaveLocDefinitely(2)
        this.unsaveLocDefinitely(3)
    }

    saveLoc = (x: number, y: number) => {
        let action: MakeAction
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
                if (GetNbCaseBetween(this.x1, this.y1, x, y) > NB_MAX_TILES_MODIFIED) {
                    Text.erP(this.makerOwner, 'Too big zone !')
                    return
                }
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
                    action = MakeTerrainCopyPasteAction.create(
                        this.x1,
                        this.y1,
                        this.x2,
                        this.y2,
                        this.x3,
                        this.y3,
                        x,
                        y
                    )
                    if (action !== 0) {
                        this.unsaveLocsDefinitely()
                        EscaperFunctions.Hero2Escaper(this.maker).newAction(action)
                    } else {
                        Text.erP(this.makerOwner, 'paste zone out of bounds')
                    }
                }
            }
        }
        EscaperFunctions.Hero2Escaper(this.maker).destroyCancelledActions()
    }

    cancelLastAction = (): boolean => {
        if (this.isPoint3Used) {
            this.unsaveLoc(3)
            return true
        } else {
            if (this.isPoint2Used) {
                this.unsaveLoc(2)
                return true
            } else {
                if (this.isPoint1Used) {
                    this.unsaveLoc(1)
                    return true
                }
            }
        }
        return false
    }

    redoLastAction = (): boolean => {
        if (this.isPoint1Saved && !this.isPoint1Used) {
            this.saveLoc(this.x1, this.y1)
            return true
        } else {
            if (this.isPoint2Saved && !this.isPoint2Used) {
                this.saveLoc(this.x2, this.y2)
                return true
            } else {
                if (this.isPoint3Saved && !this.isPoint3Used) {
                    this.saveLoc(this.x3, this.y3)
                    return true
                }
            }
        }
        return false
    }
}
