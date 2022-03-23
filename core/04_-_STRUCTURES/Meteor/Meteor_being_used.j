//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_meteor_being_used_Actions takes nothing returns nothing
    call SetUnitAnimation(GetTriggerUnit(), "attack")
    if (GetItemTypeId(GetManipulatedItem()) == METEOR_NORMAL) then
        call DisableTrigger(GetTriggeringTrigger())
        call EnableTrigger(gg_trg_Stop_using_normal_meteor)
        call Meteor(GetItemUserData(GetManipulatedItem())).removeMeteor()
        call Hero2Escaper(GetTriggerUnit()).removeEffectMeteor()
        call TriggerSleepAction(1.)
        call EnableTrigger(GetTriggeringTrigger())
        call DisableTrigger(gg_trg_Stop_using_normal_meteor)
    endif
endfunction

//===========================================================================
function InitTrig_Meteor_being_used takes nothing returns nothing
    set gg_trg_Meteor_being_used = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Meteor_being_used, EVENT_PLAYER_UNIT_USE_ITEM )
    call TriggerAddAction( gg_trg_Meteor_being_used, function Trig_meteor_being_used_Actions )
endfunction

