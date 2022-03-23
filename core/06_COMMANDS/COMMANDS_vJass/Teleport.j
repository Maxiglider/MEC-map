library Teleport needs BasicFunctions


globals
    private trigger array teleTriggers
    private boolean array onceOnly
endglobals


function Teleport_Actions takes nothing returns nothing
    local unit hero = GetTriggerUnit()
    
    if (not IsIssuedOrder("smart")) then
        return
    endif
    call StopUnit(hero)
    
    call SetUnitX(hero, GetOrderPointX())
    call SetUnitY(hero, GetOrderPointY())

    if (onceOnly[GetUnitUserData(hero)]) then
        call DestroyTrigger(GetTriggeringTrigger())
    endif

    set hero = null
endfunction



function ActivateTeleport takes unit hero, boolean onceOnlyB returns nothing
    local integer escaperId = GetUnitUserData(hero)
    call DestroyTrigger(teleTriggers[escaperId])
    set teleTriggers[escaperId] = CreateTrigger()
    call TriggerAddAction(teleTriggers[escaperId], function Teleport_Actions)
    call TriggerRegisterUnitEvent(teleTriggers[escaperId], hero, EVENT_UNIT_ISSUED_POINT_ORDER )
    set onceOnly[escaperId] = onceOnlyB
endfunction



function DisableTeleport takes unit hero returns nothing
    local integer escaperId = GetUnitUserData(hero)
    call DestroyTrigger(teleTriggers[escaperId])
endfunction




endlibrary