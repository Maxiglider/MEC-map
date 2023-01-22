import { arrayPush } from 'core/01_libraries/Basic_functions'
import { ArrayHandler } from 'Utils/ArrayHandler'

export const initSimpleUnitRecycler = () => {
    let units = ArrayHandler.getNewArray<unit>()

    const destroy = () => {
        for (const u of units) {
            RemoveUnit(u)
        }

        ArrayHandler.clearArray(units)
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
            arrayPush(units, u)
        },
        destroy,
        reinit: () => {
            destroy()
            units = ArrayHandler.getNewArray<unit>()
        },
    }
}
