//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
    Lives udg_lives = 0
endglobals


function Trig_init_lives_Actions takes nothing returns nothing
    set udg_lives = Lives.create()
endfunction



//===========================================================================
function InitTrig_Init_lives takes nothing returns nothing
    set gg_trg_Init_lives = CreateTrigger()
    call TriggerAddAction(gg_trg_Init_lives, function Trig_init_lives_Actions)
    call TriggerRegisterTimerEvent(gg_trg_Init_lives, 0.0001, false)
endfunction

