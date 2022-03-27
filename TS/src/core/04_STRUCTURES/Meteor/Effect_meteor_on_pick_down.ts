const Trig_Effect_meteor_on_pick_down_Actions = (): void => {
    if (
        !(
            EscaperFunctions.IsHero(GetTriggerUnit()) &&
            (GetItemTypeId(GetManipulatedItem()) === METEOR_NORMAL ||
                GetItemTypeId(GetManipulatedItem()) === METEOR_CHEAT)
        )
    ) {
        return
    }
    EscaperFunctions.Hero2Escaper(GetTriggerUnit()).removeEffectMeteor()
}

//===========================================================================
const InitTrig_Effect_meteor_on_pick_down = (): void => {
    gg_trg_Effect_meteor_on_pick_down = CreateTrigger()
    TriggerRegisterAnyUnitEventBJ(gg_trg_Effect_meteor_on_pick_down, EVENT_PLAYER_UNIT_DROP_ITEM)
    TriggerAddAction(gg_trg_Effect_meteor_on_pick_down, Trig_Effect_meteor_on_pick_down_Actions)
}
