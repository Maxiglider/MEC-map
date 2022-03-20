//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainCopyPasteActions needs Escaper


function TerrainCopyPaste_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeTerrainCopyPaste mk = MakeTerrainCopyPaste(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY() 
    
    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)	
    
    call mk.saveLoc(x, y)
endfunction



endlibrary