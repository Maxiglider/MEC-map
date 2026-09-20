import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgTerrainTypes } from '../../../../globals'
import { arrayPush, outOfBounds, roundCoordinateToCenterOfTile } from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import { TerrainType } from '../../04_STRUCTURES/TerrainType/TerrainType'
import { ChangeTerrainType } from '../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions'
import { BrushShape, isInBrushShape } from '../Make/BrushShape'
import { MakeHoldClick } from '../Make/MakeHoldClick'
import { MakeTerrainCreateBrushAction } from '../MakeLastActions/MakeTerrainCreateBrushAction'

export interface ChangingTile {
    x: number
    y: number
    terrainTypeBefore: TerrainType
    terrainTypeAfter: TerrainType
}

export class MakeTerrainCreateBrush extends MakeHoldClick {
    private terrainType: TerrainType
    private shape: 'square' | 'circle'
    private changingTiles?: ChangingTile[]

    constructor(escaper: Escaper, terrainType: TerrainType, brushSize: number, shape: 'square' | 'circle' = 'square') {
        super(escaper, 'terrainCreateBrush', false)
        this.terrainType = terrainType
        escaper.setBrushSize(brushSize)
        this.shape = shape
    }

    doMouseMoveActions() {
        if (super.doMouseMoveActions()) {
            let terrainTypeToApply: TerrainType | null = null
            let shapeToApply = 'square'
            let sizeToApply = 1

            if (this.activeBtn == MOUSE_BUTTON_TYPE_RIGHT) {
                terrainTypeToApply = this.terrainType
                shapeToApply = this.shape
                sizeToApply = this.escaper.getBrushSize()
            } else if (this.activeBtn == MOUSE_BUTTON_TYPE_LEFT) {
                const gumTerrainType = this.escaper.getGumTerrain()
                if (gumTerrainType) {
                    terrainTypeToApply = gumTerrainType
                    sizeToApply = this.escaper.getGumBrushSize()
                }
            }

            if (terrainTypeToApply) {
                const centerX = roundCoordinateToCenterOfTile(this.escaper.mouseX)
                const centerY = roundCoordinateToCenterOfTile(this.escaper.mouseY)
                const offset = (sizeToApply - 1) * Constants.LARGEUR_CASE

                for (let x = centerX - offset; x <= centerX + offset; x += Constants.LARGEUR_CASE) {
                    for (let y = centerY - offset; y <= centerY + offset; y += Constants.LARGEUR_CASE) {
                        if (!outOfBounds(x, y)) {
                            const terrainType = getUdgTerrainTypes().getTerrainType(x, y)
                            if (terrainType && terrainType != terrainTypeToApply) {
                                //remove some tile changes in circle mode
                                if (
                                    !isInBrushShape(
                                        shapeToApply as BrushShape,
                                        x,
                                        y,
                                        centerX,
                                        centerY,
                                        offset,
                                        sizeToApply
                                    )
                                ) {
                                    continue
                                }

                                //change tile
                                ChangeTerrainType(x, y, terrainTypeToApply.getTerrainTypeId())

                                //memorize for cancel/redo
                                this.changingTiles &&
                                    arrayPush(this.changingTiles, {
                                        x: x,
                                        y: y,
                                        terrainTypeBefore: terrainType,
                                        terrainTypeAfter: terrainTypeToApply,
                                    })
                            }
                        }
                    }
                }
            }

            return true
        }

        return false
    }

    doPressActions() {
        this.changingTiles = MemoryHandler.getEmptyArray()

        super.doPressActions()
    }

    doUnpressActions() {
        super.doUnpressActions()

        //create a make action
        if (this.changingTiles && this.changingTiles.length > 0) {
            const action = new MakeTerrainCreateBrushAction(this.changingTiles)
            this.escaper.newAction(action)
            this.changingTiles && MemoryHandler.destroyArray(this.changingTiles)
        }
    }

    destroy() {
        super.destroy()
    }
}
