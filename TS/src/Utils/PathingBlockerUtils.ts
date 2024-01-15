import { globals } from '../../globals'

const initPathingBlockerUtils = () => {
    const pathingBlockerMap: { [x: string]: { [y: string]: boolean } } = {}

    const init = () => {
        EnumDestructablesInRect(
            Rect(globals.MAP_MIN_X, globals.MAP_MIN_Y, globals.MAP_MAX_X, globals.MAP_MAX_Y),
            null,
            () => {
                const d = GetEnumDestructable()

                if (
                    GetDestructableTypeId(d) === FourCC('YTlb') ||
                    GetDestructableTypeId(d) === FourCC('Ytlc') ||
                    GetDestructableTypeId(d) === FourCC('YTab') ||
                    GetDestructableTypeId(d) === FourCC('YTac') ||
                    GetDestructableTypeId(d) === FourCC('YTfb') ||
                    GetDestructableTypeId(d) === FourCC('YTfc') ||
                    GetDestructableTypeId(d) === FourCC('YTpb') ||
                    GetDestructableTypeId(d) === FourCC('YTpc')
                ) {
                    if (!pathingBlockerMap[Math.floor(GetDestructableX(d))]) {
                        pathingBlockerMap[Math.floor(GetDestructableX(d))] = {}
                    }

                    pathingBlockerMap[Math.floor(GetDestructableX(d))][Math.floor(GetDestructableY(d))] = true
                }
            }
        )
    }

    return {
        init,
        isBlocked: (x: number, y: number) => pathingBlockerMap[x]?.[y],
    }
}

export const pathingBlockerUtils = initPathingBlockerUtils()
