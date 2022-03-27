import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { createEvent } from 'Utils/mapUtils'
import { EscaperFunctions } from '../Escaper/Escaper_functions'
import { MeteorFunctions } from './Meteor_functions'

export const InitTrig_Right_click_on_widget = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)],
        conditions: [() => EscaperFunctions.IsHero(GetTriggerUnit()) && BasicFunctions.IsIssuedOrder('smart')],
        actions: [
            () => {
                if (GetOrderTargetUnit() !== null) {
                    MeteorFunctions.ExecuteRightClicOnUnit(GetTriggerUnit(), GetOrderTargetUnit())
                }
            },
        ],
    })
}
