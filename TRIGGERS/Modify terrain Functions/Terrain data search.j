//DISABLED TRIGGER

//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainFunctionsB needs TerrainTypeConversions


globals
    private string search
    private integer maxId
    private integer nbResults
    private player p
    constant integer NB_TERRAIN_TO_DO = 4
endglobals



function Trig_terrain_data_search_Actions takes nothing returns nothing
    local string terrainData
    local integer i
    
    set i = 1
    loop
        exitwhen (i > 4)
            set terrainData = StringCase(StringRemoveSpaces(TERRAIN_TYPE_DATA[maxId]), false)
            //call DisplayTextToPlayer(p, 0., 0., terrainData)
            if (StringContains(terrainData, search)) then
                set nbResults = nbResults + 1
                call DisplayTerrainDataToPlayer(p, maxId)
            endif
            set maxId = maxId + 1
            if (maxId > NB_TERRAINS_TOTAL) then
                call DisplayTimedTextToPlayer(p, 0., 0., TERRAIN_DATA_DISPLAY_TIME, udg_colorcode_player[TEAL] + "    number of results : " + I2S(nbResults))
                call DisableTrigger(GetTriggeringTrigger())
                return
            endif
        set i = i + 1
    endloop

endfunction

//===========================================================================
function InitTrig_Terrain_data_search takes nothing returns nothing
    set gg_trg_Terrain_data_search = CreateTrigger(  )
    call DisableTrigger( gg_trg_Terrain_data_search )
    call TriggerAddAction( gg_trg_Terrain_data_search, function Trig_terrain_data_search_Actions )
    call TriggerRegisterTimerEvent( gg_trg_Terrain_data_search, LOW_PERIOD_FOR_WORK, true)
endfunction




function DisplayTerrainDataSearchToPlayer takes player thePlayer, string theSearch returns nothing

    loop
        exitwhen (not IsTriggerEnabled(gg_trg_Terrain_data_search))
        call TriggerSleepAction(0.)
    endloop
    
    set search = StringCase(StringRemoveSpaces(theSearch), false)
    set maxId = 1
    set nbResults = 0
    set p = thePlayer
    call DisplayLineToPlayer(p)
    call EnableTrigger(gg_trg_Terrain_data_search)
    
endfunction







endlibrary