import { createEvent } from 'Utils/mapUtils'
import { EscaperFunctions } from '../Escaper/Escaper_functions'
import { METEOR_NORMAL } from './Meteor'
import { gg_trg_Stop_using_normal_meteor } from './Stop_using_normal_meteor'

export const InitTrig_Meteor_being_used = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_USE_ITEM)],
        actions: [
            () => {
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
            },
        ],
    })
}
