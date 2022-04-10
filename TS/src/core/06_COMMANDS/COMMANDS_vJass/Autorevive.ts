import { Hero2Escaper, IsHero } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from 'Utils/mapUtils'
import { globals } from '../../../../globals'

export const InitTrig_Autorevive = () => {
    globals.autoreviveDelay = 4

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
                    globals.autoreviveDelay !== undefined && TriggerSleepAction(globals.autoreviveDelay)
                    escaper.reviveAtStart()
                    escaper.selectHero()
                }
            },
        ],
    })
}
