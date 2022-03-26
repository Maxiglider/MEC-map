import { LOW_PERIOD_FOR_WORK } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'

const initSaveMapInCache = () => {
    let saveMap_cache: gamecache
    let trigSaveMapInCache: trigger

    const StartSaveMapInCache = (): void => {
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
        SaveTerrainConfig()
        StartSaveTerrain()
    }

    //===========================================================================
    const Init_SaveMapInCache = (): void => {
        saveMap_cache = InitGameCache('epicSlide')
        trigSaveMapInCache = CreateTrigger()
        DisableTrigger(trigSaveMapInCache)
        TriggerRegisterTimerEvent(trigSaveMapInCache, LOW_PERIOD_FOR_WORK, true)
    }

    Init_SaveMapInCache()

    return { StartSaveMapInCache }
}

export const SaveMapInCache = initSaveMapInCache()
