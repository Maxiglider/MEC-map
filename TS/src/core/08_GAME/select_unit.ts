import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { createEvent, forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../globals'
import { Hero2Escaper, IsHero } from '../04_STRUCTURES/Escaper/Escaper_functions'

export const initSelectUnit = () => {
    createEvent({
        events: [t => forRange(NB_ESCAPERS, i => TriggerRegisterPlayerSelectionEventBJ(t, Player(i), true))],
        actions: [
            () => {
                if (IsHero(GetTriggerUnit())) {
                    const escaper = Hero2Escaper(GetTriggerUnit())

                    if (escaper) {
                        getUdgEscapers()
                            .get(GetPlayerId(GetTriggerPlayer()))
                            ?.setSelectedEscaperId(GetPlayerId(escaper.getPlayer()))
                    }
                }
            },
        ],
    })
}
