//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainTypeFromString needs TerrainFunctions



function TerrainTypeString2TerrainTypeId takes string str returns integer
    if (IsPositiveInteger(str)) then
        return TerrainTypeMaxId2TerrainTypeId(S2I(str))
    endif
    if (SubStringBJ(str, 1, 1) == "g" and IsPositiveInteger(SubStringBJ(str, 2, StringLength(str)))) then
        return TerrainTypeGrassId2TerrainTypeId(S2I(SubStringBJ(str, 2, StringLength(str))))
    endif
    if (StringLength(str) == 6 and SubStringBJ(str, 1, 1) == "'" and SubStringBJ(str, 6, 6) == "'") then
        return TerrainTypeAsciiString2TerrainTypeId(str)
    endif
    if (str == "x") then
        return GetRandomTerrain()
    endif
    if (str == "xnk") then
        return GetRandomNotUsedTerrain()         
    endif
    if (str == "xak") then
        return GetRandomUsedTerrain()
    endif
    return 0
endfunction




endlibrary
