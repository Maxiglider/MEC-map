//TESH.scrollpos=73
//TESH.alwaysfold=0
library TerrainFunctions needs TerrainTypeAsciiConversion, TerrainTypeMax, TerrainTypeGrass, TerrainTypeFunctions



function IsTerrainAlreadyUsed takes integer terrainType returns boolean
    local integer i = 0
    loop
        exitwhen (udg_used_terrain_types[i] == 0)
            if (udg_used_terrain_types[i] == terrainType) then
                return true
            endif
        set i = i + 1
    endloop
    return false
endfunction


function IsTerrainsLimitNumberReached takes nothing returns boolean
    return (udg_nb_used_terrains == NB_MAX_OF_TERRAINS)
endfunction


function AddNewTerrain takes integer newTerrain returns boolean
    if (IsTerrainsLimitNumberReached() or IsTerrainAlreadyUsed(newTerrain)) then
        return false
    endif
    set udg_used_terrain_types[udg_nb_used_terrains] = newTerrain
    set udg_nb_used_terrains = udg_nb_used_terrains + 1
    return true
endfunction

function CanUseTerrain takes integer terrainType returns boolean
    if (IsTerrainAlreadyUsed(terrainType)) then
        return true
    endif
    return AddNewTerrain(terrainType)
endfunction


function GetRandomTerrain takes nothing returns integer
    return TerrainTypeMaxId2TerrainTypeId(GetRandomInt(1, NB_TERRAINS_TOTAL))
endfunction


function GetRandomUsedTerrain takes nothing returns integer
    return udg_used_terrain_types[GetRandomInt(0, udg_nb_used_terrains-1)]
endfunction


function GetRandomNotUsedTerrain takes nothing returns integer
    local integer terrainType
    loop
        set terrainType = GetRandomTerrain()
        exitwhen (not IsTerrainAlreadyUsed(terrainType))
    endloop
    return terrainType  
endfunction


function GetTerrainName takes integer terrain returns string
    if (terrain > NB_TERRAINS_TOTAL) then
        return TERRAIN_TYPE_NAMES[TerrainTypeId2TerrainTypeMaxId(terrain)]
    endif
    if (terrain <= 0) then
        return null
    endif
    return TERRAIN_TYPE_NAMES[terrain]        
endfunction


function GetTerrainData takes integer terrain returns string
    //GetTerrainData('Nice') == "46 : Northrend - Glace    'Nice'"
    local string str
    local integer maxId
    local TerrainType terrainType
    
    if (terrain > NB_TERRAINS_TOTAL) then
        set maxId = TerrainTypeId2TerrainTypeMaxId(terrain)
    else
        if (terrain > 0) then
            set maxId = terrain
            set terrain = TerrainTypeMaxId2TerrainTypeId(maxId)
        else
            return null
        endif
    endif
    set str = udg_colorCode[RED] + TERRAIN_TYPE_DATA[maxId]
    
    set terrainType = TerrainTypeId2TerrainType(terrain)
    if (terrainType != 0) then
        if (terrainType.getKind() == "slide") then
            set str = str + COLOR_TERRAIN_SLIDE
        else 
            if (terrainType.getKind() == "walk") then
                set str = str + COLOR_TERRAIN_WALK
            else
                set str = str + COLOR_TERRAIN_DEATH
            endif
        endif
        set str = str + "        " + terrainType.label
        if (terrainType.theAlias != null) then
            set str = str + "  " + terrainType.theAlias
        endif
    endif
    
    return str
endfunction


function DisplayTerrainDataToPlayer takes player p, integer terrain returns nothing
    call DisplayTimedTextToPlayer(p, 0., 0., TERRAIN_DATA_DISPLAY_TIME, GetTerrainData(terrain))
endfunction





endlibrary

