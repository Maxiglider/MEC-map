//TESH.scrollpos=0
//TESH.alwaysfold=0
library MMNoMoveActions needs BasicFunctions, Escaper



function MonsterMakingNoMove_Actions takes nothing returns nothing
    local Monster monster
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeMonsterNoMove mk = MakeMonsterNoMove(integer(mkGeneral))
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    set monster = escaper.getMakingLevel().monstersNoMove.new(mk.getMonsterType(), x, y, mk.getFacingAngle(), true)
    call escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
endfunction



endlibrary