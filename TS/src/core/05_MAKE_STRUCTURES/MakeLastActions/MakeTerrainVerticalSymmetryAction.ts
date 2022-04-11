import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { ArrayHandler } from '../../../Utils/ArrayHandler'
import { ChangeTerrainType } from '../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { MakeAction } from './MakeAction'

export class MakeTerrainVerticalSymmetryAction extends MakeAction {
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super()

        this.minX = RMinBJ(x1, x2)
        this.maxX = RMaxBJ(x1, x2)
        this.minY = RMinBJ(y1, y2)
        this.maxY = RMaxBJ(y1, y2)

        //pour éviter les ptits décalages
        this.minX = I2R(R2I(this.minX / LARGEUR_CASE)) * LARGEUR_CASE
        this.minY = I2R(R2I(this.minY / LARGEUR_CASE)) * LARGEUR_CASE
        this.maxX = I2R(R2I(this.maxX / LARGEUR_CASE)) * LARGEUR_CASE
        this.maxY = I2R(R2I(this.maxY / LARGEUR_CASE)) * LARGEUR_CASE

        this.applySymmetry()
        this.isActionMadeB = true
    }

    applySymmetry = () => {
        const terrainTypeIds = ArrayHandler.getNewArray<number>()

        //sauvegarde du terrain
        let i = 0
        let x = this.minX
        let y = this.minY

        while (y <= this.maxY) {
            while (x <= this.maxX) {
                terrainTypeIds[i] = GetTerrainType(x, y)
                i = i + 1
                x = x + LARGEUR_CASE
            }
            x = this.minX
            y = y + LARGEUR_CASE
        }

        //application de la symétrie
        i = 0
        x = this.minX
        y = this.maxY

        while (y >= this.minY) {
            while (x <= this.maxX) {
                ChangeTerrainType(x, y, terrainTypeIds[i])
                i = i + 1
                x = x + LARGEUR_CASE
            }
            x = this.minX
            y = y - LARGEUR_CASE
        }

        ArrayHandler.clearArray(terrainTypeIds)
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }

        this.applySymmetry()
        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain vertical symmetry cancelled')

        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }

        this.applySymmetry()
        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'terrain vertical symmetry redone')

        return true
    }

    destroy = () => {
        //nothing needed
    }
}
