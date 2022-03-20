//TESH.scrollpos=0
//TESH.alwaysfold=0
function Trig_using_shortcut_Conditions takes nothing returns boolean
    return IsHero(GetTriggerUnit())
endfunction



function Trig_using_shortcut_Actions takes nothing returns nothing
    local Escaper escaper = Hero2Escaper(GetTriggerUnit())
    local player p = escaper.getPlayer()
    
    //! textmacro UsingShortcut takes shortcut
    if (GetSpellAbilityId() == 'SC$shortcut$o') then
        call Text_P(p, udg_colorCode[GetPlayerId(p)] + GetPlayerName(p) + ":|r " + $shortcut$_shortcutCommand[GetPlayerId(p)])
        call ExecuteCommand(escaper, $shortcut$_shortcutCommand[GetPlayerId(p)])
        return
    endif
    //! endtextmacro

    //! runtextmacro UsingShortcut("A")
    //! runtextmacro UsingShortcut("Z")
    //! runtextmacro UsingShortcut("E")
    //! runtextmacro UsingShortcut("R")
    //! runtextmacro UsingShortcut("Q")
    //! runtextmacro UsingShortcut("S")
    //! runtextmacro UsingShortcut("D")
    //! runtextmacro UsingShortcut("F")
endfunction


//===========================================================================
function InitTrig_Using_shortcut takes nothing returns nothing
    set gg_trg_Using_shortcut = CreateTrigger(  )
    call TriggerRegisterAnyUnitEventBJ( gg_trg_Using_shortcut, EVENT_PLAYER_UNIT_SPELL_CAST )
    call TriggerAddCondition( gg_trg_Using_shortcut, Condition( function Trig_using_shortcut_Conditions ) )
    call TriggerAddAction( gg_trg_Using_shortcut, function Trig_using_shortcut_Actions )
endfunction

