const Trig_Effect_meteor_on_pick_up_Conditions = (): boolean => {
    return GetItemTypeId(UnitItemInSlotBJ(GetTriggerUnit(), 1)) === METEOR_NORMAL
}

const Trig_Effect_meteor_on_pick_up_Actions = (): void => {
    EscaperFunctions.Hero2Escaper(GetTriggerUnit()).addEffectMeteor()
}

//===========================================================================
const InitTrig_Effect_meteor_on_pick_up = (): void => {
    gg_trg_Effect_meteor_on_pick_up = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(gg_trg_Effect_meteor_on_pick_up, EVENT_PLAYER_UNIT_PICKUP_ITEM)
    TriggerAddCondition(gg_trg_Effect_meteor_on_pick_up, Condition(Trig_Effect_meteor_on_pick_up_Conditions))
    TriggerAddAction(gg_trg_Effect_meteor_on_pick_up, Trig_Effect_meteor_on_pick_up_Actions)
}
