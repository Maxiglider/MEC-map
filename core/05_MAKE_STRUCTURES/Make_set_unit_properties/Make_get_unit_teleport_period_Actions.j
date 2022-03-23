//TESH.scrollpos=0
//TESH.alwaysfold=0
library MakeGetUnitTeleportPeriodActions needs BasicFunctions, Escaper


function GetUnitTeleportPeriod_Actions takes nothing returns nothing

    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local Make mkGeneral = escaper.getMake()
	local MakeGetUnitTeleportPeriod mk = MakeGetUnitTeleportPeriod(integer(mkGeneral))
    local MonsterTeleport monster
    local real x = GetOrderPointX()
    local real y = GetOrderPointY()
	local integer i

    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(mk.maker)
    
    set monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
    if (monster != 0 and monster.u != null) then
        call Text_mkP(mk.makerOwner, "period : " + R2S(monster.getPeriod()) + " s")
    endif
endfunction



endlibrary

