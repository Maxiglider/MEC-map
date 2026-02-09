import { arrayPush } from 'core/01_libraries/Basic_functions'
import { errorHandler } from './mapUtils'

export type IDestroyable = { __destroy: (recursive?: boolean) => void }

const initMemoryHandler = () => {
    let numCreatedObjects = 0

    const debugObjects: { [x: string]: number } = {}
    const cachedObjects: any[] = []
    const cachedClassObjects: Map<string, any[]> = new Map() // key is a className, value is array of objects of that class

    const purgeObject = (obj: any | any[], recursive?: boolean) => {
        for (const [k] of pairs(obj)) {
            recursive && typeof obj[k] === 'object' && obj[k].__destroy?.(obj[k], recursive)
            obj[k] = undefined
        }

        const meta = getmetatable(obj) as any

        if (meta.__debugName) {
            if (meta.__debugName && debugObjects[meta.__debugName]) {
                debugObjects[meta.__debugName]--

                if (debugObjects[meta.__debugName] === 0) {
                    ;(debugObjects[meta.__debugName] as any) = undefined
                }
            }

            meta.__debugName = undefined
            meta.__destroyed = true
        }
    }

    const destroyObject = (self: any, recursive = false) => {
        if (!self.__destroy) {
            print(info().GetStackTrace())
            throw 'Object is not memory handled'
        }

        purgeObject(self, recursive)
        arrayPush(cachedObjects, self)
    }

    const destroyClassObject = (self: any, className: string, recursive = false) => {
        if (!self.__destroy) {
            print(info().GetStackTrace())

            throw 'Object is not memory handled'
        }

        purgeObject(self, recursive)

        let cachedObjects = cachedClassObjects.get(className)
        if (!cachedObjects) {
            cachedObjects = []
            cachedClassObjects.set(className, cachedObjects)
        }
        arrayPush(cachedObjects, self)
    }

    const getObjectMeta = (debugName?: string) => {
        const meta: any = {
            __gc: (self: any) => {
                purgeObject(self)
            },
            __newindex: (self: any, k: any, v: any) => {
                if (meta.__destroyed) {
                    print(info().GetStackTrace())
                    throw 'Writing a destroyed object'
                }

                rawset(self, k, v)
            },
            __index: (_self: any, key: string) => {
                if (meta.__destroyed) {
                    print(info().GetStackTrace())
                    throw 'Reading a destroyed object'
                }

                if (key === '__destroy') {
                    return destroyObject
                }
            },
        }

        debugName && (meta['__debugName'] = debugName)

        return meta
    }

    const defaultObjectMeta = getObjectMeta()

    type ITarget = { debugName: string | number; count: number }
    const targetCompare = (a: ITarget, b: ITarget) => b.count < a.count

    const printDebugNames = (title: string, targets: { [x: string]: number }) => {
        const sortedTargets = MemoryHandler.getEmptyArray<ITarget & IDestroyable>()

        for (const [debugName, count] of pairs(targets)) {
            const target = MemoryHandler.getEmptyObject<ITarget>()
            target.debugName = debugName
            target.count = count
            arrayPush(sortedTargets, target)
        }

        if (sortedTargets.length > 0) {
            table.sort(sortedTargets, targetCompare)

            let d = ''
            let i = 0

            for (const s of sortedTargets) {
                if (i++ < 8) {
                    d += (d.length > 0 ? ', ' : '') + `${s.debugName}: ${s.count}`
                }
            }

            print(`Most used ${title}: ${d}`)
        }

        sortedTargets.__destroy(true)
    }

    const getEmptyClass = <T extends new (...args: any) => any>(
        classInstance: T,
        ..._params: ConstructorParameters<T>
    ) => {
        let params = _params as unknown[] // We cast params to array so that TSTL adds a +1 since arrays are 1-indexed
        let debugName: string | undefined = undefined

        if (typeof classInstance === 'string') {
            debugName = classInstance
            classInstance = params[0] as T
            params = params.slice(1)
        }

        const obj = getEmptyObject<InstanceType<T>>(debugName, classInstance)

        // local function __TS__Class(self)
        //     local c = {prototype = {}}
        //     c.prototype.__index = c.prototype
        //     c.prototype.constructor = c
        //     return c
        // end

        // local function __TS__New(target, ...)
        //     local instance = setmetatable({}, target.prototype)
        //     instance:____constructor(...)
        //     return instance
        // end

        // MIGHT NEED IN FUTURE
        // obj.__index = classInstance.prototype

        // MIGHT NEED IN FUTURE; basically do new classInstance above somewhere and cache one per name
        // for (const [k, v] of pairs(classCache[classInstance.name])) {
        //     if (typeof k !== 'string') continue
        //     if (k.startsWith('_')) continue
        //     obj[k] = v
        // }

        // Give the methods of the class to the object
        // for (const [k, v] of pairs(classInstance.prototype)) {
        //     if (typeof k !== 'string') continue
        //     if (k.startsWith('__')) continue
        //     obj[k] = v
        // }

        classInstance.prototype.____constructor?.(obj, ...params)

        return obj
    }

    const getEmptyObject = <T>(debugName?: string, objectClass?: any) => {
        let cachedObjectsToUse: any[] | undefined = cachedObjects
        if (objectClass) {
            cachedObjectsToUse = cachedClassObjects.get(objectClass.prototype.constructor.name)
        }

        let obj: (T & IDestroyable) | null = null
        if (cachedObjectsToUse) {
            obj = cachedObjectsToUse.shift()
        }

        if (!!obj) {
            // Causes bugs if debugName changes where getEmptyObject gets called
            if (debugName) {
                ;(getmetatable(obj) as any).__debugName = debugName
                ;(getmetatable(obj) as any).__destroyed = false
            }
        } else {
            obj = {} as any
            if (!obj) {
                throw new Error('MemoryHandler: failed to create object')
            }

            numCreatedObjects++

            errorHandler(() => {
                if (!obj) return
                if (objectClass) {
                    print('Creating object of class ' + objectClass.prototype.constructor.name)
                    setmetatable(obj, objectClass.prototype)
                    objectClass.prototype.__destroy = destroyObject
                } else setmetatable(obj, debugName ? getObjectMeta(debugName) : defaultObjectMeta)
            })()
        }

        if (debugName) {
            if (!debugObjects[debugName]) {
                debugObjects[debugName] = 0
            }

            debugObjects[debugName]++
        }

        return obj
    }

    return {
        getEmptyClass,
        getEmptyObject,
        getEmptyArray: <T>(debugName?: string) => {
            return getEmptyObject<T[]>(debugName) as T[] & IDestroyable
        },
        destroyObject,
        destroyClassObject,
        destroyArray: destroyObject,
        cloneArray: <T>(arr: T[]) => {
            const newArray = MemoryHandler.getEmptyArray<T>()

            for (let i = 0; i < arr.length; i++) {
                newArray[i] = arr[i]
            }

            return newArray
        },
        printDebugInfo: () => {
            print('MemoryHandler')

            //todo calculate numCreatedObjects with class objects too
            print(`Objects: ${numCreatedObjects - cachedObjects.length}/${numCreatedObjects}`)

            printDebugNames('objects', debugObjects)

            if ((_G as any)['trackPrintMap']) {
                printDebugNames('globals', (_G as any)['__fakePrintMap'])
            }
        },
    }
}

export const MemoryHandler = initMemoryHandler()
