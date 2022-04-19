import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from '../../01_libraries/Text'
import { TerrainType } from '../../04_STRUCTURES/TerrainType/TerrainType'
import {
    ChangeTerrainType,
} from '../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { MakeAction } from './MakeAction'
import {ArrayHandler} from "../../../Utils/ArrayHandler";

export class MakeTerrainCreateBrushAction extends MakeAction {
    private terrainTypesBefore: (TerrainType | null)[][]
    private terrainTypesAfter: (TerrainType | null)[][]

    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    constructor(terrainTypesBefore: (TerrainType | null)[][], terrainTypesAfter: (TerrainType | null)[][], x1: number, y1: number, x2: number, y2: number) {
        super()

        this.minX = RMinBJ(x1, x2)
        this.maxX = RMaxBJ(x1, x2)
        this.minY = RMinBJ(y1, y2)
        this.maxY = RMaxBJ(y1, y2)

        this.terrainTypesBefore = terrainTypesBefore
        this.terrainTypesAfter = terrainTypesAfter
    }

    destroy = () => {
        ArrayHandler.clearArrayOfArray(this.terrainTypesBefore)
        ArrayHandler.clearArrayOfArray(this.terrainTypesAfter)
    }

    private applyTerrainModification = (terrainTypes: (TerrainType | null)[][]) => {
        let x = this.minX
        let y = this.minY
        let yInd = 0

        while (y <= this.maxY) {
            let xInd = 0

            while (x <= this.maxX) {
                const terrainType = terrainTypes[xInd][yInd]
                if (terrainType && terrainType.getTerrainTypeId() != 0) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }

                xInd++
                x = x + LARGEUR_CASE
            }
            x = this.minX

            yInd++
            y = y + LARGEUR_CASE
        }
    }

    terrainModificationCancel = () => {
        this.applyTerrainModification(this.terrainTypesBefore)
    }

    terrainModificationRedo = () => {
        this.applyTerrainModification(this.terrainTypesAfter)
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }

        this.terrainModificationCancel()
        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain creation cancelled')

        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }

        this.terrainModificationRedo()
        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain creation redone')

        return true
    }
}
