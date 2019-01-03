//TESH.scrollpos=0
//TESH.alwaysfold=0
library GettingTerrainTypeInfoActions needs Escaper



function GettingTerrainTypeInfo_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeGetTerrainType mk = MakeGetTerrainType(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
	
    call Text_P(mk.makerOwner, GetTerrainData(GetTerrainType(x, y)))
endfunction





endlibrary