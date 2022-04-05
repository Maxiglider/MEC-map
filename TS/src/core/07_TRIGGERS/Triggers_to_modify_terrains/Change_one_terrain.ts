import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { getUdgTerrainTypes } from '../../../../globals'
import { errorHandler } from '../../../Utils/mapUtils'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { GetTerrainData } from '../Modify_terrain_Functions/Terrain_functions'
import { TerrainTypeFromString } from '../Modify_terrain_Functions/Terrain_type_from_string'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initChangeOneTerrain = () => {
    let oldTerrain: number
    let newTerrain: number
    let terrainModifyWorking = false

    const StartTerrainModifying = () => {
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(
            TerrainModifyingTrig.gg_trg_Terrain_modifying_trig,
            errorHandler(() => {
                let x: number
                //local integer i = 1
                //loop
                //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
                x = Constants.MAP_MIN_X
                while (true) {
                    if (x > Constants.MAP_MAX_X) break
                    if (GetTerrainType(x, y) === oldTerrain) {
                        ChangeTerrainType(x, y, newTerrain)
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
        )
        let y = Constants.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const ChangeOneTerrain = (terrainTypeLabel: string, newTerrainType: string) => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return null
        }
        const terrainType = getUdgTerrainTypes().get(terrainTypeLabel)
        if (terrainType === null) {
            return null
        }
        oldTerrain = terrainType.getTerrainTypeId()
        newTerrain = TerrainTypeFromString.TerrainTypeString2TerrainTypeId(newTerrainType)
        if (newTerrain === 0) {
            return null
        }
        if (getUdgTerrainTypes().isTerrainTypeIdAlreadyUsed(newTerrain)) {
            return null
        }
        if (!terrainType.setTerrainTypeId(newTerrain)) {
            return null
        }

        StartTerrainModifying()
        return GetTerrainData(newTerrain)
    }

    return { ChangeOneTerrain }
}

export const ChangeOneTerrain = initChangeOneTerrain()
