export class ArrayHandler {
    private static tArrays = new Map<number, any>()
    private static freedArrays: any[] = []

    public static getNewArray<T>() {
        let arr: T[] = ArrayHandler.freedArrays.shift()
        let index

        if (arr) {
            index = (getmetatable(arr) as any).__id
        } else {
            arr = []
            index = ArrayHandler.tArrays.size
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
            throw 'Index "' + index + '" not known in ArrayHandler'
        }

        if (arrayInMap !== arr) {
            throw 'Arrays different in ArrayHandler'
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
