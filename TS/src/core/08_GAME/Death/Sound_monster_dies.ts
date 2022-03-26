const Trig_Sound_monster_dies_Conditions = (): boolean => {
	if ((!(GetOwningPlayer(GetTriggerUnit()) === Player(PLAYER_NEUTRAL_AGGRESSIVE)))) {
		return false;
	}
	return true;
};

const Trig_Sound_monster_dies_Actions = (): void => {
	PlaySoundBJ(gg_snd_goodJob)
};

//===========================================================================
const InitTrig_Sound_monster_dies = (): void => {
	gg_trg_Sound_monster_dies = CreateTrigger();
	TriggerRegisterAnyUnitEventBJ(gg_trg_Sound_monster_dies, EVENT_PLAYER_UNIT_DEATH)
	TriggerAddCondition(gg_trg_Sound_monster_dies, Condition(Trig_Sound_monster_dies_Conditions))
	TriggerAddAction(gg_trg_Sound_monster_dies, Trig_Sound_monster_dies_Actions)
};

