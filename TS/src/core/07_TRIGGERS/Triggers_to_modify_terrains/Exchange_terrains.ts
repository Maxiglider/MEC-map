import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { getUdgTerrainTypes } from '../../../../globals'
import { errorHandler } from '../../../Utils/mapUtils'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'
import {globals} from "../../../../globals";

let terrainA: number
let terrainB: number
let terrainModifyWorking = false

const StartTerrainModifying = () => {
    TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
    TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
    TriggerAddAction(
        TerrainModifyingTrig.gg_trg_Terrain_modifying_trig,
        errorHandler(() => {
            let x: number
            let terrainType: number

            x = globals.MAP_MIN_X
            while (true) {
                if (x > globals.MAP_MAX_X) break
                terrainType = GetTerrainType(x, y)
                if (terrainType === terrainA) {
                    ChangeTerrainType(x, y, terrainB)
                } else {
                    if (terrainType === terrainB) {
                        ChangeTerrainType(x, y, terrainA)
                    }
                }
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
            if (y > globals.MAP_MAX_Y) {
                DisableTrigger(GetTriggeringTrigger())
                TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                terrainModifyWorking = false
                return
            }
        })
    )
    let y = globals.MAP_MIN_Y
    EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
    terrainModifyWorking = true
}

export const ExchangeTerrains = (terrainTypeLabelA: string, terrainTypeLabelB: string): boolean => {
    const terrainTypeA = getUdgTerrainTypes().get(terrainTypeLabelA)
    const terrainTypeB = getUdgTerrainTypes().get(terrainTypeLabelB)
    if (terrainTypeA === terrainTypeB || !terrainTypeA || !terrainTypeB) {
        return false
    }
    if (terrainModifyWorking) {
        Text.erA("can't execute two commands of this type simultaneously !")
        return false
    }
    terrainA = terrainTypeA.getTerrainTypeId()
    terrainB = terrainTypeB.getTerrainTypeId()

    StartTerrainModifying()
    terrainTypeA.setTerrainTypeId(terrainB)
    terrainTypeB.setTerrainTypeId(terrainA)
    return true
}
