import { Constants, LARGEUR_CASE } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { ZLibrary } from 'core/02_bibliotheques_externes/ZLibrary'
import { SaveMonsterTypes } from './Save_monster_types'
import { StringArrayForCache } from './struct_StringArrayForCache'

const initSaveWater = () => {
    let y: number

    //save water heights
    const SaveWaterHeights_Actions = (): void => {
        let x: number
        if (y <= Constants.MAP_MAX_Y) {
            x = Constants.MAP_MIN_X
            while (true) {
                if (x > Constants.MAP_MAX_X) break
                StringArrayForCache.stringArrayForCache.push(I2S(R2I(ZLibrary.GetSurfaceZ(x, y))))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            StringArrayForCache.stringArrayForCache.writeInCache()
            Text.A('water heights saved')
            SaveMonsterTypes.StartSaveMonsterTypes()
        }
    }

    const StartSaveWaterHeights = (): void => {
        y = Constants.MAP_MIN_Y
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('terrain', 'waterHeights', true)
        TriggerClearActions(trigSaveMapInCache)
        TriggerAddAction(trigSaveMapInCache, SaveWaterHeights_Actions)
        EnableTrigger(trigSaveMapInCache)
    }

    //save water presence
    /*
 private function SaveWater_Actions takes nothing returns nothing
    local real x
    local boolean isWater
    if (y <= MAP_MAX_Y) then
        x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                isWater = false //not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)
                if (isWater) then
 StringArrayForCache.stringArrayForCache.push("1")
                else
 StringArrayForCache.stringArrayForCache.push("0")
                endif
            x = x + LARGEUR_CASE
        endloop
        y = y + LARGEUR_CASE
    else
 DisableTrigger(GetTriggeringTrigger())
 StringArrayForCache.stringArrayForCache.writeInCache()
 Text.A("water presence saved")
 StartSaveWaterHeights()
    endif
endfunction
*/

    const StartSaveWater = () => {
        StartSaveWaterHeights()

        /*
	    y = MAP_MIN_Y
	StringArrayForCache.stringArrayForCache = new StringArrayForCache("terrain", "waterPresence", false)
 TriggerClearActions(trigSaveMapInCache)
 TriggerAddAction(trigSaveMapInCache, function SaveWater_Actions)
 EnableTrigger(trigSaveMapInCache)
	    */
    }

    return { StartSaveWater }
}

export const SaveWater = initSaveWater()
