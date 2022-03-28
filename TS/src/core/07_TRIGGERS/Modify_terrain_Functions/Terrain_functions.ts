import { NB_MAX_OF_TERRAINS, RED, TERRAIN_DATA_DISPLAY_TIME } from 'core/01_libraries/Constants'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { TerrainTypeFunctions } from '../../04_STRUCTURES/TerrainType/Terrain_type_functions'
import { TerrainTypeMax } from './Terrain_type_max'
import { TerrainTypeNamesAndData } from './Terrain_type_names_and_data'

const initTerrainFunctions = () => {
    const IsTerrainAlreadyUsed = (terrainType: number): boolean => {
        let i = 0
        while (true) {
            if (Globals.udg_used_terrain_types[i] === 0) break
            if (Globals.udg_used_terrain_types[i] === terrainType) {
                return true
            }
            i = i + 1
        }
        return false
    }

    const IsTerrainsLimitNumberReached = (): boolean => {
        return Globals.udg_nb_used_terrains === NB_MAX_OF_TERRAINS
    }

    const AddNewTerrain = (newTerrain: number): boolean => {
        if (IsTerrainsLimitNumberReached() || IsTerrainAlreadyUsed(newTerrain)) {
            return false
        }
        Globals.udg_used_terrain_types[Globals.udg_nb_used_terrains] = newTerrain
        Globals.udg_nb_used_terrains = Globals.udg_nb_used_terrains + 1
        return true
    }

    const CanUseTerrain = (terrainType: number): boolean => {
        if (IsTerrainAlreadyUsed(terrainType)) {
            return true
        }
        return AddNewTerrain(terrainType)
    }

    const GetRandomTerrain = (): number => {
        return TerrainTypeMax.TerrainTypeMaxId2TerrainTypeId(GetRandomInt(1, TerrainTypeNamesAndData.NB_TERRAINS_TOTAL))
    }

    const GetRandomUsedTerrain = (): number => {
        return Globals.udg_used_terrain_types[GetRandomInt(0, Globals.udg_nb_used_terrains - 1)]
    }

    const GetRandomNotUsedTerrain = (): number => {
        let terrainType: number
        while (true) {
            terrainType = GetRandomTerrain()
            if (!IsTerrainAlreadyUsed(terrainType)) break
        }
        return terrainType
    }

    const GetTerrainName = (terrain: number) => {
        if (terrain > TerrainTypeNamesAndData.NB_TERRAINS_TOTAL) {
            return TerrainTypeNamesAndData.TERRAIN_TYPE_NAMES[TerrainTypeMax.TerrainTypeId2TerrainTypeMaxId(terrain)]
        }

        if (terrain <= 0) {
            return null
        }

        return TerrainTypeNamesAndData.TERRAIN_TYPE_NAMES[terrain]
    }

    const GetTerrainData = (terrain: number) => {
        //GetTerrainData('Nice') == "46 : Northrend - Glace    'Nice'"
        let str: string
        let maxId: number
        let terrainType: TerrainType

        if (terrain > TerrainTypeNamesAndData.NB_TERRAINS_TOTAL) {
            maxId = TerrainTypeMax.TerrainTypeId2TerrainTypeMaxId(terrain)
        } else {
            if (terrain > 0) {
                maxId = terrain
                terrain = TerrainTypeMax.TerrainTypeMaxId2TerrainTypeId(maxId)
            } else {
                return null
            }
        }
        str = ColorCodes.udg_colorCode[RED] + TerrainTypeNamesAndData.TERRAIN_TYPE_DATA[maxId]

        terrainType = TerrainTypeFunctions.TerrainTypeId2TerrainType(terrain)
        if (terrainType !== 0) {
            if (terrainType.getKind() == 'slide') {
                str = str + ColorCodes.COLOR_TERRAIN_SLIDE
            } else {
                if (terrainType.getKind() == 'walk') {
                    str = str + ColorCodes.COLOR_TERRAIN_WALK
                } else {
                    str = str + ColorCodes.COLOR_TERRAIN_DEATH
                }
            }
            str = str + '        ' + terrainType.label
            if (terrainType.theAlias != null) {
                str = str + '  ' + terrainType.theAlias
            }
        }

        return str
    }

    const DisplayTerrainDataToPlayer = (p: player, terrain: number) => {
        DisplayTimedTextToPlayer(p, 0, 0, TERRAIN_DATA_DISPLAY_TIME, TerrainFunctions.GetTerrainData(terrain)!)
    }

    return {
        IsTerrainAlreadyUsed,
        IsTerrainsLimitNumberReached,
        AddNewTerrain,
        CanUseTerrain,
        GetRandomTerrain,
        GetRandomUsedTerrain,
        GetRandomNotUsedTerrain,
        GetTerrainName,
        GetTerrainData,
        DisplayTerrainDataToPlayer,
    }
}

export const TerrainFunctions = initTerrainFunctions()
