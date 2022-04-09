import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { getUdgTerrainTypes } from '../../../../globals'
import { errorHandler } from '../../../Utils/mapUtils'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'
import {globals} from "../../../../globals";

const initSaveLoadTerrainWithoutName = () => {
    let terrainSave: (TerrainType | null)[] = []
    let terrainSave_id: number
    let terrainModifyWorking = false

    //save terrain
    const SaveTerrainWithoutName = () => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(
            TerrainModifyingTrig.gg_trg_Terrain_modifying_trig,
            errorHandler(() => {
                let x = globals.MAP_MIN_X
                while (true) {
                    if (x > globals.MAP_MAX_X) break
                    terrainSave[terrainSave_id] = getUdgTerrainTypes().getTerrainType(x, y)
                    terrainSave_id = terrainSave_id + 1
                    x = x + LARGEUR_CASE
                }

                y = y + LARGEUR_CASE
                if (y > globals.MAP_MAX_Y) {
                    terrainModifyWorking = false
                    DisableTrigger(GetTriggeringTrigger())
                    Text.mkA('Terrain saved')
                    return
                }
            })
        )
        terrainSave_id = 0
        let y = globals.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    //load terrain
    const LoadTerrainWithoutName = () => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(
            TerrainModifyingTrig.gg_trg_Terrain_modifying_trig,
            errorHandler(() => {
                let x: number
                //local integer i = 1
                //loop
                //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
                x = globals.MAP_MIN_X
                while (true) {
                    if (x > globals.MAP_MAX_X) break

                    const terrainType = terrainSave[terrainSave_id]

                    if (terrainType !== null) {
                        ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                    }

                    terrainSave_id = terrainSave_id + 1
                    x = x + LARGEUR_CASE
                }
                y = y + LARGEUR_CASE
                if (y > globals.MAP_MAX_Y) {
                    TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                    Text.mkA('Terrain loaded')
                    DisableTrigger(GetTriggeringTrigger())
                    terrainModifyWorking = false
                    return
                }
                //i = i + 1
                //endloop
            })
        )
        terrainSave_id = 0
        let y = globals.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
    }

    return { SaveTerrainWithoutName, LoadTerrainWithoutName }
}

export const SaveLoadTerrainWithoutName = initSaveLoadTerrainWithoutName()
