import {createEvent} from "../../../Utils/mapUtils";
import {GetMirrorEscaper, Hero2Escaper} from "../../04_STRUCTURES/Escaper/Escaper_functions";
import {StopUnit} from "../../01_libraries/Basic_functions";

/**
 * Prevent secondary hero to move if the player is in "Make" mode
 */

export const init_StopSecondIfMake = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_POINT_ORDER)],
        actions: [() => {

            const unit = GetTriggerUnit()
            const escaper = Hero2Escaper(unit)
            if(escaper?.isEscaperSecondary()){
                const mainEscaper = GetMirrorEscaper(escaper)

                if(mainEscaper?.getMake()){
                    StopUnit(unit)
                }
            }

        }],
    })
}