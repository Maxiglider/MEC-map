import { createEvent } from 'Utils/mapUtils'

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
