import {MakeHoldClick} from "../Make/MakeHoldClick";
import {TerrainType} from "../../04_STRUCTURES/TerrainType/TerrainType";
import {getUdgEscapers, getUdgTerrainTypes, globals} from "../../../../globals";
import {LARGEUR_CASE} from "../../01_libraries/Constants";
import {saveTerrainType2Dims} from "../../07_TRIGGERS/Save_map_in_gamecache/Save_terrain";
import {ArrayHandler} from "../../../Utils/ArrayHandler";
import {MakeTerrainCreateBrushAction} from "../MakeLastActions/MakeTerrainCreateBrushAction";
import {roundCoordinateToCenterOfTile} from "../../01_libraries/Basic_functions";

export class MakeTerrainCreateBrush extends MakeHoldClick{
    private terrainType: TerrainType
    private brushSize: number
    private shape: 'square' | 'circle'
    private mapTerrainTypesSave?: (TerrainType | null)[][]

    constructor(player: player, terrainType: TerrainType, brushSize: number, shape: 'square' | 'circle' = 'square') {
        super(player, 'terrainCreateBrush', false)
        this.terrainType = terrainType
        this.brushSize = brushSize
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
                sizeToApply = this.brushSize
            } else {
                const escaper = getUdgEscapers().get(GetPlayerId(this.makerOwner))
                const gumTerrainType = escaper.getGumTerrain()
                if(gumTerrainType) {
                    terrainTypeToApply = gumTerrainType
                    sizeToApply = escaper.getGumBrushSize()
                }
            }

            if(terrainTypeToApply){
                const shapeInt = shapeToApply == 'square' ? 1 : 0
                SetTerrainType(this.mouseX, this.mouseY, terrainTypeToApply.getTerrainTypeId(), -1, sizeToApply, shapeInt)
            }else{

            }

            return true
        }

        return false
    }

    doPressActions() {
        this.mapTerrainTypesSave && ArrayHandler.clearArrayOfArray(this.mapTerrainTypesSave)
        this.mapTerrainTypesSave = saveTerrainType2Dims()

        super.doPressActions()
    }

    doUnpressActions() {
        super.doUnpressActions()

        if(!this.mapTerrainTypesSave){
            return
        }

        //create a make action
        const brushSize = this.activeBtn == MOUSE_BUTTON_TYPE_LEFT ? this.escaper.getGumBrushSize() : this.brushSize
        const offset = (brushSize - 1) * LARGEUR_CASE

        const minX = RMaxBJ(roundCoordinateToCenterOfTile(this.currentClickMinX - offset), globals.MAP_MIN_X)
        const minY = RMaxBJ(roundCoordinateToCenterOfTile(this.currentClickMinY - offset), globals.MAP_MIN_Y)
        const maxX = RMinBJ(roundCoordinateToCenterOfTile(this.currentClickMaxX + offset), globals.MAP_MAX_X)
        const maxY = RMinBJ(roundCoordinateToCenterOfTile(this.currentClickMaxY + offset), globals.MAP_MAX_Y)

        const mapStartX = Math.floor((minX - globals.MAP_MIN_X) / LARGEUR_CASE)
        const mapStartY = Math.floor((minY - globals.MAP_MIN_Y) / LARGEUR_CASE)

        //get terrain before and after
        const terrainBefore: (TerrainType | null)[][] = ArrayHandler.getNewArray()
        const terrainAfter: (TerrainType | null)[][] = ArrayHandler.getNewArray()

        let xInd = 0
        for(let x = minX; x <= maxX; x += LARGEUR_CASE){
            let yInd = 0
            for(let y = minY; y <= maxY; y += LARGEUR_CASE){
                !terrainBefore[xInd] && (terrainBefore[xInd] = ArrayHandler.getNewArray())
                terrainBefore[xInd][yInd] = this.mapTerrainTypesSave[xInd + mapStartX][yInd + mapStartY]

                !terrainAfter[xInd] && (terrainAfter[xInd] = ArrayHandler.getNewArray())
                terrainAfter[xInd][yInd] = getUdgTerrainTypes().getTerrainType(x, y)

                yInd++
            }

            xInd++
        }

        //creating the action
        const action = new MakeTerrainCreateBrushAction(terrainBefore, terrainAfter, minX, minY, maxX, maxY)
        this.escaper.newAction(action)
    }

    destroy() {
        super.destroy()
        this.mapTerrainTypesSave && ArrayHandler.clearArrayOfArray(this.mapTerrainTypesSave)
    }
}