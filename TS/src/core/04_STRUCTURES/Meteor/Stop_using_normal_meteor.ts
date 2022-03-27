import { createEvent } from 'Utils/mapUtils'

export let gg_trg_Stop_using_normal_meteor: trigger

export const InitTrig_Stop_using_normal_meteor = () => {
    gg_trg_Stop_using_normal_meteor = createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_SPELL_CAST)],
        conditions: [
            () => {
                if (!(GetSpellAbilityId() === FourCC('A002'))) {
                    return false
                }

                return true
            },
        ],
        actions: [() => IssueImmediateOrderBJ(GetTriggerUnit(), 'stop')],
    })

    DisableTrigger(gg_trg_Stop_using_normal_meteor)
}
