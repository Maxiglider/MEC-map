class MakeTerrainCopyPasteAction {
    // extends MakeAction

    static terrainSavesBefore: hashtable
    static terrainSavesAfter: hashtable
    static terrainSaveLastId: integer

    private terrainSaveId: integer
    private minX: real
    private minY: real
    private maxX: real
    private maxY: real

    private static onInit = (): void => {
        MakeTerrainCopyPasteAction.terrainSavesBefore = InitHashtable()
        MakeTerrainCopyPasteAction.terrainSavesAfter = InitHashtable()
        MakeTerrainCopyPasteAction.terrainSaveLastId = -1
    }

    static newTerrainSaveId = (): number => {
        MakeTerrainCopyPasteAction.terrainSaveLastId = MakeTerrainCopyPasteAction.terrainSaveLastId + 1
        return MakeTerrainCopyPasteAction.terrainSaveLastId
    }

    static removeTerrainSave = (terrainSaveId: number): void => {
        FlushChildHashtable(MakeTerrainCopyPasteAction.terrainSavesBefore, terrainSaveId)
        FlushChildHashtable(MakeTerrainCopyPasteAction.terrainSavesAfter, terrainSaveId)
    }

    static create = (
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number
    ): MakeTerrainCopyPasteAction => {
        let a: MakeTerrainCopyPasteAction
        let xCopy: number
        let yCopy: number
        let xPaste: number
        let yPaste: number
        let i: number
        let terrainType: TerrainType
        let terrainTypeId: number

        let minXcopy = RMinBJ(x1, x2)
        let maxXcopy = RMaxBJ(x1, x2)
        let minYcopy = RMinBJ(y1, y2)
        let maxYcopy = RMaxBJ(y1, y2)

        let diffX = maxXcopy - minXcopy
        let diffY = maxYcopy - minYcopy

        let minXpaste: number
        let minYpaste: number
        if (x4 > x3) {
            //direction droite
            minXpaste = x3
        } else {
            //direction gauche
            minXpaste = x3 - diffX
        }
        if (y4 > y3) {
            //direction haut
            minYpaste = y3
        } else {
            //direction bas
            minYpaste = y3 - diffY
        }

        if (
            minXpaste < MAP_MIN_X ||
            minXpaste + diffX > MAP_MAX_X ||
            minYpaste < MAP_MIN_Y ||
            minYpaste + diffY > MAP_MAX_Y
        ) {
            return 0
        }
        a = MakeTerrainCopyPasteAction.allocate()
        a.terrainSaveId = MakeTerrainCopyPasteAction.newTerrainSaveId()
        a.minX = minXpaste
        a.minY = minYpaste
        a.maxX = minXpaste + diffX
        a.maxY = minYpaste + diffY

        i = 0
        xPaste = minXpaste
        yPaste = minYpaste
        xCopy = minXcopy
        yCopy = minYcopy
        while (true) {
            if (yCopy > maxYcopy) break
            while (true) {
                if (xCopy > maxXcopy) break
                SaveInteger(
                    MakeTerrainCopyPasteAction.terrainSavesBefore,
                    a.terrainSaveId,
                    i,
                    integer(udg_terrainTypes.getTerrainType(xPaste, yPaste))
                )
                terrainType = udg_terrainTypes.getTerrainType(xCopy, yCopy)
                SaveInteger(
                    MakeTerrainCopyPasteAction.terrainSavesAfter,
                    a.terrainSaveId,
                    i,
                    integer(udg_terrainTypes.getTerrainType(xCopy, yCopy))
                )
                if (terrainType !== 0) {
                    terrainTypeId = terrainType.getTerrainTypeId()
                    if (terrainTypeId !== 0) {
                        ChangeTerrainType(xPaste, yPaste, terrainTypeId)
                    }
                }
                i = i + 1
                xPaste = xPaste + LARGEUR_CASE
                xCopy = xCopy + LARGEUR_CASE
            }
            xPaste = minXpaste
            xCopy = minXcopy
            yPaste = yPaste + LARGEUR_CASE
            yCopy = yCopy + LARGEUR_CASE
        }
        a.isActionMadeB = true
        return a
    }

    private onDestroy = (): void => {
        MakeTerrainCopyPasteAction.removeTerrainSave(this.terrainSaveId)
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
                terrainType = TerrainType(
                    LoadInteger(MakeTerrainCopyPasteAction.terrainSavesBefore, this.terrainSaveId, i)
                )
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
                terrainType = TerrainType(
                    LoadInteger(MakeTerrainCopyPasteAction.terrainSavesAfter, this.terrainSaveId, i)
                )
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

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }
        this.terrainModificationCancel()
        this.isActionMadeB = false
        Text_mkP(this.owner.getPlayer(), 'terrain copy/paste cancelled')
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }
        this.terrainModificationRedo()
        this.isActionMadeB = true
        Text_mkP(this.owner.getPlayer(), 'terrain copy/paste redone')
        return true
    }
}
