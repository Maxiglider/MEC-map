import { Text } from 'core/01_libraries/Text'

const initSaveTerrainConfigInCache = () => {
    const SaveTerrainConfig = () => {
        udg_terrainTypes.saveInCache()
        Text.A('terrain configuration saved')
    }

    return { SaveTerrainConfig }
}

export const SaveTerrainConfigInCache = initSaveTerrainConfigInCache()
