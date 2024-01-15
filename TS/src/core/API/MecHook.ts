import type { MecHookArray } from './MecHookArray'

export class MecHook<T extends (...args: any) => any> {
    static lastId = -1

    static mecHooksAll = new Map<number, MecHook<any>>()

    static destroy = (hookId: number) => {
        const hook = MecHook.mecHooksAll.get(hookId)

        if (hook) {
            hook.mecHookArray?.destroy(hookId)
            MecHook.mecHooksAll.delete(hookId)
            return true
        }

        return false
    }

    private id: number
    private cb: T
    public mecHookArray?: MecHookArray<T>

    constructor(cb: T) {
        this.id = ++MecHook.lastId
        this.cb = cb
        MecHook.mecHooksAll.set(this.id, this as any)
    }

    public getId = () => {
        return this.id
    }

    // The type should be `...args: Parameters<T>` but TSTL doesn't support it so currently hooks only support 1 typed argument
    public execute = (args: Parameters<T>[0]) => {
        return this.cb(args)
    }
}
