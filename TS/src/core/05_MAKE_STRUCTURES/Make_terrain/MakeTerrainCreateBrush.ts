import {MakeHoldClick} from "../Make/MakeHoldClick";
import {TerrainType} from "../../04_STRUCTURES/TerrainType/TerrainType";
import {getUdgTerrainTypes} from "../../../../globals";
import {LARGEUR_CASE} from "../../01_libraries/Constants";
import {ArrayHandler} from "../../../Utils/ArrayHandler";
import {MakeTerrainCreateBrushAction} from "../MakeLastActions/MakeTerrainCreateBrushAction";
import {arrayPush, outOfBounds, roundCoordinateToCenterOfTile} from "../../01_libraries/Basic_functions";
import {ChangeTerrainType} from "../../07_TRIGGERS/Modify_terrain_Functions/Modify_terrain_functions";
import {Escaper} from "../../04_STRUCTURES/Escaper/Escaper";

export interface ChangingTile {
    x: number,
    y: number,
    terrainTypeBefore: TerrainType,
    terrainTypeAfter: TerrainType
}

export class MakeTerrainCreateBrush extends MakeHoldClick{
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
        if(super.doMouseMoveActions()){
            let terrainTypeToApply: TerrainType | null = null
            let shapeToApply = 'square'
            let sizeToApply = 1

            if(this.activeBtn == MOUSE_BUTTON_TYPE_RIGHT) {
                terrainTypeToApply = this.terrainType
                shapeToApply = this.shape
                sizeToApply = this.escaper.getBrushSize()
            } else {
                const gumTerrainType = this.escaper.getGumTerrain()
                if(gumTerrainType) {
                    terrainTypeToApply = gumTerrainType
                    sizeToApply = this.escaper.getGumBrushSize()
                }
            }

            if(terrainTypeToApply){
                const centerX = roundCoordinateToCenterOfTile(this.escaper.mouseX)
                const centerY = roundCoordinateToCenterOfTile(this.escaper.mouseY)
                const offset = (sizeToApply - 1) * LARGEUR_CASE

                for(let x = centerX - offset; x <= centerX + offset; x += LARGEUR_CASE){
                    for(let y = centerY - offset; y <= centerY + offset; y += LARGEUR_CASE) {
                        if(!outOfBounds(x, y)){
                            const terrainType = getUdgTerrainTypes().getTerrainType(x, y)
                            if(terrainType && terrainType != terrainTypeToApply){

                                //remove some tile changes in circle mode
                                if(shapeToApply == 'circle'){
                                    const diffXcenter = RAbsBJ(centerX - x)
                                    const diffYcenter = RAbsBJ(centerY - y)

                                    //remove edges except middles
                                    if(sizeToApply != 1){
                                        if(x != centerX && y != centerY && (x == centerX - offset || x == centerX + offset || y == centerY - offset || y == centerY + offset)){
                                            continue
                                        }
                                    }

                                    //remove 2nd line interior corners, leaving middle and tiles near
                                    if(sizeToApply >= 4){
                                        //up or down
                                        if(y == centerY + offset - LARGEUR_CASE || y == centerY - offset + LARGEUR_CASE){
                                            if(diffXcenter > LARGEUR_CASE * 2){
                                                continue
                                            }
                                        }

                                        //left or right
                                        if(x == centerX + offset - LARGEUR_CASE || x == centerX - offset + LARGEUR_CASE){
                                            if(diffYcenter > LARGEUR_CASE * 2){
                                                continue
                                            }
                                        }
                                    }

                                    //a little more corner for size 8
                                    if(sizeToApply == 8){
                                        if(diffXcenter == LARGEUR_CASE * 5 && diffYcenter == LARGEUR_CASE * 5){
                                            continue
                                        }
                                    }
                                }

                                //change tile
                                ChangeTerrainType(x, y, terrainTypeToApply.getTerrainTypeId())

                                //memorize for cancel/redo
                                this.changingTiles && arrayPush(this.changingTiles, {
                                    x: x,
                                    y: y,
                                    terrainTypeBefore: terrainType,
                                    terrainTypeAfter: terrainTypeToApply
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
        this.changingTiles = ArrayHandler.getNewArray()

        super.doPressActions()
    }

    doUnpressActions() {
        super.doUnpressActions()

        //create a make action
        if(this.changingTiles) {
            const action = new MakeTerrainCreateBrushAction(this.changingTiles)
            this.escaper.newAction(action)
        }
    }

    destroy() {
        super.destroy()
    }
}