//TESH.scrollpos=81
//TESH.alwaysfold=0
library SaveLoadTerrainWithName needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private integer saveNameInt
    private hashtable terrainSaves = InitHashtable()
    private integer terrainSave_id
endglobals



    //save terrain
    

private function SaveTerrain_Actions takes nothing returns nothing
    local real x = MAP_MIN_X
    loop
        exitwhen (x > MAP_MAX_X)
        //call Text_A("avant")
            call SaveInteger(terrainSaves, saveNameInt, terrainSave_id, integer(udg_terrainTypes.getTerrainType(x, y)))
        //call Text_A("après")
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


function SaveTerrainWithName takes string saveName returns nothing
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return
    endif
    set saveNameInt = StringHash(saveName)
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function SaveTerrain_Actions)
    set terrainSave_id = 0
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction


function DeleteTerrainSaveWithName takes string saveName returns boolean
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return false
    endif
    set saveNameInt = StringHash(saveName)
    if (not HaveSavedInteger(terrainSaves, saveNameInt, 0)) then
        return false
    endif
    call FlushChildHashtable(terrainSaves, saveNameInt)
    return true
endfunction
    






    //load terrain
    
    
    
    
private function LoadTerrain_Actions takes nothing returns nothing
    local TerrainType terrainType
    local real x
    //local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    set terrainType = TerrainType(LoadInteger(terrainSaves, saveNameInt, terrainSave_id))
                    if (terrainType != 0) then
                        call ChangeTerrainType(x, y, terrainType.getTerrainTypeId())
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



function LoadTerrainWithName takes string saveName returns boolean
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return true
    endif
    set saveNameInt = StringHash(saveName)
    if (not HaveSavedInteger(terrainSaves, saveNameInt, 0)) then
        return false
    endif
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function LoadTerrain_Actions)
    set terrainSave_id = 0
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
    call StopEnabledCheckTerrainTriggers()
    return true
endfunction 





endlibrary