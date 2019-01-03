//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainHeightMakingActions needs BasicFunctions, Escaper



function TerrainHeightMaking_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeTerrainHeight mk = MakeTerrainHeight(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    call escaper.newAction(MakeTerrainHeightAction.create(mk.getRadius(), mk.getHeight(), x, y))
endfunction



endlibrary