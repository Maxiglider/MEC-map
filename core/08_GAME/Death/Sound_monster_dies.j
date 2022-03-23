function Trig_Sound_monster_dies_Conditions takes nothing returns boolean
    if ( not ( GetOwningPlayer(GetTriggerUnit()) == Player(PLAYER_NEUTRAL_AGGRESSIVE) ) ) then
        return false
    endif
    return true
endfunction

function Trig_Sound_monster_dies_Actions takes nothing returns nothing
    call PlaySoundBJ( gg_snd_goodJob )
endfunction

//===========================================================================
function InitTrig_Sound_monster_dies takes nothing returns nothing
    set gg_trg_Sound_monster_dies = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Sound_monster_dies, EVENT_PLAYER_UNIT_DEATH )
    call TriggerAddCondition( gg_trg_Sound_monster_dies, Condition( function Trig_Sound_monster_dies_Conditions ) )
    call TriggerAddAction( gg_trg_Sound_monster_dies, function Trig_Sound_monster_dies_Actions )
endfunction

