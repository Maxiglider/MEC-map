library SaveTerrainHeights needs SaveTerrainRamps


globals
    private real y
endglobals



//save water
private function SaveWater_Actions takes nothing returns nothing
    local real x
    local boolean isWater
    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                set isWater = not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)
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
        call Text_A("water saved")
        call StartSaveTerrainRamps()
    endif
endfunction


function StartSaveWater takes nothing returns nothing
    set y = MAP_MIN_Y
    set stringArrayForCache = StringArrayForCache.create("terrain", "water", false)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveWater_Actions)
    call EnableTrigger(trigSaveMapInCache)
endfunction




//save terrain cliff levels
private function SaveTerrainCliffs_Actions takes nothing returns nothing
    local real x
    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                call stringArrayForCache.push(I2HexaString(GetTerrainCliffLevel(x, y)))
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("terrain cliffs saved")
        call StartSaveWater()
    endif
endfunction


function StartSaveTerrainCliffs takes nothing returns nothing
    set y = MAP_MIN_Y
    set stringArrayForCache = StringArrayForCache.create("terrain", "terrainCliffs", false)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveTerrainCliffs_Actions)
    call EnableTrigger(trigSaveMapInCache)
endfunction




//save terrain heights
private function SaveTerrainHeights_Actions takes nothing returns nothing
    local location point
    local real x
    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                set point = Location(x, y)
                call stringArrayForCache.push(I2S(R2I(GetLocationZ(point))))
                call RemoveLocation(point)
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
        set point = null
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("terrain heights saved")
        call StartSaveTerrainCliffs()
    endif
endfunction


function StartSaveTerrainHeights takes nothing returns nothing
    set y = MAP_MIN_Y
    set stringArrayForCache = StringArrayForCache.create("terrain", "terrainHeights", true)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveTerrainHeights_Actions)
    call EnableTrigger(trigSaveMapInCache)
endfunction


endlibrary