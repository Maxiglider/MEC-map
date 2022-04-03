import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { udg_terrainTypes } from '../../../../globals'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initSaveLoadTerrainWithName = () => {
    let terrainSaves = new Map<string, (TerrainType | null)[][]>()
    let terrainModifyWorking = false

    //save terrain
    const SaveTerrainWithName = (saveName: string) => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }

        const terrainSave: (TerrainType | null)[][] = []

        let y = Constants.MAP_MIN_Y

        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)

        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x = Constants.MAP_MIN_X
            while (x <= Constants.MAP_MAX_X) {
                terrainSave[x][y] = udg_terrainTypes.getTerrainType(x, y)
                x += LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                terrainModifyWorking = false
                DisableTrigger(GetTriggeringTrigger())
                Text.mkA('Terrain saved')

                terrainSaves.set(saveName, terrainSave)
            }
        })

        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const DeleteTerrainSaveWithName = (saveName: string): boolean => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return false
        }

        terrainSaves.delete(saveName)

        return true
    }

    //load terrain
    const LoadTerrainWithName = (saveName: string): boolean => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return true
        }

        const terrainSave = terrainSaves.get(saveName)
        if(!terrainSave){
            return false
        }

        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let terrainType: TerrainType | null

            let x = Constants.MAP_MIN_X
            while (x <= Constants.MAP_MAX_X) {
                terrainType = terrainSave[x][y]
                if (terrainType !== null) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }
                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                Text.mkA('Terrain loaded')
                DisableTrigger(GetTriggeringTrigger())
                terrainModifyWorking = false
            }
        })

        let y = Constants.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        return true
    }

    return { SaveTerrainWithName, DeleteTerrainSaveWithName, LoadTerrainWithName }
}

export const SaveLoadTerrainWithName = initSaveLoadTerrainWithName()
