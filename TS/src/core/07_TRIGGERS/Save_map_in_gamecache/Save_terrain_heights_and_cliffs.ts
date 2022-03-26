import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { ZLibrary } from 'core/02_bibliotheques_externes/ZLibrary'
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
                StringArrayForCache.stringArrayForCache.push(I2HexaString(cliffLevel))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            StringArrayForCache.stringArrayForCache.writeInCache()
            Text.A('terrain cliffs saved')
            StartSaveTerrainRamps()
        }
    }

    const StartSaveTerrainCliffs = (): void => {
        y = Constants.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'terrainCliffs', false)
        TriggerClearActions(trigSaveMapInCache)
        TriggerAddAction(trigSaveMapInCache, SaveTerrainCliffs_Actions)
        EnableTrigger(trigSaveMapInCache)
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
                //if (not IsNearBounds(x, y) and (GetTerrainCliffLevel(x, y) != 2 or height != 0)) then //if surfaceZ is 0 and cliff level 2, we consider it's a "default tilepoint", with no water, and we avoid the GetTerrainZ call (which is heavy)
                /*if (not IsNearBounds(x, y) and not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)) then
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
        TriggerClearActions(trigSaveMapInCache)
        TriggerAddAction(trigSaveMapInCache, SaveTerrainHeights_Actions)
        EnableTrigger(trigSaveMapInCache)
    }

    return { StartSaveTerrainHeights }
}

export const SaveTerrainHeights = initSaveTerrainHeights()
