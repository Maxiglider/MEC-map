import { createEvent, forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'

export const InitTrig_Camera_reset = () => {
    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerEventEndCinematic(t, Player(i)))],
        actions: [
            () => {
                getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))?.resetCamera()
            },
        ],
    })
}
