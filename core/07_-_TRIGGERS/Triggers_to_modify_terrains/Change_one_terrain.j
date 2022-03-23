//TESH.scrollpos=35
//TESH.alwaysfold=0
library ChangeOneTerrain needs AllTerrainFunctions, TerrainModifyingTrig


globals
    private integer oldTerrain
    private integer newTerrain
endglobals




function ChangeAppearanceOfOneTerrain_Actions takes nothing returns nothing
    local real x
    //local integer i = 1
    //loop
        //exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
            set x = MAP_MIN_X
            loop
                exitwhen (x > MAP_MAX_X)
                    if (GetTerrainType(x, y) == oldTerrain) then
                        call ChangeTerrainType(x, y, newTerrain)
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
    call TriggerAddAction(gg_trg_Terrain_modifying_trig, function ChangeAppearanceOfOneTerrain_Actions)
    set y = MAP_MIN_Y
    call EnableTrigger(gg_trg_Terrain_modifying_trig)
    set terrainModifyWorking = true
endfunction 


function ChangeOneTerrain takes string terrainTypeLabel, string newTerrainType returns string
    local TerrainType terrainType
    if (terrainModifyWorking) then
        call Text_erA("can't execute two commands of this type simultaneously !")
        return null
    endif
    
    set terrainType = udg_terrainTypes.get(terrainTypeLabel)
    if (terrainType == 0) then
        return null
    endif
    
    set oldTerrain = terrainType.getTerrainTypeId()
    set newTerrain = TerrainTypeString2TerrainTypeId(newTerrainType)
    if (newTerrain == 0) then
        return null
    endif
    if (udg_terrainTypes.isTerrainTypeIdAlreadyUsed(newTerrain)) then
        return null
    endif
    if (not terrainType.setTerrainTypeId(newTerrain)) then
        return null
    endif
    
    call StartTerrainModifying()   
    return GetTerrainData(newTerrain)
endfunction




endlibrary



