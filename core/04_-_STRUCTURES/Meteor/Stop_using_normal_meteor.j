function Trig_Stop_using_normal_meteor_Conditions takes nothing returns boolean
    if ( not ( GetSpellAbilityId() == 'A002' ) ) then
        return false
    endif
    return true
endfunction

function Trig_Stop_using_normal_meteor_Actions takes nothing returns nothing
    call IssueImmediateOrderBJ( GetTriggerUnit(), "stop" )
endfunction

//===========================================================================
function InitTrig_Stop_using_normal_meteor takes nothing returns nothing
    set gg_trg_Stop_using_normal_meteor = CreateTrigger(  )
    call DisableTrigger( gg_trg_Stop_using_normal_meteor )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Stop_using_normal_meteor, EVENT_PLAYER_UNIT_SPELL_CAST )
    call TriggerAddCondition( gg_trg_Stop_using_normal_meteor, Condition( function Trig_Stop_using_normal_meteor_Conditions ) )
    call TriggerAddAction( gg_trg_Stop_using_normal_meteor, function Trig_Stop_using_normal_meteor_Actions )
endfunction

