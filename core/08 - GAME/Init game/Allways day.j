function Trig_Allways_day_Actions takes nothing returns nothing
    call SetTimeOfDay( 12 )
    call UseTimeOfDayBJ( false )
endfunction

//===========================================================================
function InitTrig_Allways_day takes nothing returns nothing
    set gg_trg_Allways_day = CreateTrigger(  )
    call TriggerAddAction( gg_trg_Allways_day, function Trig_Allways_day_Actions )
endfunction

