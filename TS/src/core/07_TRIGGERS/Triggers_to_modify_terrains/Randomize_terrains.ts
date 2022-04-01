import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { udg_terrainTypes } from '../../../../globals'
import { Modify_terrain_functions } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'

const initRandomizeTerrains = () => {
    let oldTerrainTypes: number[] = []
    let newTerrainTypes: number[] = []
    let lastTerrainArrayId: number
    let terrainModifyWorking = false

    const StartTerrainModifying = () => {
        TerrainModifyingTrig.StopEnabledCheckTerrainTriggers()
        TriggerClearActions(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        TriggerAddAction(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig, () => {
            let x: number
            let terrainTypeId: number
            let done: boolean
            let j: number
            let i = 1
            //loop
            //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                terrainTypeId = GetTerrainType(x, y)
                done = false
                j = 0
                while (true) {
                    if (j > lastTerrainArrayId || done) break
                    if (terrainTypeId === oldTerrainTypes[j]) {
                        Modify_terrain_functions.ChangeTerrainType(x, y, newTerrainTypes[j])
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
                return
            }
            //i = i + 1
            //endloop
        })
        let y = Constants.MAP_MIN_Y
        EnableTrigger(TerrainModifyingTrig.gg_trg_Terrain_modifying_trig)
        terrainModifyWorking = true
    }

    const RandomizeTerrains = () => {
        let i: number
        let n: number
        let isTaken: boolean[] = []
        let terrainTypes: TerrainType[] = []

        if (terrainModifyWorking) {
            Text.erA("can't execute two commands of this type simultaneously !")
            return
        }

        n = 0
        i = 0
        while (true) {
            terrainTypes[n] = udg_terrainTypes.getWalk(i)
            if (terrainTypes[n] === null) break
            oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            n = n + 1
            i = i + 1
        }
        i = 0
        while (true) {
            terrainTypes[n] = udg_terrainTypes.getDeath(i)
            if (terrainTypes[n] === null) break
            oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            n = n + 1
            i = i + 1
        }
        i = 0
        while (true) {
            terrainTypes[n] = udg_terrainTypes.getSlide(i)
            if (terrainTypes[n] === null) break
            oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            n = n + 1
            i = i + 1
        }

        lastTerrainArrayId = n - 1

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            isTaken[i] = false
            i = i + 1
        }

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            while (true) {
                n = GetRandomInt(0, lastTerrainArrayId)
                if (!isTaken[n]) break
            }
            isTaken[n] = true
            newTerrainTypes[i] = oldTerrainTypes[n]
            i = i + 1
        }

        StartTerrainModifying()

        i = 0
        while (true) {
            if (i > lastTerrainArrayId) break
            terrainTypes[i].setTerrainTypeId(newTerrainTypes[i])
            i = i + 1
        }
    }

    return { RandomizeTerrains }
}

export const RandomizeTerrains = initRandomizeTerrains()
