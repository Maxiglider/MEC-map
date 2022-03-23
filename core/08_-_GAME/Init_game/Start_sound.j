function Trig_Start_sound_Actions takes nothing returns nothing
    call PlaySoundBJ( gg_snd_start )
endfunction

//===========================================================================
function InitTrig_Start_sound takes nothing returns nothing
    set gg_trg_Start_sound = CreateTrigger(  )
    call TriggerRegisterTimerEventSingle( gg_trg_Start_sound, 2.00 )
    call TriggerAddAction( gg_trg_Start_sound, function Trig_Start_sound_Actions )
endfunction

