//TESH.scrollpos=0
//TESH.alwaysfold=0
library SaveTerrainHeights needs Text, SaveMonsterTypes


globals
    private real y
endglobals




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
        call StartSaveMonsterTypes()
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