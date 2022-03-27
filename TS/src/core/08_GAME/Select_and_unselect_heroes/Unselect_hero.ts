import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent, forRange } from 'Utils/mapUtils'

export const InitTrig_Unselect_hero = () => {
    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerSelectionEventBJ(t, Player(i), false))],
        actions: [
            () => {
                if (EscaperFunctions.IsHero(GetTriggerUnit())) {
                    EscaperFunctions.Hero2Escaper(GetTriggerUnit()).setIsHeroSelectedForPlayer(
                        GetTriggerPlayer(),
                        false
                    )
                }
            },
        ],
    })
}
