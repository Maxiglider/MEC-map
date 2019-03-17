library SaveTerrainHeights needs SaveTerrainRamps


globals
    private real y
endglobals




//save terrain cliff levels
private function SaveTerrainCliffs_Actions takes nothing returns nothing
    local real x
    local integer cliffLevel

    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                if (IsNearBounds(x, y)) then //at MAP_MAX_Y, GetTerrainZ used before makes GetTerrainCliffLevel crashes the game
                    set cliffLevel = 2
                else
                    set cliffLevel = GetTerrainCliffLevel(x, y)
                endif
                call stringArrayForCache.push(I2HexaString(cliffLevel))
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("terrain cliffs saved")
        call StartSaveTerrainRamps()
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
    local real x
    local real height
    local boolean isWater

    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                set height = GetSurfaceZ(x, y)
                //if (not IsNearBounds(x, y) and (GetTerrainCliffLevel(x, y) != 2 or height != 0)) then //if surfaceZ is 0 and cliff level 2, we consider it's a "default tilepoint", with no water, and we avoid the GetTerrainZ call (which is heavy)
                /*if (not IsNearBounds(x, y) and not IsTerrainPathable(x, y, PATHING_TYPE_FLOATABILITY)) then
                    //near bounds, GetTerrainZ crashes the game
                    //warning, PATHING_TYPE_FLOATABILITY doesn't find water everywhere there is (little spaces of water won't be detected), but I see no other solution
                    set height = GetTerrainZ(x, y)
                endif*/
                /*
                if (RAbsBJ(height - GetSurfaceZ(x, y)) > 5) then
                    call CreateUnit(Player(0), 'hpea', x, y, 0)
                endif
                */
                call stringArrayForCache.push(I2S(R2I(height)))
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
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