import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { udg_terrainTypes } from '../../../../globals'
import { Modify_terrain_functions } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainFunctions } from '../Modify_terrain_Functions/Terrain_functions'
import { TerrainTypeFromString } from '../Modify_terrain_Functions/Terrain_type_from_string'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initChangeOneTerrain = () => {
    let oldTerrain: number
    let newTerrain: number
    let terrainModifyWorking = false

    const StartTerrainModifying = () => {
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x: number
            //local integer i = 1
            //loop
            //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                if (GetTerrainType(x, y) === oldTerrain) {
                    Modify_terrain_functions.ChangeTerrainType(x, y, newTerrain)
                }
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                DisableTrigger(GetTriggeringTrigger())
                TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                terrainModifyWorking = false
                return
            }
            //i = i + 1
            //endloop
        })
        let y = Constants.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const ChangeOneTerrain = (terrainTypeLabel: string, newTerrainType: string) => {
        let terrainType: TerrainType
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return null
        }
        terrainType = udg_terrainTypes.get(terrainTypeLabel)
        if (terrainType === 0) {
            return null
        }
        oldTerrain = terrainType.getTerrainTypeId()
        newTerrain = TerrainTypeFromString.TerrainTypeString2TerrainTypeId(newTerrainType)
        if (newTerrain === 0) {
            return null
        }
        if (udg_terrainTypes.isTerrainTypeIdAlreadyUsed(newTerrain)) {
            return null
        }
        if (!terrainType.setTerrainTypeId(newTerrain)) {
            return null
        }

        StartTerrainModifying()
        return TerrainFunctions.GetTerrainData(newTerrain)
    }

    return { ChangeOneTerrain }
}

export const ChangeOneTerrain = initChangeOneTerrain()
