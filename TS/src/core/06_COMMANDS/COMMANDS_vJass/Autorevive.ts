import { Hero2Escaper, IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from 'Utils/mapUtils'

const InitTrig_Autorevive = () => {
    let udg_autoreviveDelay = 4

    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)],
        conditions: [() => IsHero(GetTriggerUnit())],
        actions: [
            () => {
                const escaper = Hero2Escaper(GetTriggerUnit())

                if (!escaper) {
                    return
                }

                if (escaper.hasAutorevive()) {
                    TriggerSleepAction(udg_autoreviveDelay)
                    escaper.reviveAtStart()
                    escaper.selectHero()
                }
            },
        ],
    })

    return { udg_autoreviveDelay }
}

export const Trig_Autorevive = InitTrig_Autorevive()
