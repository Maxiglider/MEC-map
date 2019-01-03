//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeExchangeTerrainsActions needs Escaper, ExchangeTerrains


function MakeExchangeTerrains_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeExchangeTerrains mk = MakeExchangeTerrains(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY() 
    local TerrainType terrainTypeA
    local TerrainType terrainTypeB
    
    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)	
    
    if (mk.isLastLocSavedUsed()) then
        set terrainTypeA = udg_terrainTypes.getTerrainType(mk.lastX, mk.lastY)
        set terrainTypeB = udg_terrainTypes.getTerrainType(x, y)
        call ExchangeTerrains(terrainTypeA.label, terrainTypeB.label)
        call mk.unsaveLocDefinitely()
    else
        call mk.saveLoc(x, y)
    endif
endfunction


endlibrary
