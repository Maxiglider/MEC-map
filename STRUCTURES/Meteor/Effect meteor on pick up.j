//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_Effect_meteor_on_pick_up_Conditions takes nothing returns boolean
    return GetItemTypeId(UnitItemInSlotBJ(GetTriggerUnit(), 1)) == METEOR_NORMAL
endfunction

function Trig_Effect_meteor_on_pick_up_Actions takes nothing returns nothing
    call Hero2Escaper(GetTriggerUnit()).addEffectMeteor()
endfunction

//===========================================================================
function InitTrig_Effect_meteor_on_pick_up takes nothing returns nothing
    set gg_trg_Effect_meteor_on_pick_up = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Effect_meteor_on_pick_up, EVENT_PLAYER_UNIT_PICKUP_ITEM )
    call TriggerAddCondition( gg_trg_Effect_meteor_on_pick_up, Condition( function Trig_Effect_meteor_on_pick_up_Conditions ) )
    call TriggerAddAction( gg_trg_Effect_meteor_on_pick_up, function Trig_Effect_meteor_on_pick_up_Actions )
endfunction

