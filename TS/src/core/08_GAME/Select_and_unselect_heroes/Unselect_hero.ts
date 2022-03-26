

const Trig_Unselect_hero_Actions = (): void => {
	if ((IsHero(GetTriggerUnit()))) {
 Hero2Escaper(GetTriggerUnit()).setIsHeroSelectedForPlayer(GetTriggerPlayer(), false)
	}
};

//===========================================================================
const InitTrig_Unselect_hero = (): void => {
	gg_trg_Unselect_hero = CreateTrigger();
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(0), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(1), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(2), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(3), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(4), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(5), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(6), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(7), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(8), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(9), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(10), false)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Unselect_hero, Player(11), false)
	TriggerAddAction(gg_trg_Unselect_hero, Trig_Unselect_hero_Actions)
};

