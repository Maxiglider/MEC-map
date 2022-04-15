import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { createEvent, forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'

export const InitTrig_Camera_reset = () => {
    createEvent({
        events: [t => forRange(NB_ESCAPERS, i => TriggerRegisterPlayerEventEndCinematic(t, Player(i)))],
        actions: [
            () => {
                getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))?.resetCamera()
            },
        ],
    })
}
