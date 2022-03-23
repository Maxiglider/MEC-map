//TESH.scrollpos=0
//TESH.alwaysfold=0
globals
    LevelArray udg_levels = 0
endglobals

//===========================================================================
function InitTrig_Init_struct_levels takes nothing returns nothing
    if (udg_levels == 0) then
        set udg_levels = LevelArray.create()
    endif
endfunction

