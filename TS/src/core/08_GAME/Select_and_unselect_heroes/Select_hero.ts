

const Trig_Select_hero_Actions = (): void => {
	if ((IsHero(GetTriggerUnit()))) {
 Hero2Escaper(GetTriggerUnit()).setIsHeroSelectedForPlayer(GetTriggerPlayer(), true)
	}
};

//===========================================================================
const InitTrig_Select_hero = (): void => {
	gg_trg_Select_hero = CreateTrigger();
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(0), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(1), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(2), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(3), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(4), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(5), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(6), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(7), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(8), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(9), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(10), true)
	TriggerRegisterPlayerSelectionEventBJ(gg_trg_Select_hero, Player(11), true)
	TriggerAddAction(gg_trg_Select_hero, Trig_Select_hero_Actions)
};

