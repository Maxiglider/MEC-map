//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_antisave_warning_Actions takes nothing returns nothing
    if (IsTriggerEnabled(gg_trg_Antisave)) then
        call DisplayTextToForce(GetPlayersAll(), udg_colorCode[RED] + "Warning ! Loading the game won't work !")
    else
        call DisplayTextToForce(GetPlayersAll(), udg_colorCode[RED] + "Don't forget to type -saveTerrain to save the whole terrain before saving the game. (load with -loadTerrain)")
    endif
endfunction


//===========================================================================
function InitTrig_Antisave_warning takes nothing returns nothing
    set gg_trg_Antisave_warning = CreateTrigger(  )
    call TriggerRegisterGameSavedEventBJ( gg_trg_Antisave_warning )
    call TriggerAddAction( gg_trg_Antisave_warning, function Trig_antisave_warning_Actions )
endfunction

