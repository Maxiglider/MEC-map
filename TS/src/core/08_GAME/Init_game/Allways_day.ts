const Trig_Allways_day_Actions = (): void => {
	SetTimeOfDay(12)
	UseTimeOfDayBJ(false)
};

//===========================================================================
const InitTrig_Allways_day = (): void => {
	gg_trg_Allways_day = CreateTrigger();
	TriggerAddAction(gg_trg_Allways_day, Trig_Allways_day_Actions)
};

