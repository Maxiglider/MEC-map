import { arrayPush } from 'core/01_libraries/Basic_functions'
import { ArrayHandler } from 'Utils/ArrayHandler'

export const initSimpleUnitRecycler = () => {
    const units = ArrayHandler.getNewArray<unit>()

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
            arrayPush(units, u)
        },
        destroy: () => {
            for (const u of units) {
                RemoveUnit(u)
            }

            ArrayHandler.clearArray(units)
        },
    }
}
