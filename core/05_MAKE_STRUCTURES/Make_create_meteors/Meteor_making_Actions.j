//TESH.scrollpos=0
//TESH.alwaysfold=0
library MeteorMakingActions needs BasicFunctions, Escaper



function MeteorMaking_Actions takes nothing returns nothing
    local Meteor meteor
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeMeteor mk = MakeMeteor(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    set meteor = escaper.getMakingLevel().meteors.new(x, y, true)
    call escaper.newAction(MakeMeteorAction.create(escaper.getMakingLevel(), meteor))
endfunction



endlibrary