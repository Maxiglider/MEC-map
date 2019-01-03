//TESH.scrollpos=31
//TESH.alwaysfold=0
library ExchangeTerrains needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private integer terrainA
    private integer terrainB
endglobals




function ExchangeTerrains_Actions takes nothing returns nothing
    local real x
    local integer terrainType
    //local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    set terrainType = GetTerrainType(x, y)
                    if (terrainType == terrainA) then
                        call ChangeTerrainType( x, y, terrainB )
                    else
                    if (terrainType == terrainB) then
                        call ChangeTerrainType( x, y, terrainA )
                    endif
                    endif
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
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function ExchangeTerrains_Actions)
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction 



function ExchangeTerrains takes string terrainTypeLabelA, string terrainTypeLabelB returns boolean
    local TerrainType terrainTypeA = udg_terrainTypes.get(terrainTypeLabelA)
    local TerrainType terrainTypeB = udg_terrainTypes.get(terrainTypeLabelB)
    if (terrainTypeA == terrainTypeB or terrainTypeA == 0 or terrainTypeB == 0) then
        return false
    endif
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return false
    endif
    
    set terrainA = terrainTypeA.getTerrainTypeId()
    set terrainB = terrainTypeB.getTerrainTypeId()
    
    call StartTerrainModifying()  
    
    call terrainTypeA.setTerrainTypeId(terrainB)
    call terrainTypeB.setTerrainTypeId(terrainA)
    return true
endfunction
    



endlibrary