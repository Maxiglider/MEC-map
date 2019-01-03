//TESH.scrollpos=48
//TESH.alwaysfold=0
library SaveTerrain needs Text, SaveTerrainHeights


globals
    private real y
    private integer array terrainTypeIds //16 au max
    private integer nbTerrainTypesUsed
endglobals


private function SaveTerrainsUsed takes nothing returns nothing
    local integer i
    set stringArrayForCache = StringArrayForCache.create("terrain", "terrainsUsed", false)
    set i = 0
    loop
        exitwhen (i >= nbTerrainTypesUsed)
            call stringArrayForCache.push(Ascii2String(terrainTypeIds[i]))
        set i = i + 1
    endloop
    call stringArrayForCache.writeInCache()
    call Text_A("terrains used saved")
endfunction

private function SaveMapDimensionsAndCenterOffset takes nothing returns nothing
    local integer largeurMap = R2I((MAP_MAX_X - MAP_MIN_X)/LARGEUR_CASE)
    local integer hauteurMap = R2I((MAP_MAX_Y - MAP_MIN_Y)/LARGEUR_CASE)
    local integer offsetX = R2I(MAP_MIN_X)
    local integer offsetY = R2I(MAP_MIN_Y)
    set stringArrayForCache = StringArrayForCache.create("terrain", "largeur", false)
    call stringArrayForCache.push(I2S(largeurMap))
    call stringArrayForCache.writeInCache()
    set stringArrayForCache = StringArrayForCache.create("terrain", "hauteur", false)
    call stringArrayForCache.push(I2S(hauteurMap))
    call stringArrayForCache.writeInCache()
    set stringArrayForCache = StringArrayForCache.create("terrain", "centerOffsetX", false)
    call stringArrayForCache.push(I2S(offsetX))
    call stringArrayForCache.writeInCache()
    set stringArrayForCache = StringArrayForCache.create("terrain", "centerOffsetY", false)
    call stringArrayForCache.push(I2S(offsetY))
    call stringArrayForCache.writeInCache()
    call Text_A("map dimensions and center offset saved")
endfunction


private function I2HexaString takes integer n returns string
    if (n < 10) then
        return I2S(n)
    endif
    if (n == 10) then
        return "A"
    endif
    if (n == 11) then
        return "B"
    endif
    if (n == 12) then
        return "C"
    endif
    if (n == 13) then
        return "D"
    endif
    if (n == 14) then
        return "E"
    endif
    if (n == 15) then
        return "F"
    endif
    return "0"
endfunction

//crée si besoin une nouvelle instance dans le tableau et retourne l'id de cet élément de tableau
private function GetTerrainId takes real x, real y returns string
    local integer terrainTypeId = GetTerrainType(x, y)
    local integer i = 0
    loop
        exitwhen (i >= nbTerrainTypesUsed)
            if (terrainTypeId == terrainTypeIds[i]) then
                return I2HexaString(i)
            endif
        set i = i + 1
    endloop
    if (nbTerrainTypesUsed < 16) then
        set terrainTypeIds[nbTerrainTypesUsed] = terrainTypeId
        set nbTerrainTypesUsed = nbTerrainTypesUsed + 1
    endif
    return I2HexaString(nbTerrainTypesUsed - 1)
endfunction


function GererOrdreTerrains takes nothing returns nothing
    local TerrainType terrainType
    local TerrainType array terrainTypes
    local integer nbOrderedTerrains = 0
    local integer numTerrain = 0
    local integer ordreMinTerrainId
    local integer ordreMin
    //récupération de tous les terrains
    local integer i = 0
    loop
        set terrainType = udg_terrainTypes.getWalk(i)
        exitwhen (terrainType == 0)
        set terrainTypes[numTerrain] = terrainType
        set numTerrain = numTerrain + 1
        set i = i + 1
    endloop
    set i = 0
    loop
        set terrainType = udg_terrainTypes.getSlide(i)
        exitwhen (terrainType == 0)
        set terrainTypes[numTerrain] = terrainType
        set numTerrain = numTerrain + 1
        set i = i + 1
    endloop
    set i = 0
    loop
        set terrainType = udg_terrainTypes.getDeath(i)
        exitwhen (terrainType == 0)
        set terrainTypes[numTerrain] = terrainType
        set numTerrain = numTerrain + 1
        set i = i + 1
    endloop
    //suppression des terrains non ordonnés du tableau
    set i = 0
    loop
        exitwhen (i == udg_terrainTypes.count())
            if (terrainTypes[i].getOrderId() != 0) then
                if (i != nbOrderedTerrains) then
                    set terrainTypes[nbOrderedTerrains] = terrainTypes[i]
                endif
                set nbOrderedTerrains = nbOrderedTerrains + 1
            endif
        set i = i + 1
    endloop
    //tri du tableau
    set numTerrain = 0
    loop
        exitwhen (numTerrain >= nbOrderedTerrains - 1)
            //on trouve l'emplacement du terrain avec l'ordre le plus petit
            set ordreMin = 100
            set i = numTerrain
            loop
                exitwhen (i == nbOrderedTerrains)
                    if (terrainTypes[i].getOrderId() < ordreMin) then
                        set ordreMinTerrainId = i
                        set ordreMin = terrainTypes[i].getOrderId()
                    endif
                set i = i + 1
            endloop
            //on inverse l'emplacement du terrain trouvé avec celui du premier terrain non trié
            if (ordreMinTerrainId != numTerrain) then
                set terrainType = terrainTypes[numTerrain]
                set terrainTypes[numTerrain] = terrainTypes[ordreMinTerrainId]
                set terrainTypes[ordreMinTerrainId] = terrainType
            endif
        set numTerrain = numTerrain + 1
    endloop
    //sauvegarde des terrains dans les variables finales
    set nbTerrainTypesUsed = nbOrderedTerrains
    set i = 0
    loop
        exitwhen (i == nbOrderedTerrains)
            set terrainTypeIds[i] = terrainTypes[i].getTerrainTypeId()
        set i = i + 1
    endloop
endfunction


private function SaveTerrain_Actions takes nothing returns nothing
    local real x
    if (y <= MAP_MAX_Y) then
        set x = MAP_MIN_X
        loop
            exitwhen (x > MAP_MAX_X)
                call stringArrayForCache.push(GetTerrainId(x, y))
            set x = x + LARGEUR_CASE
        endloop
        set y = y + LARGEUR_CASE
    else
        call DisableTrigger(GetTriggeringTrigger())
        call stringArrayForCache.writeInCache()
        call Text_A("terrain saved")
        call SaveTerrainsUsed()
        call SaveMapDimensionsAndCenterOffset()
        call StartSaveTerrainHeights()
    endif
endfunction


function StartSaveTerrain takes nothing returns nothing
    set y = MAP_MIN_Y
    call GererOrdreTerrains()
    set stringArrayForCache = StringArrayForCache.create("terrain", "terrainTypes", false)
    call TriggerClearActions(trigSaveMapInCache)
    call TriggerAddAction(trigSaveMapInCache, function SaveTerrain_Actions)
    call EnableTrigger(trigSaveMapInCache)
endfunction





endlibrary