import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from 'Utils/mapUtils'

let udg_autoreviveDelay = 4

export const InitTrig_Autorevive = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)],
        conditions: [() => EscaperFunctions.IsHero(GetTriggerUnit())],
        actions: [
            () => {
                let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())

                if (escaper.hasAutorevive()) {
                    TriggerSleepAction(udg_autoreviveDelay)
                    escaper.reviveAtStart()
                    escaper.selectHero()
                }
            },
        ],
    })
}
