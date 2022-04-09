import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { createTimer } from 'Utils/mapUtils'
import { getUdgTerrainTypes } from '../../../../globals'
import { errorHandler } from '../../../Utils/mapUtils'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'
import {globals} from "../../../../globals";

const initReinitTerrains = () => {
    let terrainTypes: TerrainType[] = []
    let terrainTypeIds: number[] = []
    let terrainTypeIdsToReplace: number[] = []
    let terrainModifyWorking = false

    const init_ReinitAtStart = () => {
        createTimer(0, false, () => {
            let n = 0
            let i = 0
            while (true) {
                if (i >= getUdgTerrainTypes().numberOfWalk) break
                terrainTypes[n] = getUdgTerrainTypes().getWalk(i)
                terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
                n = n + 1
                i = i + 1
            }
            i = 0
            while (true) {
                if (i >= getUdgTerrainTypes().numberOfDeath) break
                terrainTypes[n] = getUdgTerrainTypes().getDeath(i)
                terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
                n = n + 1
                i = i + 1
            }
            i = 0
            while (true) {
                if (i >= getUdgTerrainTypes().numberOfSlide) break
                terrainTypes[n] = getUdgTerrainTypes().getSlide(i)
                terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
                n = n + 1
                i = i + 1
            }
        })
    }

    const StartTerrainModifying = () => {
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(
            TerrainModifyingTrig.gg_trg_Terrain_modifying_trig,
            errorHandler(() => {
                let x: number
                let terrainTypeId: number
                let done: boolean
                let j: number
                //local integer i = 1
                //loop
                //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
                x = globals.MAP_MIN_X
                while (true) {
                    if (x > globals.MAP_MAX_X) break
                    terrainTypeId = GetTerrainType(x, y)
                    done = false
                    j = 0
                    while (true) {
                        if (terrainTypes[j] === null || done) break
                        if (terrainTypeId === terrainTypeIdsToReplace[j]) {
                            ChangeTerrainType(x, y, terrainTypeIds[j])
                            done = true
                        }
                        j = j + 1
                    }
                    x = x + LARGEUR_CASE
                }
                y = y + LARGEUR_CASE
                if (y > globals.MAP_MAX_Y) {
                    DisableTrigger(GetTriggeringTrigger())
                    TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                    terrainModifyWorking = false
                    Text.mkA('Terrains reinitialized')
                    return
                }
                //i = i + 1
                //endloop
            })
        )
        let y = globals.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const ReinitTerrains = () => {
        let i: number

        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }

        i = 0
        while (true) {
            if (terrainTypes[i] === null) break
            terrainTypeIdsToReplace[i] = terrainTypes[i].getTerrainTypeId()
            terrainTypes[i].setTerrainTypeId(terrainTypeIds[i])
            i = i + 1
        }
        StartTerrainModifying()
    }

    return { ReinitTerrains, init_ReinitAtStart }
}

export const ReinitTerrains = initReinitTerrains()
