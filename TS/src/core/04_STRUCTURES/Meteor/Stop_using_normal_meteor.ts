const Trig_Stop_using_normal_meteor_Conditions = (): boolean => {
	if ((!(GetSpellAbilityId() === FourCC("A002")))) {
		return false;
	}
	return true;
};

const Trig_Stop_using_normal_meteor_Actions = (): void => {
	IssueImmediateOrderBJ(GetTriggerUnit(), "stop")
};

//===========================================================================
const InitTrig_Stop_using_normal_meteor = (): void => {
	gg_trg_Stop_using_normal_meteor = CreateTrigger();
	DisableTrigger(gg_trg_Stop_using_normal_meteor)
	TriggerRegisterAnyUnitEventBJ(gg_trg_Stop_using_normal_meteor, EVENT_PLAYER_UNIT_SPELL_CAST)
	TriggerAddCondition(gg_trg_Stop_using_normal_meteor, Condition(Trig_Stop_using_normal_meteor_Conditions))
	TriggerAddAction(gg_trg_Stop_using_normal_meteor, Trig_Stop_using_normal_meteor_Actions)
};

