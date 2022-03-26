

let udg_autoreviveDelay = 4;



const Trig_autorevive_Conditions = (): boolean => {
	return IsHero(GetTriggerUnit());
};

const Trig_autorevive_Actions = (): void => {
	let escaper = Hero2Escaper(GetTriggerUnit());
	if ( (escaper.hasAutorevive()) ) {
		TriggerSleepAction(udg_autoreviveDelay)
 escaper.reviveAtStart()
 escaper.selectHero()
	}
};


//===========================================================================
const InitTrig_Autorevive = (): void => {
	gg_trg_Autorevive = CreateTrigger();
	TriggerRegisterAnyUnitEventBJ(gg_trg_Autorevive, EVENT_PLAYER_UNIT_DEATH)
	TriggerAddCondition(gg_trg_Autorevive, Condition(Trig_autorevive_Conditions))
	TriggerAddAction(gg_trg_Autorevive, Trig_autorevive_Actions)
};

