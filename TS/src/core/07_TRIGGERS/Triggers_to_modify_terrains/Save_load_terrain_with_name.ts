import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { Modify_terrain_functions } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initSaveLoadTerrainWithName = () => {
    let saveNameInt: number
    let terrainSaves = InitHashtable()
    let terrainSave_id: number
    let terrainModifyWorking = false

    //save terrain
    const SaveTerrainWithName = (saveName: string) => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        saveNameInt = StringHash(saveName)
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                //call Text.A("avant")
                SaveInteger(terrainSaves, saveNameInt, terrainSave_id, integer(udg_terrainTypes.getTerrainType(x, y)))
                //call Text.A("après")
                terrainSave_id = terrainSave_id + 1
                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                terrainModifyWorking = false
                DisableTrigger(GetTriggeringTrigger())
                Text.mkA('Terrain saved')
                return
            }
        })
        terrainSave_id = 0
        let y = Constants.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const DeleteTerrainSaveWithName = (saveName: string): boolean => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return false
        }
        saveNameInt = StringHash(saveName)
        if (!HaveSavedInteger(terrainSaves, saveNameInt, 0)) {
            return false
        }
        FlushChildHashtable(terrainSaves, saveNameInt)
        return true
    }

    //load terrain
    const LoadTerrainWithName = (saveName: string): boolean => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return true
        }
        saveNameInt = StringHash(saveName)
        if (!HaveSavedInteger(terrainSaves, saveNameInt, 0)) {
            return false
        }
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let terrainType: TerrainType
            let x: number
            //local integer i = 1
            //loop
            //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                terrainType = TerrainType(LoadInteger(terrainSaves, saveNameInt, terrainSave_id))
                if (terrainType !== 0) {
                    Modify_terrain_functions.ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }
                terrainSave_id = terrainSave_id + 1
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                Text.mkA('Terrain loaded')
                DisableTrigger(GetTriggeringTrigger())
                terrainModifyWorking = false
                return
            }
            //i = i + 1
            //endloop
        })
        terrainSave_id = 0
        let y = Constants.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        return true
    }

    return { SaveTerrainWithName, DeleteTerrainSaveWithName, LoadTerrainWithName }
}

export const SaveLoadTerrainWithName = initSaveLoadTerrainWithName()
