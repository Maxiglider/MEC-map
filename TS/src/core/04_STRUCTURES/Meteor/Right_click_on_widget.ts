

const Trig_right_click_on_widget_Conditions = (): boolean => {
	return (IsHero(GetTriggerUnit()) && IsIssuedOrder("smart"));
};


const Trig_right_click_on_widget_Actions = (): void => {
	if ((GetOrderTargetUnit() !== null)) {
		ExecuteRightClicOnUnit(GetTriggerUnit(), GetOrderTargetUnit())
	}
};


//===========================================================================
const InitTrig_Right_click_on_widget = (): void => {
	gg_trg_Right_click_on_widget = CreateTrigger();
	TriggerRegisterAnyUnitEventBJ(gg_trg_Right_click_on_widget, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)
	TriggerAddAction(gg_trg_Right_click_on_widget, Trig_right_click_on_widget_Actions)
	TriggerAddCondition(gg_trg_Right_click_on_widget, Condition(Trig_right_click_on_widget_Conditions))
};

