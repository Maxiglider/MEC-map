import { LOW_PERIOD_FOR_WORK } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { NB_MAX_LEVELS } from 'core/04_STRUCTURES/Level/LevelArray'
import { SaveTerrain } from './Save_terrain'
import { SaveTerrainConfigInCache } from './Save_terrain_config'

const initSaveMapInCache = () => {
    const saveMap_cache = InitGameCache('epicSlide')
    const trigSaveMapInCache = CreateTrigger()

    DisableTrigger(SaveMapInCache.trigSaveMapInCache)
    TriggerRegisterTimerEvent(SaveMapInCache.trigSaveMapInCache, LOW_PERIOD_FOR_WORK, true)

    const StartSaveMapInCache = () => {
        let i: number
        Text.A('starting saving map in gamecache "epicSlide"...')
        FlushStoredMission(saveMap_cache, 'terrain')
        FlushStoredMission(saveMap_cache, 'monsterTypes')
        FlushStoredMission(saveMap_cache, 'casterTypes')
        i = 0
        while (true) {
            if (i >= NB_MAX_LEVELS) break
            FlushStoredMission(saveMap_cache, 'level' + I2S(i))
            i = i + 1
        }
        SaveTerrainConfigInCache.SaveTerrainConfig()
        SaveTerrain.StartSaveTerrain()
    }

    return { saveMap_cache, trigSaveMapInCache, StartSaveMapInCache }
}

export const SaveMapInCache = initSaveMapInCache()
