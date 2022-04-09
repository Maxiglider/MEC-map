import { IsNearBounds } from 'core/01_libraries/Basic_functions'
import { LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { ZLibrary } from 'core/02_bibliotheques_externes/ZLibrary'
import { errorHandler } from '../../../Utils/mapUtils'
import { I2HexaString } from '../../01_libraries/Functions_on_numbers'
import { SaveMapInCache } from './SAVE_MAP_in_cache'
import { SaveTerrainRamps } from './Save_terrain_ramps'
import { StringArrayForCache } from './struct_StringArrayForCache'
import {globals} from "../../../../globals";

const initSaveTerrainHeights = () => {
    let y: number

    //save terrain cliff levels
    const SaveTerrainCliffs_Actions = () => {
        let x: number
        let cliffLevel: number

        if (y <= globals.MAP_MAX_Y) {
            x = globals.MAP_MIN_X
            while (true) {
                if (x > globals.MAP_MAX_X) break
                if (IsNearBounds(x, y)) {
                    cliffLevel = 2
                } else {
                    cliffLevel = GetTerrainCliffLevel(x, y)
                }
                StringArrayForCache.stringArrayForCache.push(I2HexaString(cliffLevel))
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

    const StartSaveTerrainCliffs = () => {
        y = globals.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainCliffs', false)
        TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
        TriggerAddAction(SaveMapInCache.trigSaveMapInCache, errorHandler(SaveTerrainCliffs_Actions))
        EnableTrigger(SaveMapInCache.trigSaveMapInCache)
    }

    //save terrain heights
    const SaveTerrainHeights_Actions = () => {
        let x: number
        let height: number
        let isWater: boolean

        if (y <= globals.MAP_MAX_Y) {
            x = globals.MAP_MIN_X
            while (true) {
                if (x > globals.MAP_MAX_X) break
                height = ZLibrary.GetSurfaceZ(x, y)
                //if (!IsNearBounds(x, y) && (GetTerrainCliffLevel(x, y) != 2 || height != 0)) then //if surfaceZ is 0 && cliff level 2, we consider it's a "default tilepoint", with no water, && we avoid the GetTerrainZ call (which is heavy)
                /*if (!IsNearBounds(x, y) && !IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)) then
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

    const StartSaveTerrainHeights = () => {
        y = globals.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainHeights', true)
        TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
        TriggerAddAction(SaveMapInCache.trigSaveMapInCache, errorHandler(SaveTerrainHeights_Actions))
        EnableTrigger(SaveMapInCache.trigSaveMapInCache)
    }

    return { StartSaveTerrainHeights }
}

export const SaveTerrainHeights = initSaveTerrainHeights()
