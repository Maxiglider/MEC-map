

let udg_lives = 0;


const Trig_init_lives_Actions = (): void => {
	udg_lives = Lives.create()
};



//===========================================================================
const InitTrig_Init_lives = (): void => {
	gg_trg_Init_lives = CreateTrigger();
	TriggerAddAction(gg_trg_Init_lives, Trig_init_lives_Actions)
 TriggerRegisterTimerEvent(gg_trg_Init_lives, 0.0001, false)
};

