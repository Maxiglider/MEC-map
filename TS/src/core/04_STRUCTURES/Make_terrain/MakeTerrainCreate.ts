import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeTerrainCreate extends Make {
    lastX: number
    lastY: number
    private lastLocIsSaved: boolean
    private lastLocSavedIsUsed: boolean
    private unitLastClic: unit
    private terrainType: TerrainType

    isLastLocSavedUsed = (): boolean => {
        return this.lastLocSavedIsUsed
    }

    getTerrainType = (): TerrainType => {
        return this.terrainType
    }

    // TODO; Used to be static
    create = (maker: unit, terrainType: TerrainType): MakeTerrainCreate => {
        let m: MakeTerrainCreate
        if (maker === null || terrainType === 0) {
            return 0
        }
        m = MakeTerrainCreate.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.terrainType = terrainType
        m.kind = 'terrainCreate'
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
