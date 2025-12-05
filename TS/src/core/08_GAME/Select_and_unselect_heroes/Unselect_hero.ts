import { Constants } from 'core/01_libraries/Constants'
import { Hero2Escaper, IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent, forRange } from 'Utils/mapUtils'

export const InitTrig_Unselect_hero = () => {
    createEvent({
        events: [t => forRange(Constants.NB_ESCAPERS, i => TriggerRegisterPlayerSelectionEventBJ(t, Player(i), false))],
        actions: [
            () => {
                if (IsHero(GetTriggerUnit())) {
                    Hero2Escaper(GetTriggerUnit())?.setIsHeroSelectedForPlayer(GetTriggerPlayer(), false)
                }
            },
        ],
    })
}
