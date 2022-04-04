import { Text } from 'core/01_libraries/Text'
import { getUdgTerrainTypes } from '../../../../globals'


const initSaveTerrainConfigInCache = () => {
    const SaveTerrainConfig = () => {
        getUdgTerrainTypes().saveInCache()
        Text.A('terrain configuration saved')
    }

    return { SaveTerrainConfig }
}

export const SaveTerrainConfigInCache = initSaveTerrainConfigInCache()
