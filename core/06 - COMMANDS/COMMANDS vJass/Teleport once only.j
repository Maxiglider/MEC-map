//TESH.scrollpos=0
//TESH.alwaysfold=0
library TeleportOnceOnly needs BasicFunctions


globals
    private trigger array teleTriggers
endglobals


function TeleportOnceOnly_Actions takes nothing returns nothing
    local unit hero = GetTriggerUnit()
    
    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(hero)
    
    call SetUnitX(hero, GetOrderPointX())
    call SetUnitY(hero, GetOrderPointY())
    call DestroyTrigger(GetTriggeringTrigger())
    set hero = null
endfunction



function ActivateTeleportOnceOnly takes unit hero returns nothing
    local integer playerId = GetUnitUserData(hero)
    call DestroyTrigger(teleTriggers[playerId])
    set teleTriggers[playerId] = CreateTrigger()
    call TriggerAddAction(teleTriggers[playerId], function TeleportOnceOnly_Actions)
    call TriggerRegisterUnitEvent(teleTriggers[playerId], hero, EVENT_UNIT_ISSUED_POINT_ORDER )
endfunction




endlibrary