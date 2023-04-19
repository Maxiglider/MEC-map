import { MemoryHandler } from 'Utils/MemoryHandler'
import { arrayPush } from 'core/01_libraries/Basic_functions'

export const initSimpleUnitRecycler = () => {
    let units = MemoryHandler.getEmptyArray<unit>()

    const destroy = () => {
        for (const u of units) {
            RemoveUnit(u)
        }

        MemoryHandler.destroyArray(units)
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
            units = MemoryHandler.getEmptyArray<unit>()
        },
    }
}
