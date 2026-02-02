import { IDestroyable, MemoryHandler } from './MemoryHandler'

export type IPoint = { x: number; y: number } & IDestroyable

export const createPoint = (x: number, y: number): IPoint => {
    const point = MemoryHandler.getEmptyObject<IPoint>()
    point.x = x
    point.y = y
    return point
}
