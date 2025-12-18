import { IsIssuedOrder } from 'core/01_libraries/Basic_functions'
import { createEvent } from 'Utils/mapUtils'
import { IsHero } from '../Escaper/Escaper_functions'
import { MeteorFunctions } from './Meteor_functions'
import { Natives } from '../../wc3_natives_unsecured/Natives'

export const InitTrig_Right_click_on_widget = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)],
        conditions: [() => IsHero(Natives.UGetTriggerUnit()) && IsIssuedOrder('smart')],
        actions: [
            () => {
                MeteorFunctions.ExecuteRightClicOnUnit(Natives.UGetTriggerUnit(), Natives.UGetOrderTargetUnit())
            },
        ],
    })
}
