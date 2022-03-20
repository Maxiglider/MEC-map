//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_Effect_meteor_on_pick_down_Actions takes nothing returns nothing
    if (not(IsHero(GetTriggerUnit()) and (GetItemTypeId(GetManipulatedItem()) == METEOR_NORMAL or GetItemTypeId(GetManipulatedItem()) == METEOR_CHEAT))) then
        return
    endif
    call Hero2Escaper(GetTriggerUnit()).removeEffectMeteor()
endfunction

//===========================================================================
function InitTrig_Effect_meteor_on_pick_down takes nothing returns nothing
    set gg_trg_Effect_meteor_on_pick_down = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Effect_meteor_on_pick_down, EVENT_PLAYER_UNIT_DROP_ITEM )
    call TriggerAddAction( gg_trg_Effect_meteor_on_pick_down, function Trig_Effect_meteor_on_pick_down_Actions )
endfunction

