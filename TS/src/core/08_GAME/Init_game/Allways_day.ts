import { createEvent } from 'Utils/mapUtils'

// TODO; Trigger has no events and no external calls..?

export const InitTrig_Allways_day = () => {
    createEvent({
        events: [],
        actions: [
            () => {
                SetTimeOfDay(12)
                UseTimeOfDayBJ(false)
            },
        ],
    })
}
