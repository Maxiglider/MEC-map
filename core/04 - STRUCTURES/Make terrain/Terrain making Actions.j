//TESH.scrollpos=0
//TESH.alwaysfold=0
library TerrainMakingActions needs Escaper


function TerrainMaking_Actions takes nothing returns nothing
    local MakeAction action
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeTerrainCreate mk = MakeTerrainCreate(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY() 
    
    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)	
    
    if (mk.isLastLocSavedUsed()) then
        set action = MakeTerrainCreateAction.create(mk.getTerrainType(), mk.lastX, mk.lastY, x, y)
        if (action == -1) then
            call Text_erP(escaper.getPlayer(), "this terrain type doesn't exist anymore")
        else
            if (action == 0) then
                call Text_erP(escaper.getPlayer(), "too big zone")
            else
                call escaper.newAction(action)
                call mk.unsaveLocDefinitely()
            endif
        endif
    else
        call mk.saveLoc(x, y)
    endif
endfunction


endlibrary