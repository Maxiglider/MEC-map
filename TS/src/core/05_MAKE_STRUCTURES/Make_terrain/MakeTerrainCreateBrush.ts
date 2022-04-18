import {MakeMaintainClick} from "../Make/MakeMaintainClick";
import {TerrainType} from "../../04_STRUCTURES/TerrainType/TerrainType";
import {getUdgEscapers} from "../../../../globals";

export class MakeTerrainCreateBrush extends MakeMaintainClick{
    private terrainType: TerrainType
    private brushSize: number
    private shape: 'square' | 'circle'

    constructor(player: player, terrainType: TerrainType, brushSize: number, shape: 'square' | 'circle' = 'square') {
        super(player, 'terrainCreateBrush', false)
        this.terrainType = terrainType
        this.brushSize = brushSize
        this.shape = shape
        print('MakeTerrainCreateBrush')
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
                const gumTerrainType = getUdgEscapers().get(GetPlayerId(this.makerOwner)).getGumTerrain()
                if(gumTerrainType) {
                    terrainTypeToApply = gumTerrainType
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
}