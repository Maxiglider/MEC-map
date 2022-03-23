//TESH.scrollpos=74
//TESH.alwaysfold=0
library ReinitTerrains initializer Init_ReinitTerrains needs AllTerrainFunctions, TerrainModifyingTrig



globals
    private TerrainType array terrainTypes
    private integer array terrainTypeIds
    private integer array terrainTypeIdsToReplace
endglobals


private function SaveTerrainConfig takes nothing returns nothing
    local integer n = 0
    local integer i = 0
    loop
        exitwhen (i >= udg_terrainTypes.numberOfWalk)
            set terrainTypes[n] = udg_terrainTypes.getWalk(i)
            set terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
            set n = n + 1
        set i = i + 1
    endloop
    set i = 0
    loop
        exitwhen (i >= udg_terrainTypes.numberOfDeath)
            set terrainTypes[n] = udg_terrainTypes.getDeath(i)
            set terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
            set n = n + 1
        set i = i + 1
    endloop
    set i = 0
    loop
        exitwhen (i >= udg_terrainTypes.numberOfSlide)
            set terrainTypes[n] = udg_terrainTypes.getSlide(i)
            set terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
            set n = n + 1
        set i = i + 1
    endloop
endfunction


function Init_ReinitTerrains takes nothing returns nothing
    local trigger trig = CreateTrigger()
    call TriggerAddAction(trig, function SaveTerrainConfig)
    call TriggerRegisterTimerEvent(trig, 0, false)
    set trig = null
endfunction






function ReinitTerrains_Actions takes nothing returns nothing
    local real x
    local integer terrainTypeId
    local boolean done
    local integer j
    //local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    set terrainTypeId = GetTerrainType(x, y)
                    set done = false
                    set j = 0
                    loop
                        exitwhen (terrainTypes[j] == 0 or done)
                            if (terrainTypeId == terrainTypeIdsToReplace[j]) then
                                call ChangeTerrainType(x, y, terrainTypeIds[j])
                                set done = true
                            endif
                        set j = j + 1
                    endloop
                set x = x + LARGEUR_CASE
            endloop
            set y = y + LARGEUR_CASE
            if (y > MAP_MAX_Y) then
                call DisableTrigger(GetTriggeringTrigger())
                call RestartEnabledCheckTerrainTriggers()
                set terrainModifyWorking = false
                call Text_mkA("Terrains reinitialized")
                return
            endif
        //set i = i + 1
    //endloop
endfunction


private function StartTerrainModifying takes nothing returns nothing
    call StopEnabledCheckTerrainTriggers()
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function ReinitTerrains_Actions)
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction 


function ReinitTerrains takes nothing returns nothing
    local integer i 
    
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return
    endif
    
    set i = 0
    loop
        exitwhen (terrainTypes[i] == 0)
            set terrainTypeIdsToReplace[i] = terrainTypes[i].getTerrainTypeId()
            call terrainTypes[i].setTerrainTypeId(terrainTypeIds[i])
        set i = i + 1
    endloop
    call StartTerrainModifying()
endfunction




endlibrary