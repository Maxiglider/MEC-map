//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_Unselect_hero_Actions takes nothing returns nothing
    if (IsHero(GetTriggerUnit())) then
        call Hero2Escaper(GetTriggerUnit()).setIsHeroSelectedForPlayer(GetTriggerPlayer(), false)
    endif
endfunction

//===========================================================================
function InitTrig_Unselect_hero takes nothing returns nothing
    set gg_trg_Unselect_hero = CreateTrigger(  )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(0), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(1), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(2), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(3), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(4), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(5), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(6), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(7), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(8), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(9), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(10), false )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Unselect_hero, Player(11), false )
    call TriggerAddAction( gg_trg_Unselect_hero, function Trig_Unselect_hero_Actions )
endfunction

