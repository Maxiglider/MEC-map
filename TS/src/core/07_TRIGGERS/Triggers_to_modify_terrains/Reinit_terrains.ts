import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { createEvent } from 'Utils/mapUtils'
import { Modify_terrain_functions } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initReinitTerrains = () => {
    let terrainTypes: TerrainType[] = []
    let terrainTypeIds: number[] = []
    let terrainTypeIdsToReplace: number[] = []
    let terrainModifyWorking = false

    createEvent({
        events: [t => TriggerRegisterTimerEvent(t, 0, false)],
        actions: [
            () => {
                let n = 0
                let i = 0
                while (true) {
                    if (i >= udg_terrainTypes.numberOfWalk) break
                    terrainTypes[n] = udg_terrainTypes.getWalk(i)
                    terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
                    n = n + 1
                    i = i + 1
                }
                i = 0
                while (true) {
                    if (i >= udg_terrainTypes.numberOfDeath) break
                    terrainTypes[n] = udg_terrainTypes.getDeath(i)
                    terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
                    n = n + 1
                    i = i + 1
                }
                i = 0
                while (true) {
                    if (i >= udg_terrainTypes.numberOfSlide) break
                    terrainTypes[n] = udg_terrainTypes.getSlide(i)
                    terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
                    n = n + 1
                    i = i + 1
                }
            },
        ],
    })

    const StartTerrainModifying = () => {
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x: number
            let terrainTypeId: number
            let done: boolean
            let j: number
            //local integer i = 1
            //loop
            //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                terrainTypeId = GetTerrainType(x, y)
                done = false
                j = 0
                while (true) {
                    if (terrainTypes[j] === 0 || done) break
                    if (terrainTypeId === terrainTypeIdsToReplace[j]) {
                        Modify_terrain_functions.ChangeTerrainType(x, y, terrainTypeIds[j])
                        done = true
                    }
                    j = j + 1
                }
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
            if (y > Constants.MAP_MAX_Y) {
                DisableTrigger(GetTriggeringTrigger())
                TerrainModifyingTrig.RestartEnabledCheckTerrainTriggers()
                terrainModifyWorking = false
                Text.mkA('Terrains reinitialized')
                return
            }
            //i = i + 1
            //endloop
        })
        let y = Constants.MAP_MIN_Y
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
            if (terrainTypes[i] === 0) break
            terrainTypeIdsToReplace[i] = terrainTypes[i].getTerrainTypeId()
            terrainTypes[i].setTerrainTypeId(terrainTypeIds[i])
            i = i + 1
        }
        StartTerrainModifying()
    }

    return { ReinitTerrains }
}

export const ReinitTerrains = initReinitTerrains()
