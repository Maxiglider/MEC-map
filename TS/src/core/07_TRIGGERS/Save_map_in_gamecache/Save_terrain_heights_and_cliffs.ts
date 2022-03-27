import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { FunctionsOnNumbers } from 'core/01_libraries/Functions_on_numbers'
import { Text } from 'core/01_libraries/Text'
import { ZLibrary } from 'core/02_bibliotheques_externes/ZLibrary'
import { SaveMapInCache } from './SAVE_MAP_in_cache'
import { SaveTerrainRamps } from './Save_terrain_ramps'
import { StringArrayForCache } from './struct_StringArrayForCache'

const initSaveTerrainHeights = () => {
    let y: number

    //save terrain cliff levels
    const SaveTerrainCliffs_Actions = (): void => {
        let x: number
        let cliffLevel: number

        if (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                if (BasicFunctions.IsNearBounds(x, y)) {
                    cliffLevel = 2
                } else {
                    cliffLevel = GetTerrainCliffLevel(x, y)
                }
                StringArrayForCache.stringArrayForCache.push(FunctionsOnNumbers.I2HexaString(cliffLevel))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            StringArrayForCache.stringArrayForCache.writeInCache()
            Text.A('terrain cliffs saved')
            SaveTerrainRamps.StartSaveTerrainRamps()
        }
    }

    const StartSaveTerrainCliffs = (): void => {
        y = Constants.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainCliffs', false)
        TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
        TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveTerrainCliffs_Actions)
        EnableTrigger(SaveMapInCache.trigSaveMapInCache)
    }

    //save terrain heights
    // TODO; Used to be private
    const SaveTerrainHeights_Actions = (): void => {
        let x: number
        let height: number
        let isWater: boolean

        if (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                height = ZLibrary.GetSurfaceZ(x, y)
                //if (not BasicFunctions.IsNearBounds(x, y) and (GetTerrainCliffLevel(x, y) != 2 or height != 0)) then //if surfaceZ is 0 and cliff level 2, we consider it's a "default tilepoint", with no water, and we avoid the GetTerrainZ call (which is heavy)
                /*if (not BasicFunctions.IsNearBounds(x, y) and not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)) then
			                    //near bounds, GetTerrainZ crashes the game
			                    //warning, PATHING_TYPE_FLOATABILITY doesn't find water everywhere there is (little spaces of water won't be detected), but I see no other solution
			                    height = ZLibrary.GetTerrainZ(x, y)
			                endif*/

                /*
			                if (RAbsBJ(height - ZLibrary.GetSurfaceZ(x, y)) > 5) then
 CreateUnit(Player(0), 'hpea', x, y, 0)
			                endif
			                */
                StringArrayForCache.stringArrayForCache.push(I2S(R2I(height)))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            StringArrayForCache.stringArrayForCache.writeInCache()
            Text.A('terrain heights saved')
            StartSaveTerrainCliffs()
        }
    }

    const StartSaveTerrainHeights = (): void => {
        y = Constants.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainHeights', true)
        TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
        TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveTerrainHeights_Actions)
        EnableTrigger(SaveMapInCache.trigSaveMapInCache)
    }

    return { StartSaveTerrainHeights }
}

export const SaveTerrainHeights = initSaveTerrainHeights()
