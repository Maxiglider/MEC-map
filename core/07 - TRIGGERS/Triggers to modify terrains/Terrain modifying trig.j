//TESH.scrollpos=11
//TESH.alwaysfold=0
library TerrainModifyingTrig initializer Init_TerrainModifyingTrig



globals
    real y
    private boolean array wasCheckTerrainTriggerOn
    boolean terrainModifyWorking = false
    //constant integer TERRAIN_MODIFYING_NB_LINES_TO_DO = 5
    //maintenant on fait ligne par ligne (--> 1)
endglobals



function Init_TerrainModifyingTrig takes nothing returns nothing
    set gg_trg_Terrain_modifying_trig = CreateTrigger()
    call DisableTrigger(gg_trg_Terrain_modifying_trig)
    call TriggerRegisterTimerEvent(gg_trg_Terrain_modifying_trig, LOW_PERIOD_FOR_WORK, true)
endfunction


function StopEnabledCheckTerrainTriggers takes nothing returns nothing
    local Escaper escaper
    local integer i = 0
    loop
        exitwhen (i > 11)
            set escaper = udg_escapers.get(i)
            if (escaper != 0) then
                if (escaper.doesCheckTerrain()) then
                    set wasCheckTerrainTriggerOn[i] = true
                    call escaper.enableCheckTerrain(false)
                else
                    set wasCheckTerrainTriggerOn[i] = false
                endif
            endif
        set i = i + 1
    endloop
endfunction


function RestartEnabledCheckTerrainTriggers takes nothing returns nothing
    local Escaper escaper
    local integer i = 0
    loop
        exitwhen (i > 11)
            set escaper = udg_escapers.get(i)
            if (escaper != 0) then
                if (wasCheckTerrainTriggerOn[i]) then
                    call escaper.enableCheckTerrain(true)
                endif
            endif
        set i = i + 1
    endloop
endfunction



endlibrary