import { globals } from '../../globals'

const initPathingBlockerUtils = () => {
    const pathingBlockerMap: { [x_y: string]: boolean } = {}

    const init = () => {
        EnumDestructablesInRect(
            Rect(globals.MAP_MIN_X, globals.MAP_MIN_Y, globals.MAP_MAX_X, globals.MAP_MAX_Y),
            null,
            () => {
                const d = GetEnumDestructable()

                if (GetDestructableName(d).includes('Pathing Blocker')) {
                    pathingBlockerMap[`${Math.floor(GetDestructableX(d))}_${Math.floor(GetDestructableY(d))}`] = true
                }
            }
        )
    }

    return {
        init,
        pathingBlockerMap,
    }
}

export const pathingBlockerUtils = initPathingBlockerUtils()
