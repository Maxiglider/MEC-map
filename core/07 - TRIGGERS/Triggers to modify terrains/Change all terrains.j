//TESH.scrollpos=177
//TESH.alwaysfold=0
library ChangeAllTerrains needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private integer array oldTerrainTypes
    private integer array newTerrainTypes  
    private integer lastTerrainArrayId  
    private integer nbNewTerrains
    private integer nbNewTerrainsAllowed
    boolean udg_changeAllTerrainsAtRevive = false
endglobals



function ChangeAllTerrains_Actions takes nothing returns nothing
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
    set y = MAP_MIN_Y
    call StopEnabledCheckTerrainTriggers()
    call TriggerClearActions(gg_trg_Terrain_modifying_trig)
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function ChangeAllTerrains_Actions)
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction 


private function GetRandomTerrain_checked takes nothing returns integer
    local integer i
    local integer rdmTerrain
    local boolean alreadyUsed
    loop
        if (nbNewTerrains >= nbNewTerrainsAllowed) then
            set rdmTerrain = GetRandomUsedTerrain()
        else
            set rdmTerrain = GetRandomTerrain()
        endif
            set alreadyUsed = false
            set i = 0
            loop
                exitwhen (i > lastTerrainArrayId or alreadyUsed)
                    set alreadyUsed = (newTerrainTypes[i] == rdmTerrain)
                set i = i + 1
            endloop
        exitwhen (not alreadyUsed)
    endloop
    if (not IsTerrainAlreadyUsed(rdmTerrain)) then
        set nbNewTerrains = nbNewTerrains + 1
    endif
    return rdmTerrain
endfunction


private function GetRandomKnownTerrain_checked takes nothing returns integer
    local integer i
    local integer rdmTerrain
    local boolean alreadyUsed
    loop
        set rdmTerrain = GetRandomUsedTerrain()
            set alreadyUsed = false
            set i = 0
            loop
                exitwhen (i > lastTerrainArrayId or alreadyUsed)
                    set alreadyUsed = (newTerrainTypes[i] == rdmTerrain)
                set i = i + 1
            endloop
        exitwhen (not alreadyUsed)
    endloop
    return rdmTerrain
endfunction


private function GetRandomNotKnownTerrain_checked takes nothing returns integer
    local integer i
    local integer rdmTerrain
    local boolean alreadyUsed
    loop
        set rdmTerrain = GetRandomNotUsedTerrain()
            set alreadyUsed = false
            set i = 0
            loop
                exitwhen (i > lastTerrainArrayId or alreadyUsed)
                    set alreadyUsed = (newTerrainTypes[i] == rdmTerrain)
                set i = i + 1
            endloop
        exitwhen (not alreadyUsed)
    endloop
    return rdmTerrain
endfunction



function ChangeAllTerrains takes string mode returns boolean

//modes : normal, known, notKnown
    local TerrainType array terrainTypes
    local integer n
    local integer i
    
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return false
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
    set nbNewTerrainsAllowed = NB_MAX_OF_TERRAINS - udg_nb_used_terrains
    
    if (mode == "normal") then
        set nbNewTerrains = 0
        set i = 0
        loop
            exitwhen (i > lastTerrainArrayId)
                set newTerrainTypes[i] = GetRandomTerrain_checked()
            set i = i + 1
        endloop
    else
        if (mode == "known") then
            set i = 0
            loop
                exitwhen (i > lastTerrainArrayId)
                    set newTerrainTypes[i] = GetRandomKnownTerrain_checked()
                set i = i + 1
            endloop
        else
            if (mode == "notKnown") then
                set nbNewTerrains = lastTerrainArrayId + 1
                if (nbNewTerrains > nbNewTerrainsAllowed) then
                    return false
                endif
                set i = 0
                loop
                    exitwhen (i > lastTerrainArrayId)
                        set newTerrainTypes[i] = GetRandomNotKnownTerrain_checked()
                    set i = i + 1
                endloop
            endif
        endif
    endif
    
    call StartTerrainModifying() 
    
    set i = 0
    loop
        exitwhen (i > lastTerrainArrayId)
            call terrainTypes[i].setTerrainTypeId(newTerrainTypes[i])
            call AddNewTerrain(newTerrainTypes[i])
        set i = i + 1
    endloop
    
    //call DisplayTextToForce(GetPlayersAll(), " ")
    //call DisplayTextToForce(GetPlayersAll(), udg_colorCode[TEAL] + "       All terrains changed !")
    //set i = 0
    //loop
    //    exitwhen (i > lastTerrainArrayId)
    //        call Text_A(udg_colorCode[RED] + GetTerrainData(newTerrainTypes[i]))
    //    set i = i + 1
    //endloop

    return true
endfunction




endlibrary