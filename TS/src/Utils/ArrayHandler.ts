import { Text } from 'core/01_libraries/Text'

export class ArrayHandler {
    private static nextIndex = 0
    private static tArrays = new Map<number, any>()
    private static freedArrays: any[] = []

    public static getNewArray<T>() {
        let arr: T[] = ArrayHandler.freedArrays.shift()
        let index

        if (arr) {
            index = (getmetatable(arr) as any).__id
        } else {
            arr = []
            index = ArrayHandler.nextIndex
            ArrayHandler.nextIndex++
            const meta: any = { __id: index }
            setmetatable(arr, meta)
        }

        ArrayHandler.tArrays.set(index, arr)
        return arr
    }

    public static clearArray<T>(arr: T[]) {
        //remove from tArrays
        const index = (getmetatable(arr) as any).__id

        const arrayInMap = ArrayHandler.tArrays.get(index)

        if (!arrayInMap) {
            Text.erA(
                `Index: '${index}' not known in ArrayHandler. '${arr?.constructor?.name || ''} '${
                    (arr as any)?.[0]?.constructor?.name || ''
                }`
            )
            return
        }

        if (arrayInMap !== arr) {
            Text.erA('Arrays different in ArrayHandler')
            return
        }

        //delete content of the array
        const arrLen = arr.length
        for (let j = 0; j < arrLen; j++) {
            ;(arr[j] as any) = null
        }
        arr.length = 0

        //remove the array from the active ones
        ArrayHandler.tArrays.delete(index)

        //add the array to the freed ones
        const freedLen = ArrayHandler.freedArrays.length
        ArrayHandler.freedArrays[freedLen] = arr
    }

    public static clearArrayOfArray<T>(arr: T[][]) {
        const len = arr.length

        for (let i = 0; i < len; i++) {
            ArrayHandler.clearArray(arr[i])
        }

        ArrayHandler.clearArray(arr)
    }
}
