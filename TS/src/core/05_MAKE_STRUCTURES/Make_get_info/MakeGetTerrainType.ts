import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import {Text} from "../../01_libraries/Text";
import {GetTerrainData} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_functions";
import {TerrainTypeMax} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_max";
import {TerrainTypeNamesAndData} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data";

export class MakeGetTerrainType extends Make {
    constructor(maker: unit) {
        print('MakeGetTerrainType')
        super(maker, 'getTerrainType', false)
    }

    doActions() {
        const _this = super.doBaseActions()
        if(_this instanceof MakeGetTerrainType){
            const terrainData = GetTerrainData(GetTerrainType(_this.orderX, _this.orderY))
            terrainData && Text.P(_this.makerOwner, terrainData)
        }
    }
}
