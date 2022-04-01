import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { udg_terrainTypes } from '../../../../globals'
import { Modify_terrain_functions } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initExchangeTerrains = () => {
    let terrainA: number
    let terrainB: number
    let terrainModifyWorking = false

    const StartTerrainModifying = () => {
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x: number
            let terrainType: number
            //local integer i = 1
            //loop
            //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                terrainType = GetTerrainType(x, y)
                if (terrainType === terrainA) {
                    Modify_terrain_functions.ChangeTerrainType(x, y, terrainB)
                } else {
                    if (terrainType === terrainB) {
                        Modify_terrain_functions.ChangeTerrainType(x, y, terrainA)
                    }
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

    const ExchangeTerrains = (terrainTypeLabelA: string, terrainTypeLabelB: string): boolean => {
        const terrainTypeA: TerrainType = udg_terrainTypes.get(terrainTypeLabelA)
        const terrainTypeB: TerrainType = udg_terrainTypes.get(terrainTypeLabelB)
        if (terrainTypeA === terrainTypeB || terrainTypeA === 0 || terrainTypeB === 0) {
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

    return { ExchangeTerrains }
}

export const ExchangeTerrains = initExchangeTerrains()
