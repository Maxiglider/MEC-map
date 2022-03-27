const Trig_meteor_being_used_Actions = (): void => {
    SetUnitAnimation(GetTriggerUnit(), 'attack')
    if (GetItemTypeId(GetManipulatedItem()) === METEOR_NORMAL) {
        DisableTrigger(GetTriggeringTrigger())
        EnableTrigger(gg_trg_Stop_using_normal_meteor)
        Meteor(GetItemUserData(GetManipulatedItem())).removeMeteor()
        EscaperFunctions.Hero2Escaper(GetTriggerUnit()).removeEffectMeteor()
        TriggerSleepAction(1)
        EnableTrigger(GetTriggeringTrigger())
        DisableTrigger(gg_trg_Stop_using_normal_meteor)
    }
}

//===========================================================================
const InitTrig_Meteor_being_used = (): void => {
    gg_trg_Meteor_being_used = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(gg_trg_Meteor_being_used, EVENT_PLAYER_UNIT_USE_ITEM)
    TriggerAddAction(gg_trg_Meteor_being_used, Trig_meteor_being_used_Actions)
}
