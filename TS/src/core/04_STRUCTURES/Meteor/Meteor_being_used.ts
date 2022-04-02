import { createEvent } from 'Utils/mapUtils'
import {METEOR_NORMAL, udg_meteors} from './Meteor'
import { gg_trg_Stop_using_normal_meteor } from './Stop_using_normal_meteor'
import {Hero2Escaper} from "../Escaper/Escaper_functions";


export const InitTrig_Meteor_being_used = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_USE_ITEM)],
        actions: [
            () => {
                SetUnitAnimation(GetTriggerUnit(), 'attack')

                if (GetItemTypeId(GetManipulatedItem()) === METEOR_NORMAL) {
                    DisableTrigger(GetTriggeringTrigger())
                    EnableTrigger(gg_trg_Stop_using_normal_meteor) //todomax fix the bug that sometimes the hero runs towards the target after launching the ball

                    udg_meteors[GetItemUserData(GetManipulatedItem())].removeMeteorItem()
                    Hero2Escaper(GetTriggerUnit())?.removeEffectMeteor()

                    TriggerSleepAction(1)

                    EnableTrigger(GetTriggeringTrigger())
                    DisableTrigger(gg_trg_Stop_using_normal_meteor)
                }
            },
        ],
    })
}
