//TESH.scrollpos=0
//TESH.alwaysfold=0
library CasterMakingActions needs BasicFunctions, Escaper



function CasterMaking_Actions takes nothing returns nothing
    local Caster caster
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeCaster mk = MakeCaster(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    set caster = escaper.getMakingLevel().casters.new(mk.getCasterType(), x, y, mk.getAngle(), true)
    call escaper.newAction(MakeCasterAction.create(escaper.getMakingLevel(), caster))
endfunction



endlibrary