import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'

const initSaveTerrainHeights = () => {
    // needs SaveTerrainRamps

    // TODO; Used to be private
    let y: number

    //save terrain cliff levels
    // TODO; Used to be private
    const SaveTerrainCliffs_Actions = (): void => {
        let x: number
        let cliffLevel: number

        if (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                if (IsNearBounds(x, y)) {
                    cliffLevel = 2
                } else {
                    cliffLevel = GetTerrainCliffLevel(x, y)
                }
                stringArrayForCache.push(I2HexaString(cliffLevel))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            stringArrayForCache.writeInCache()
            Text.A('terrain cliffs saved')
            StartSaveTerrainRamps()
        }
    }

    const StartSaveTerrainCliffs = (): void => {
        y = Constants.MAP_MIN_Y
        stringArrayForCache = StringArrayForCache.create('terrain', 'terrainCliffs', false)
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
                height = GetSurfaceZ(x, y)
                //if (not IsNearBounds(x, y) and (GetTerrainCliffLevel(x, y) != 2 or height != 0)) then //if surfaceZ is 0 and cliff level 2, we consider it's a "default tilepoint", with no water, and we avoid the GetTerrainZ call (which is heavy)
                /*if (not IsNearBounds(x, y) and not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)) then
			                    //near bounds, GetTerrainZ crashes the game
			                    //warning, PATHING_TYPE_FLOATABILITY doesn't find water everywhere there is (little spaces of water won't be detected), but I see no other solution
			                    height = GetTerrainZ(x, y)
			                endif*/

                /*
			                if (RAbsBJ(height - GetSurfaceZ(x, y)) > 5) then
 CreateUnit(Player(0), 'hpea', x, y, 0)
			                endif
			                */
                stringArrayForCache.push(I2S(R2I(height)))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            stringArrayForCache.writeInCache()
            Text.A('terrain heights saved')
            StartSaveTerrainCliffs()
        }
    }

    const StartSaveTerrainHeights = (): void => {
        y = Constants.MAP_MIN_Y
        stringArrayForCache = StringArrayForCache.create('terrain', 'terrainHeights', true)
        TriggerClearActions(trigSaveMapInCache)
        TriggerAddAction(trigSaveMapInCache, SaveTerrainHeights_Actions)
        EnableTrigger(trigSaveMapInCache)
    }
}
