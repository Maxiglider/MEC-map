import type {MecHookArray} from "./MecHookArray";

export class MecHook {
    static lastId = -1

    static mecHooksAll = new Map<number, MecHook>()

    static destroy = (hookId: number) => {
        const hook = MecHook.mecHooksAll.get(hookId)
        if(hook){
            hook.mecHookArray?.destroy(hookId)
            MecHook.mecHooksAll.delete(hookId)
            return true
        }

        return false
    }

    private id: number
    private cb: (this:void, args: any) => any
    public mecHookArray?: MecHookArray

    constructor(cb: (this:void) => any) {
        this.id = ++MecHook.lastId
        this.cb = cb
        MecHook.mecHooksAll.set(this.id, this)
    }

    public getId = () => {
        return this.id
    }

    public execute = (args: any) => {
        return this.cb(args)
    }
}