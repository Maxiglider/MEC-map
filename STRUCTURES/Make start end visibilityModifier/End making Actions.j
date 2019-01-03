//TESH.scrollpos=0
//TESH.alwaysfold=0
library EndMakingActions needs Escaper



function EndMaking_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeEnd mk = MakeEnd(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
    
    if (not IsIssuedOrder("smart")) then   
        return
    endif
    call StopUnit(mk.maker)
    
	
    if (mk.isLastLocSavedUsed()) then
        call escaper.getMakingLevel().newEnd(mk.lastX, mk.lastY, x, y)
        call Text_mkP(mk.makerOwner, "end made for level " + I2S(escaper.getMakingLevel().getId()))
        call escaper.destroyMake()
    else
        call mk.saveLoc(x, y)
    endif
endfunction



endlibrary