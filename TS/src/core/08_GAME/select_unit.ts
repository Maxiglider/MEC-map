import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { createEvent, forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'

export const initSelectUnit = () => {
    createEvent({
        events: [t => forRange(NB_ESCAPERS, i => TriggerRegisterPlayerSelectionEventBJ(t, Player(i), true))],
        actions: [
            () => {
                getUdgEscapers()
                    .get(GetPlayerId(GetTriggerPlayer()))
                    ?.setSelectedPlayerId(GetPlayerId(GetOwningPlayer(GetTriggerUnit())))
            },
        ],
    })
}
