export type IPoint = LuaMultiReturn<[number, number]>

export const createPoint = (x: number, y: number): IPoint => {
    return $multi(x, y)
}
