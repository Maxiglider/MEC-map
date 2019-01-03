//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_Select_hero_Actions takes nothing returns nothing
    if (IsHero(GetTriggerUnit())) then
        call Hero2Escaper(GetTriggerUnit()).setIsHeroSelectedForPlayer(GetTriggerPlayer(), true)
    endif
endfunction

//===========================================================================
function InitTrig_Select_hero takes nothing returns nothing
    set gg_trg_Select_hero = CreateTrigger(  )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(0), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(1), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(2), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(3), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(4), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(5), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(6), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(7), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(8), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(9), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(10), true )
    call TriggerRegisterPlayerSelectionEventBJ( gg_trg_Select_hero, Player(11), true )
    call TriggerAddAction( gg_trg_Select_hero, function Trig_Select_hero_Actions )
endfunction

