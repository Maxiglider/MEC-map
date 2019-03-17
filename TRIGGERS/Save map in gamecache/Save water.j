library SaveWater needs SaveMonsterTypes


globals
    private real y
endglobals




//save water heights
private function SaveWaterHeights_Actions takes nothing returns nothing
    local real x
    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                call stringArrayForCache.push(I2S(R2I(GetSurfaceZ(x, y))))
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("water heights saved")
        call StartSaveMonsterTypes()
    endif
endfunction


function StartSaveWaterHeights takes nothing returns nothing
    set y = MAP_MIN_Y
    set stringArrayForCache = StringArrayForCache.create("terrain", "waterHeights", true)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveWaterHeights_Actions)
    call EnableTrigger(trigSaveMapInCache)
endfunction



//save water presence
/*
private function SaveWater_Actions takes nothing returns nothing
    local real x
    local boolean isWater
    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                set isWater = false //not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)
                if (isWater) then
                    call stringArrayForCache.push("1")
                else
                    call stringArrayForCache.push("0")
                endif
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("water presence saved")
        call StartSaveWaterHeights()
    endif
endfunction
*/


function StartSaveWater takes nothing returns nothing
    call StartSaveWaterHeights()

    /*
    set y = MAP_MIN_Y
    set stringArrayForCache = StringArrayForCache.create("terrain", "waterPresence", false)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveWater_Actions)
    call EnableTrigger(trigSaveMapInCache)
    */
endfunction


endlibrary