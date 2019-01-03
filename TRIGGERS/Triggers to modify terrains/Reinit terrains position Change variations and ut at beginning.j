//TESH.scrollpos=0
//TESH.alwaysfold=0
library ReinitTerrainsPositions initializer Init_Reinit_terrains_position_Change_variations_and_ut_at_beginning needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private TerrainType array TERRAIN_SAVE [232000]
    private integer terrainSave_id
endglobals



    //save terrain at init
    


private function SaveTerrain_Actions takes nothing returns nothing
    local integer terrainType
    local real x = MAP_MIN_X
    loop
        exitwhen (x > MAP_MAX_X)
            set terrainType = GetTerrainType(x, y)
            //mise à jour used terrain (-ut)
            call AddNewTerrain(terrainType)
            //changer variations
            call ChangeTerrainType(x, y, terrainType)
            //sauvegarde du terrain
            set TERRAIN_SAVE[terrainSave_id] = TerrainTypeId2TerrainType(terrainType)
            set terrainSave_id = terrainSave_id + 1
        set x = x + LARGEUR_CASE
    endloop
    
    set y = y + LARGEUR_CASE
    if (y > MAP_MAX_Y) then
        set terrainModifyWorking = false
        call DisableTrigger(GetTriggeringTrigger())
        return
    endif
endfunction


private function StartSaveTerrain takes nothing returns nothing
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function SaveTerrain_Actions)
    set terrainSave_id = 0
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
    call DestroyTrigger(GetTriggeringTrigger())
endfunction


function Init_Reinit_terrains_position_Change_variations_and_ut_at_beginning takes nothing returns nothing
    local trigger trig = CreateTrigger()
    call TriggerAddAction(trig, function StartSaveTerrain)
    call TriggerRegisterTimerEvent(trig, 0, false)
    set trig = null
endfunction



//=========================================================================


    //reinitTerrainPositions
    
    
function ReinitTerrainsPosition_Actions takes nothing returns nothing
    local real x
    //local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    if (TERRAIN_SAVE[terrainSave_id] != 0 and TERRAIN_SAVE[terrainSave_id].getTerrainTypeId() != 0) then
                        call ChangeTerrainType(x, y, TERRAIN_SAVE[terrainSave_id].getTerrainTypeId())
                    endif
                    set terrainSave_id = terrainSave_id + 1
                set x = x + LARGEUR_CASE
            endloop
            set y = y + LARGEUR_CASE
            if (y > MAP_MAX_Y) then
                call Text_mkA("Terrains position reinitialized !")
                call DisableTrigger( GetTriggeringTrigger() )
                set terrainModifyWorking = false
                call RestartEnabledCheckTerrainTriggers()
                return
            endif
        //set i = i + 1
    //endloop
endfunction



private function StartTerrainModifying takes nothing returns nothing
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function ReinitTerrainsPosition_Actions)
    set terrainSave_id = 0
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
    call StopEnabledCheckTerrainTriggers()
endfunction 





function ReinitTerrainsPosition takes nothing returns nothing
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return
    endif
    call StartTerrainModifying()
endfunction






endlibrary