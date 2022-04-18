import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { TerrainTypeId2TerrainType } from 'core/04_STRUCTURES/TerrainType/Terrain_type_functions'
import { globals } from '../../../../globals'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'
import { AddNewTerrain } from '../Modify_terrain_Functions/Terrain_functions'
import {createTimer} from "../../../Utils/mapUtils";


const initReinitTerrainsPositions = () => {
    let TERRAIN_SAVE: (TerrainType | null)[] = []
    let terrainSave_id: number

    const init_reinitTerrainsPositions = () => {
        createTimer(0, false, () => {
            terrainSave_id = 0
            let y = globals.MAP_MIN_Y

            let terrainType: number

            while (y <= globals.MAP_MAX_Y) {
                let x = globals.MAP_MIN_X

                while (x <= globals.MAP_MAX_X) {
                    terrainType = GetTerrainType(x, y)
                    //mise à jour used terrain (-ut)
                    AddNewTerrain(terrainType)
                    //changer variations
                    ChangeTerrainType(x, y, terrainType)
                    //sauvegarde du terrain
                    TERRAIN_SAVE[terrainSave_id] = TerrainTypeId2TerrainType(terrainType)
                    terrainSave_id = terrainSave_id + 1
                    x = x + LARGEUR_CASE
                }

                y = y + LARGEUR_CASE
            }
        });
    }

    //reinitTerrainPositions
    const ModifyTerrain = () => {
        terrainSave_id = 0

        let y = globals.MAP_MIN_Y

        while (y <= globals.MAP_MAX_Y) {
            let x = globals.MAP_MIN_X
            while (x <= globals.MAP_MAX_X) {
                const terrainType = TERRAIN_SAVE[terrainSave_id]

                if (terrainType !== null && terrainType.getTerrainTypeId() != 0) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }

                terrainSave_id = terrainSave_id + 1
                x = x + LARGEUR_CASE
            }

            y = y + LARGEUR_CASE
        }

        if (y > globals.MAP_MAX_Y) {
            Text.mkA('Terrains position reinitialized !')
        }
    }

    const ReinitTerrainsPosition = () => {
        ModifyTerrain()
    }

    return { ReinitTerrainsPosition, init_reinitTerrainsPositions }
}

export const ReinitTerrainsPositions = initReinitTerrainsPositions()
