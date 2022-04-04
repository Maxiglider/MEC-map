import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import {Text} from "../../01_libraries/Text";
import {GetTerrainData} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_functions";
import {TerrainTypeMax} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_max";
import {TerrainTypeNamesAndData} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data";

export class MakeGetTerrainType extends Make {
    constructor(maker: unit) {
        super(maker, 'getTerrainType', false)
    }

    doActions = () => {
        if(super.doBaseActions()){
            const terrainData = GetTerrainData(GetTerrainType(this.orderX, this.orderY))
            terrainData && Text.P(this.makerOwner, terrainData)
        }
    }
}
