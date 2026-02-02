import { Constants } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainType } from 'core/04_STRUCTURES/TerrainType/TerrainType'
import { getUdgTerrainTypes, globals } from '../../../../globals'
import { ChangeTerrainType } from '../Modify_terrain_Functions/Modify_terrain_functions'

const initSaveLoadTerrain = () => {
    let terrainSaves = new Map<string, (TerrainType | null)[][]>()

    //save terrain
    const SaveTerrain = (saveName: string) => {
        const terrainSave: (TerrainType | null)[][] = []

        let y = globals.MAP_MIN_Y

        while (y <= globals.MAP_MAX_Y) {
            let x = globals.MAP_MIN_X
            while (x <= globals.MAP_MAX_X) {
                if (!terrainSave[x]) terrainSave[x] = []
                terrainSave[x][y] = getUdgTerrainTypes().getTerrainType(x, y)
                x += Constants.LARGEUR_CASE
            }

            y = y + Constants.LARGEUR_CASE
        }

        terrainSaves.set(saveName, terrainSave)
        Text.mkA('Terrain saved')
    }

    const DeleteTerrainSave = (saveName: string): boolean => {
        terrainSaves.delete(saveName)

        return true
    }

    //load terrain
    const LoadTerrain = (saveName: string): boolean => {
        const terrainSave = terrainSaves.get(saveName)
        if (!terrainSave) {
            return false
        }

        let terrainType: TerrainType | null

        let y = globals.MAP_MIN_Y

        while (y <= globals.MAP_MAX_Y) {
            let x = globals.MAP_MIN_X
            while (x <= globals.MAP_MAX_X) {
                terrainType = terrainSave[x][y]
                if (terrainType !== null) {
                    ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
                }
                x = x + Constants.LARGEUR_CASE
            }

            y = y + Constants.LARGEUR_CASE
        }

        Text.mkA('Terrain loaded')

        return true
    }

    return { SaveTerrain, DeleteTerrainSave, LoadTerrain }
}

export const SaveLoadTerrain = initSaveLoadTerrain()
