//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_teleport_Conditions takes nothing returns boolean
    return (IsHero(GetTriggerUnit()) and Hero2Escaper(GetTriggerUnit()).canTeleport())
endfunction

function Trig_teleport_Actions takes nothing returns nothing
    call StopUnit(GetTriggerUnit())
    call SetUnitX(GetTriggerUnit(), GetOrderPointX())
    call SetUnitY(GetTriggerUnit(), GetOrderPointY())
endfunction

//===========================================================================
function InitTrig_Teleport takes nothing returns nothing
    set gg_trg_Teleport = CreateTrigger()
    call DisableTrigger(gg_trg_Teleport)
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Teleport, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)
    call TriggerAddCondition(gg_trg_Teleport, Condition(function Trig_teleport_Conditions))
    call TriggerAddAction(gg_trg_Teleport, function Trig_teleport_Actions)
endfunction

