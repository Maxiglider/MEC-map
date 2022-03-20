//TESH.scrollpos=84
//TESH.alwaysfold=0
library RandomizeTerrains needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private integer array oldTerrainTypes
    private integer array newTerrainTypes
    private integer lastTerrainArrayId
endglobals





function RandomizeTerrains_Actions takes nothing returns nothing
    local real x
    local integer terrainTypeId
    local boolean done
    local integer j
    local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    set terrainTypeId = GetTerrainType(x, y)
                    set done = false
                    set j = 0
                    loop
                        exitwhen (j > lastTerrainArrayId or done)
                            if (terrainTypeId == oldTerrainTypes[j]) then
                                call ChangeTerrainType(x, y, newTerrainTypes[j])
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
                return
            endif
        //set i = i + 1
    //endloop
endfunction


private function StartTerrainModifying takes nothing returns nothing
    call StopEnabledCheckTerrainTriggers()
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function RandomizeTerrains_Actions)
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction 


function RandomizeTerrains takes nothing returns nothing
    local integer i
    local integer n
    local boolean array isTaken
    local TerrainType array terrainTypes
    
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return
    endif
    
    set n = 0
    set i = 0
    loop
            set terrainTypes[n] = udg_terrainTypes.getWalk(i)
        exitwhen (terrainTypes[n] == 0)
            set oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            set n = n + 1
        set i = i + 1
    endloop
    set i = 0
    loop
            set terrainTypes[n] = udg_terrainTypes.getDeath(i)
        exitwhen (terrainTypes[n] == 0)
            set oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            set n = n + 1
        set i = i + 1
    endloop
    set i = 0
    loop
            set terrainTypes[n] = udg_terrainTypes.getSlide(i)
        exitwhen (terrainTypes[n] == 0)
            set oldTerrainTypes[n] = terrainTypes[n].getTerrainTypeId()
            set n = n + 1
        set i = i + 1
    endloop
    
    set lastTerrainArrayId = n - 1
    
    set i = 0
    loop
        exitwhen (i > lastTerrainArrayId)
            set isTaken[i] = false
        set i = i + 1
    endloop
    
    set i = 0
    loop
        exitwhen (i > lastTerrainArrayId)
            loop
                set n = GetRandomInt(0, lastTerrainArrayId)
                exitwhen (not isTaken[n])
            endloop
            set isTaken[n] = true
            set newTerrainTypes[i] = oldTerrainTypes[n]
        set i = i + 1
    endloop
    
    call StartTerrainModifying() 
    
    set i = 0
    loop
        exitwhen (i > lastTerrainArrayId)
            call terrainTypes[i].setTerrainTypeId(newTerrainTypes[i])
        set i = i + 1
    endloop
endfunction




endlibrary