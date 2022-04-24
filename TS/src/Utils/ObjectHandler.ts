import { Text } from 'core/01_libraries/Text'

export class ObjectHandler {
    private static nextIndex = 0
    private static tObjects = new Map<number, any>()
    private static freedObjects: any[] = []

    public static getNewObject<T extends {}>() {
        let obj: T = ObjectHandler.freedObjects.shift()
        let index

        if (obj) {
            index = (getmetatable(obj) as any).__id
        } else {
            obj = {} as T
            index = ObjectHandler.nextIndex
            ObjectHandler.nextIndex++
            const meta: any = { __id: index }
            setmetatable(obj, meta)
        }

        ObjectHandler.tObjects.set(index, obj)
        return obj
    }

    public static clearObject<T extends {}>(obj: T) {
        //remove from tObjects
        const index = (getmetatable(obj) as any).__id

        const objectInMap = ObjectHandler.tObjects.get(index)

        if (!objectInMap) {
            Text.erA(`Index: '${index}' not known in ObjectHandler. '${obj?.constructor?.name}'`)
            return
        }

        if (objectInMap !== obj) {
            Text.erA('Objects different in ObjectHandler')
            return
        }

        //delete content of the object

        for (const [k] of pairs(obj)) {
            ;(obj[k] as any) = null
        }

        //remove the object from the active ones
        ObjectHandler.tObjects.delete(index)

        //add the object to the freed ones
        const freedLen = ObjectHandler.freedObjects.length
        ObjectHandler.freedObjects[freedLen] = obj
    }
}
