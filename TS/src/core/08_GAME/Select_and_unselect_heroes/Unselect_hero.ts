import { createEvent, forRange } from 'Utils/mapUtils'

export const InitTrig_Unselect_hero = () => {
    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerSelectionEventBJ(t, Player(i), false))],
        actions: [
            () => {
                if (IsHero(GetTriggerUnit())) {
                    Hero2Escaper(GetTriggerUnit()).setIsHeroSelectedForPlayer(GetTriggerPlayer(), false)
                }
            },
        ],
    })
}
