//TESH.scrollpos=54
//TESH.alwaysfold=0
library SaveLoadTerrainWithoutName needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private TerrainType array terrainSave [232000]
    private integer terrainSave_id
endglobals



    //save terrain
    

private function SaveTerrain_Actions takes nothing returns nothing
    local real x = MAP_MIN_X
    loop
        exitwhen (x > MAP_MAX_X)
            set terrainSave[terrainSave_id] = udg_terrainTypes.getTerrainType(x, y)
            set terrainSave_id = terrainSave_id + 1
        set x = x + LARGEUR_CASE
    endloop
    
    set y = y + LARGEUR_CASE
    if (y > MAP_MAX_Y) then
        set terrainModifyWorking = false
        call DisableTrigger(GetTriggeringTrigger())
        call Text_mkA("Terrain saved")
        return
    endif
endfunction


function SaveTerrainWithoutName takes nothing returns nothing
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return
    endif
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function SaveTerrain_Actions)
    set terrainSave_id = 0
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction






    //load terrain
    
    
    
    
private function LoadTerrain_Actions takes nothing returns nothing
    local real x
    //local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    if (terrainSave[terrainSave_id] != 0) then
                        call ChangeTerrainType(x, y, terrainSave[terrainSave_id].getTerrainTypeId())
                    endif
                    set terrainSave_id = terrainSave_id + 1
                set x = x + LARGEUR_CASE
            endloop
            set y = y + LARGEUR_CASE
            if (y > MAP_MAX_Y) then
                call RestartEnabledCheckTerrainTriggers()
                call Text_mkA("Terrain loaded")
                call DisableTrigger(GetTriggeringTrigger())
                set terrainModifyWorking = false
                return
            endif
        //set i = i + 1
    //endloop    
endfunction



function LoadTerrainWithoutName takes nothing returns nothing
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return
    endif
    call TriggerClearActions( gg_trg_Terrain_modifying_trig )
    call TriggerAddAction( gg_trg_Terrain_modifying_trig, function LoadTerrain_Actions )
    set terrainSave_id = 0
    set y = MAP_MIN_Y
    call EnableTrigger( gg_trg_Terrain_modifying_trig )
    set terrainModifyWorking = true
    call StopEnabledCheckTerrainTriggers()
endfunction 




endlibrary