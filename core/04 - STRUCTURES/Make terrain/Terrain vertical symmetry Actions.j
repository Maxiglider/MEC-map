//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainVerticalSymmetryActions needs Escaper


function TerrainVerticalSymmetry_Actions takes nothing returns nothing
    local MakeAction action
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeTerrainVerticalSymmetry mk = MakeTerrainVerticalSymmetry(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY() 
    
    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)	
    
    if (mk.isLastLocSavedUsed()) then
        set action = MakeTerrainVerticalSymmetryAction.create(mk.lastX, mk.lastY, x, y)
        if (action == 0) then
            call Text_erP(escaper.getPlayer(), "too big zone")
        else
            call escaper.newAction(action)
            call mk.unsaveLocDefinitely()
        endif
    else
        call mk.saveLoc(x, y)
    endif
endfunction


endlibrary