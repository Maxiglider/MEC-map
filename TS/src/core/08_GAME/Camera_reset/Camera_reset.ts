import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { createEvent, forRange } from 'Utils/mapUtils'

export const InitTrig_Camera_reset = () => {
    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerEventEndCinematic(t, Player(i)))],
        actions: [
            () => {
                udg_escapers.get(GetPlayerId(GetTriggerPlayer()))?.resetCamera()
            },
        ],
    })
}
