const Trig_Start_sound_Actions = (): void => {
	PlaySoundBJ(gg_snd_start)
};

//===========================================================================
const InitTrig_Start_sound = (): void => {
	gg_trg_Start_sound = CreateTrigger();
 TriggerRegisterTimerEventSingle( gg_trg_Start_sound, 2.00 )
	TriggerAddAction(gg_trg_Start_sound, Trig_Start_sound_Actions)
};

