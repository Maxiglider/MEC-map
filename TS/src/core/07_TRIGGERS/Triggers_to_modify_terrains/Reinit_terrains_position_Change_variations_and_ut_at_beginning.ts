import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { createEvent } from 'Utils/mapUtils'
import { TerrainTypeFunctions } from '../../04_STRUCTURES/TerrainType/Terrain_type_functions'
import { Modify_terrain_functions } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainFunctions } from '../Modify_terrain_Functions/Terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initReinitTerrainsPositions = () => {
    let TERRAIN_SAVE: TerrainType[] = []
    let terrainSave_id: number
    let terrainModifyWorking = false

    createEvent({
        events: [t => TriggerRegisterTimerEvent(t, 0, false)],
        actions: [
            () => {
                TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
                TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, (): void => {
                    let terrainType: number
                    let x = Constants.MAP_MIN_X
                    while (true) {
                        if (x > Constants.MAP_MAX_X) break
                        terrainType = GetTerrainType(x, y)
                        //mise à jour used terrain (-ut)
                        TerrainFunctions.AddNewTerrain(terrainType)
                        //changer variations
                        Modify_terrain_functions.ChangeTerrainType(x, y, terrainType)
                        //sauvegarde du terrain
                        TERRAIN_SAVE[terrainSave_id] = TerrainTypeFunctions.TerrainTypeId2TerrainType(terrainType)
                        terrainSave_id = terrainSave_id + 1
                        x = x + LARGEUR_CASE
                    }

                    y = y + LARGEUR_CASE
                    if (y > Constants.MAP_MAX_Y) {
                        terrainModifyWorking = false
                        DisableTrigger(GetTriggeringTrigger())
                        return
                    }
                })
                terrainSave_id = 0
                let y = Constants.MAP_MIN_Y
                EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
                terrainModifyWorking = true
                DestroyTrigger(GetTriggeringTrigger())
            },
        ],
    })

    //reinitTerrainPositions
    const StartTerrainModifying = () => {
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x: number
            //local integer i = 1
            //loop
            //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                if (TERRAIN_SAVE[terrainSave_id] != 0 && TERRAIN_SAVE[terrainSave_id].getTerrainTypeId() != 0) {
                    Modify_terrain_functions.ChangeTerrainType(x, y, TERRAIN_SAVE[terrainSave_id].getTerrainTypeId())
                }
                terrainSave_id = terrainSave_id + 1
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                Text.mkA('Terrains position reinitialized !')
                DisableTrigger(GetTriggeringTrigger())
                terrainModifyWorking = false
                TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
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
    }

    const ReinitTerrainsPosition = (): void => {
        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }
        StartTerrainModifying()
    }

    return { ReinitTerrainsPosition }
}

export const ReinitTerrainsPositions = initReinitTerrainsPositions()
