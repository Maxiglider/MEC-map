const initSaveWater = () => {
    // needs SaveMonsterTypes

    // TODO; Used to be private
    let y: number

    //save water heights
    // TODO; Used to be private
    const SaveWaterHeights_Actions = (): void => {
        let x: number
        if (y <= MAP_MAX_Y) {
            x = MAP_MIN_X
            while (true) {
                if (x > MAP_MAX_X) break
                stringArrayForCache.push(I2S(R2I(GetSurfaceZ(x, y))))
                x = x + LARGEUR_CASE
            }
            y = y + LARGEUR_CASE
        } else {
            DisableTrigger(GetTriggeringTrigger())
            stringArrayForCache.writeInCache()
            Text.A('water heights saved')
            StartSaveMonsterTypes()
        }
    }

    const StartSaveWaterHeights = (): void => {
        y = MAP_MIN_Y
        stringArrayForCache = StringArrayForCache.create('terrain', 'waterHeights', true)
        TriggerClearActions(trigSaveMapInCache)
        TriggerAddAction(trigSaveMapInCache, SaveWaterHeights_Actions)
        EnableTrigger(trigSaveMapInCache)
    }

    //save water presence
    /*
// TODO; Used to be private
 function SaveWater_Actions takes nothing returns nothing
    local real x
    local boolean isWater
    if (y <= MAP_MAX_Y) then
        x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                isWater = false //not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)
                if (isWater) then
 stringArrayForCache.push("1")
                else
 stringArrayForCache.push("0")
                endif
            x = x + LARGEUR_CASE
        endloop
        y = y + LARGEUR_CASE
    else
 DisableTrigger(GetTriggeringTrigger())
 stringArrayForCache.writeInCache()
 Text.A("water presence saved")
 StartSaveWaterHeights()
    endif
endfunction
*/

    const StartSaveWater = (): void => {
        StartSaveWaterHeights()

        /*
	    y = MAP_MIN_Y
	stringArrayForCache = StringArrayForCache.create("terrain", "waterPresence", false)
 TriggerClearActions(trigSaveMapInCache)
 TriggerAddAction(trigSaveMapInCache, function SaveWater_Actions)
 EnableTrigger(trigSaveMapInCache)
	    */
    }
}
