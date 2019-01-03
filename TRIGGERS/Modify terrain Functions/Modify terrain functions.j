//TESH.scrollpos=12
//TESH.alwaysfold=0
library ModifyTerrainFunctions needs TerrainFunctions




function GetNbCaseBetween takes real minX, real minY, real maxX, real maxY returns integer
    return (R2I((maxX - minX)/LARGEUR_CASE) * R2I((maxY - minY)/LARGEUR_CASE))
endfunction


function ChangeTerrainType takes real x, real y, integer terrainTypeId returns nothing
    call SetTerrainType(x, y, terrainTypeId, -1, 1, 0)   
endfunction


function ChangeTerrainBetween takes integer terrainType, real x1, real y1, real x2, real y2 returns boolean
    local real minX = RMinBJ(x1, x2)
    local real minY = RMinBJ(y1, y2)
    local real maxX = RMaxBJ(x1, x2)
    local real maxY = RMaxBJ(y1, y2)

    local real r
    local real x
    local real y

    //call Text.A( "nbCases == " + I2S( GetNbCaseBetween( minX, minY, maxX, maxY ) ) )
    //call Text.A( "changing terrain to : " + TerrainTypeId2TerrainTypeAsciiString( terrainType ) )
    
    if (GetNbCaseBetween(minX, minY, maxX, maxY) > NB_MAX_TILES_MODIFIED) then
        return false
    endif
    if (not CanUseTerrain(terrainType)) then
        return false
    endif
    
    set x = minX
    set y = minY

    loop
        exitwhen (y > maxY)
            loop
                exitwhen (x > maxX)
                    call ChangeTerrainType(x, y, terrainType)  
                set x = x + LARGEUR_CASE
            endloop
            set x = minX
        set y = y + LARGEUR_CASE
    endloop 
    
    //call Text.A( "terrain changed to : " + TerrainTypeId2TerrainTypeAsciiString( GetTerrainType( minX, minY ) ) )
    
    return true
endfunction





endlibrary