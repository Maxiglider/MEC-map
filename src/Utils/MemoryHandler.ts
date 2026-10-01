import { arrayPush } from 'core/01_libraries/Basic_functions'

export type IDestroyable = { __destroy: (recursive?: boolean) => void }

const initMemoryHandler = () => {
    let numCreatedObjects = 0

    /**
     * Tables handed out and given back since the game started, for -desyncProbe. The pool only grows
     * from what is given back, never from the garbage collector, so these are the same on every machine
     * as long as no machine hands out or gives back a table the others do not - which is what code
     * that only one machine runs must never do: the next table each machine hands out would differ.
     */
    let numHandedOutObjects = 0
    let numReturnedObjects = 0

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

    /**
     * How deep we are inside code that only one machine runs (see withLocalTables). While it is above zero, the
     * tables handed out come from outside the pool and are counted nowhere: a machine taking or giving back a table
     * the others do not would make every machine hand out different tables from then on, and a table reused with
     * another history is walked by `pairs` in another order (docs/CAUSES_OF_DESYNCS.md, causes 5 and 6).
     */
    let localDepth = 0

    /** A table made outside the pool goes nowhere when destroyed: only its contents are let go */
    const destroyLocalObject = (self: any, recursive = false) => {
        purgeObject(self, recursive)
    }

    /** The metatable of the tables made outside the pool, which is also how they are recognized */
    const localObjectMeta: any = {
        __index: (_self: any, key: string) => {
            if (key === '__destroy') {
                return destroyLocalObject
            }
        },
    }

    const destroyObject = (self: any, recursive = false) => {
        if (!self.__destroy) {
            print(info().GetStackTrace())
            throw 'Object is not memory handled'
        }

        // Made outside the pool, whether or not we are still inside the local code that asked for it: it was never
        // counted, so giving it back would add a table on this machine alone.
        if (getmetatable(self) === localObjectMeta) {
            purgeObject(self, recursive)

            return
        }

        purgeObject(self, recursive)
        arrayPush(cachedObjects, self)
        numReturnedObjects++
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
        numReturnedObjects++
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
        // Inside code only one machine runs: a plain table, taken from nowhere and counted nowhere. Class objects are
        // left out on purpose - local code has no business making one, and their prototype carries the pool's destroy.
        if (localDepth > 0 && !objectClass) {
            const localObj = {} as T & IDestroyable

            setmetatable(localObj, localObjectMeta)

            return localObj
        }

        numHandedOutObjects++

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

            if (objectClass) {
                setmetatable(obj, objectClass.prototype)
                objectClass.prototype.__destroy = destroyObject
            } else {
                setmetatable(obj, debugName ? getObjectMeta(debugName) : defaultObjectMeta)
            }
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
            const array = getEmptyObject<T[]>(debugName) as T[] & IDestroyable
            array.length = 0
            return array
        },
        destroyObject,
        destroyClassObject,
        destroyArray: destroyObject,
        /**
         * Runs code that only one machine runs, with its tables taken from outside the pool.
         *
         * The rule it enforces: local code must never take from the pool nor give back to it, or the next table every
         * other machine hands out differs from then on, and the game desyncs a while later, far from the cause. The
         * `-smic` export is the case it was written for: it walks the whole game to build its JSON, out of dozens of
         * tables, on the machine of the player who asked and on no other.
         *
         * Anything the code inside hands out is a plain table; destroying one lets its contents go and nothing else.
         * Nested calls are counted, so an inner one cannot put the pool back in use too early.
         */
        withLocalTables: <T>(fn: () => T): T => {
            localDepth++

            const [ok, result] = pcall(fn)

            localDepth--

            if (!ok) {
                throw result
            }

            return result as T
        },
        cloneArray: <T>(arr: T[]) => {
            const newArray = MemoryHandler.getEmptyArray<T>()

            for (let i = 0; i < arr.length; i++) {
                newArray[i] = arr[i]
            }

            return newArray
        },
        /** For -desyncProbe: tables handed out, given back, and waiting in the pool right now */
        getPoolStats: () => ({
            handedOut: numHandedOutObjects,
            returned: numReturnedObjects,
            cached: cachedObjects.length,
        }),
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
