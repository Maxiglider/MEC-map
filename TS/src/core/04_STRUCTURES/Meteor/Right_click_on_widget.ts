import { createEvent } from 'Utils/mapUtils'
import { MeteorFunctions } from './Meteor_functions'

export const InitTrig_Right_click_on_widget = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)],
        conditions: [() => IsHero(GetTriggerUnit()) && IsIssuedOrder('smart')],
        actions: [
            () => {
                if (GetOrderTargetUnit() !== null) {
                    MeteorFunctions.ExecuteRightClicOnUnit(GetTriggerUnit(), GetOrderTargetUnit())
                }
            },
        ],
    })
}
