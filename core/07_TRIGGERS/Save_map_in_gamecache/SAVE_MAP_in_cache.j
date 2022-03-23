//TESH.scrollpos=0
//TESH.alwaysfold=0
library SaveMapInCache initializer Init_SaveMapInCache needs SaveTerrainConfigInCache, SaveTerrain




globals
    gamecache saveMap_cache
    trigger trigSaveMapInCache
endglobals



function StartSaveMapInCache takes nothing returns nothing
    local integer i
    call Text_A("starting saving map in gamecache \"epicSlide\"...")
    call FlushStoredMission(saveMap_cache, "terrain")
    call FlushStoredMission(saveMap_cache, "monsterTypes")
    call FlushStoredMission(saveMap_cache, "casterTypes")
    set i = 0
    loop
        exitwhen (i >= NB_MAX_LEVELS)
            call FlushStoredMission(saveMap_cache, "level" + I2S(i))
        set i = i + 1
    endloop
    call SaveTerrainConfig()
    call StartSaveTerrain()
endfunction




//===========================================================================
function Init_SaveMapInCache takes nothing returns nothing
    set saveMap_cache = InitGameCache("epicSlide")
    set trigSaveMapInCache = CreateTrigger()
    call DisableTrigger(trigSaveMapInCache)
    call TriggerRegisterTimerEvent(trigSaveMapInCache, LOW_PERIOD_FOR_WORK, true)
endfunction



endlibrary