class MakeTerrainCreateAction {
    // extends MakeAction

    static terrainSaves: hashtable
    static terrainSaveLastId: integer

    private terrainSaveId: integer
    private terrainTypeNew: TerrainType
    private minX: real
    private minY: real
    private maxX: real
    private maxY: real

    private static onInit = (): void => {
        MakeTerrainCreateAction.terrainSaves = InitHashtable()
        MakeTerrainCreateAction.terrainSaveLastId = -1
    }

    static newTerrainSaveId = (): number => {
        MakeTerrainCreateAction.terrainSaveLastId = MakeTerrainCreateAction.terrainSaveLastId + 1
        return MakeTerrainCreateAction.terrainSaveLastId
    }

    static removeTerrainSave = (terrainSaveId: number): void => {
        FlushChildHashtable(MakeTerrainCreateAction.terrainSaves, terrainSaveId)
    }

    static create = (
        terrainTypeNew: TerrainType,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): MakeTerrainCreateAction => {
        let terrainSave: hashtable
        let terrainSaveId: number
        let a: MakeTerrainCreateAction
        let x: number
        let y: number
        let i: number

        let minX = RMinBJ(x1, x2)
        let maxX = RMaxBJ(x1, x2)
        let minY = RMinBJ(y1, y2)
        let maxY = RMaxBJ(y1, y2)
        if (terrainTypeNew == 0 || terrainTypeNew.getTerrainTypeId() == 0) {
            return -1
        }
        if (GetNbCaseBetween(minX, minY, maxX, maxY) > NB_MAX_TILES_MODIFIED) {
            return 0
        }
        a = MakeTerrainCreateAction.allocate()
        terrainSave = MakeTerrainCreateAction.terrainSaves
        a.terrainSaveId = MakeTerrainCreateAction.newTerrainSaveId()

        i = 0
        x = minX
        y = minY
        while (true) {
            if (y > maxY) break
            while (true) {
                if (x > maxX) break
                SaveInteger(terrainSave, a.terrainSaveId, i, integer(udg_terrainTypes.getTerrainType(x, y)))
                i = i + 1
                x = x + LARGEUR_CASE
            }
            x = minX
            y = y + LARGEUR_CASE
        }
        terrainSave = null
        ChangeTerrainBetween(terrainTypeNew.getTerrainTypeId(), minX, minY, maxX, maxY)
        a.terrainTypeNew = terrainTypeNew
        a.minX = minX
        a.maxX = maxX
        a.minY = minY
        a.maxY = maxY
        a.isActionMadeB = true
        return a
    }

    private onDestroy = (): void => {
        MakeTerrainCreateAction.removeTerrainSave(this.terrainSaveId)
    }

    terrainModificationCancel = (): void => {
        let terrainType: TerrainType
        let x: number
        let y: number
        let i: number

        i = 0
        x = this.minX
        y = this.minY
        while (true) {
            if (y > this.maxY) break
            while (true) {
                if (x > this.maxX) break
                terrainType = TerrainType(LoadInteger(MakeTerrainCreateAction.terrainSaves, this.terrainSaveId, i))
                if (terrainType != 0 && terrainType.getTerrainTypeId() != 0) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }
                i = i + 1
                x = x + LARGEUR_CASE
            }
            x = this.minX
            y = y + LARGEUR_CASE
        }
    }

    terrainModificationRedo = (): void => {
        let terrainTypeId = this.terrainTypeNew.getTerrainTypeId()
        if (terrainTypeId === 0) {
            Text_erP(this.owner.getPlayer(), "the terrain type for this action doesn't exist anymore")
        } else {
            ChangeTerrainBetween(terrainTypeId, this.minX, this.minY, this.maxX, this.maxY)
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }
        this.terrainModificationCancel()
        this.isActionMadeB = false
        Text_mkP(this.owner.getPlayer(), 'terrain creation cancelled')
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }
        this.terrainModificationRedo()
        this.isActionMadeB = true
        Text_mkP(this.owner.getPlayer(), 'terrain creation redone')
        return true
    }
}
