

const Trig_using_shortcut_Conditions = (): boolean => {
	return IsHero(GetTriggerUnit());
};



const Trig_using_shortcut_Actions = (): void => {
	let escaper = Hero2Escaper(GetTriggerUnit());
	local player p = escaper.getPlayer()

	//!//@@BELOWTEXTMACRO
	/* textmacro UsingShortcut takes shortcut
	    if (GetSpellAbilityId() == 'SC$shortcut$o') then
 Text_P(p, udg_colorCode[GetPlayerId(p)] + GetPlayerName(p) + ":|r " + $shortcut$_shortcutCommand[GetPlayerId(p)])
 ExecuteCommand(escaper, $shortcut$_shortcutCommand[GetPlayerId(p)])
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
};


//===========================================================================
const InitTrig_Using_shortcut = (): void => {
	gg_trg_Using_shortcut = CreateTrigger();
	TriggerRegisterAnyUnitEventBJ(gg_trg_Using_shortcut, EVENT_PLAYER_UNIT_SPELL_CAST)
	TriggerAddCondition(gg_trg_Using_shortcut, Condition(Trig_using_shortcut_Conditions))
	TriggerAddAction(gg_trg_Using_shortcut, Trig_using_shortcut_Actions)
};

