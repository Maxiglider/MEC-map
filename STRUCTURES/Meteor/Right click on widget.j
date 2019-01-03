//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_right_click_on_widget_Conditions takes nothing returns boolean
    return (IsHero(GetTriggerUnit()) and IsIssuedOrder("smart"))
endfunction


function Trig_right_click_on_widget_Actions takes nothing returns nothing
    if (GetOrderTargetUnit() != null) then
        call ExecuteRightClicOnUnit(GetTriggerUnit(), GetOrderTargetUnit())  
    endif
endfunction


//===========================================================================
function InitTrig_Right_click_on_widget takes nothing returns nothing
    set gg_trg_Right_click_on_widget = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ(gg_trg_Right_click_on_widget, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
    call TriggerAddAction(gg_trg_Right_click_on_widget, function Trig_right_click_on_widget_Actions)
    call TriggerAddCondition(gg_trg_Right_click_on_widget, Condition(function Trig_right_click_on_widget_Conditions))
endfunction

