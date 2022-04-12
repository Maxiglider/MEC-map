import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { getUdgTerrainTypes, globals } from '../../../../globals'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { TerrainModifyingTrig } from './Terrain_modifying_trig'
import {createEvent, createTimer} from "../../../Utils/mapUtils";

const initReinitTerrains = () => {
    let terrainTypes: TerrainType[] = []
    let terrainTypeIds: number[] = []
    let terrainTypeIdsToReplace: number[] = []

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
        });
    }

    const ModifyTerrain = () => {
        let y = globals.MAP_MIN_Y

        let x: number
        let terrainTypeId: number
        let done: boolean
        let j: number

        while (y <= globals.MAP_MAX_Y) {
            x = globals.MAP_MIN_X

            while (x <= globals.MAP_MAX_X) {
                terrainTypeId = GetTerrainType(x, y)
                done = false
                j = 0

                while (!(terrainTypes[j] === null || done)) {
                    if (terrainTypeId === terrainTypeIdsToReplace[j]) {
                        ChangeTerrainType(x, y, terrainTypeIds[j])
                        done = true
                    }
                    j = j + 1
                }

                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
        }

        Text.mkA('Terrains reinitialized')
    }

    const ReinitTerrains = () => {
        for (let i = 0; i < terrainTypes.length; i++) {
            terrainTypeIdsToReplace[i] = terrainTypes[i].getTerrainTypeId()
            terrainTypes[i].setTerrainTypeId(terrainTypeIds[i])
        }

        ModifyTerrain()
    }

    return { ReinitTerrains, init_ReinitAtStart }
}

export const ReinitTerrains = initReinitTerrains()
