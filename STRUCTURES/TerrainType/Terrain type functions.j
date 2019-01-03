//TESH.scrollpos=1
//TESH.alwaysfold=0
library TerrainTypeFunctions


function TerrainTypeId2TerrainType takes integer terrainTypeId returns TerrainType
    local integer i = 0
    loop
        exitwhen (i >= udg_terrainTypes.numberOfWalk)
            if (udg_terrainTypes.getWalk(i).getTerrainTypeId() == terrainTypeId) then
                return udg_terrainTypes.getWalk(i)
            endif
        set i = i + 1
    endloop
    set i = 0
    loop
        exitwhen (i >= udg_terrainTypes.numberOfDeath)
            if (udg_terrainTypes.getDeath(i).getTerrainTypeId() == terrainTypeId) then
                return udg_terrainTypes.getDeath(i)
            endif
        set i = i + 1
    endloop
    set i = 0
    loop
        exitwhen (i >= udg_terrainTypes.numberOfSlide)
            if (udg_terrainTypes.getSlide(i).getTerrainTypeId() == terrainTypeId) then
                return udg_terrainTypes.getSlide(i)
            endif
        set i = i + 1
    endloop
    return 0
endfunction



function IsTerrainTypeOfKind takes integer terrainTypeId, string terrainTypeKind returns boolean
    local TerrainType terrainType = TerrainTypeId2TerrainType(terrainTypeId)
    if (terrainType == 0) then
        return false
    endif
    return (terrainTypeKind == terrainType.getKind())
endfunction




endlibrary