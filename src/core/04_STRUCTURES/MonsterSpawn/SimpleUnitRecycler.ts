import { MemoryHandler } from 'Utils/MemoryHandler'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Timer } from 'w3ts'
import { createTimer } from '../../../Utils/mapUtils'

const UNIT_UNAVAILABLE_TIME = 10 // in seconds

export const initSimpleUnitRecycler = () => {
    const units = MemoryHandler.getEmptyArray<unit>()

    const unavailableUnits: { [x: number]: unit } = MemoryHandler.getEmptyObject()
    const unitIdToRemainingUnavailableTime: { [x: number]: number } = MemoryHandler.getEmptyObject()

    // During UNIT_UNAVAILABLE_TIME seconds a removed unit is unavailable to be reused, in case of movement effect following the unit
    const unavailableTimeTimer: Timer = createTimer(1, true, () => {
        for (const [unitId, remainingTime] of pairs(unitIdToRemainingUnavailableTime)) {
            const newTime = remainingTime - 1
            if (newTime <= 0) {
                delete unitIdToRemainingUnavailableTime[unitId]
                const u = unavailableUnits[unitId]
                if (!!u) {
                    arrayPush(units, u)
                }
                delete unavailableUnits[unitId]
            } else {
                unitIdToRemainingUnavailableTime[unitId] = newTime
            }
        }
    })

    const reinit = () => {
        for (const u of units) {
            RemoveUnit(u)
        }
        units.length = 0

        for (const [_, u] of pairs(unavailableUnits)) {
            RemoveUnit(u)
        }

        for (const [unitId, _] of pairs(unitIdToRemainingUnavailableTime)) {
            delete unitIdToRemainingUnavailableTime[unitId]
        }
    }

    const destroy = () => {
        for (const u of units) {
            RemoveUnit(u)
        }

        MemoryHandler.destroyArray(units)
        MemoryHandler.destroyObject(unitIdToRemainingUnavailableTime)
        unavailableTimeTimer.destroy()
    }

    return {
        getUnit: (): unit | undefined => {
            const u = units.shift()

            if (u) {
                ShowUnit(u, true)
            }

            return u
        },
        removeUnit: (u: unit) => {
            ShowUnit(u, false)
            unavailableUnits[GetHandleId(u)] = u
            unitIdToRemainingUnavailableTime[GetHandleId(u)] = UNIT_UNAVAILABLE_TIME
        },
        reinit,
        destroy,
    }
}
