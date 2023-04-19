import { MemoryHandler } from 'Utils/MemoryHandler'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { MecHook } from './MecHook'

export class MecHookArray {
    private hooks = MemoryHandler.getEmptyArray<MecHook>()

    public new = (cb: () => any) => {
        const hook = new MecHook(cb)
        arrayPush(this.hooks, hook)
        hook.mecHookArray = this
        return hook.getId()
    }

    public destroy = (id: number) => {
        const hook = this.hooks[id]
        if (hook) {
            ;(this.hooks as any)[id] = null
            return true
        } else {
            return false
        }
    }

    public getHooks = () => this.hooks
}

export function CombineHooks(ha1: MecHookArray | undefined, ha2: MecHookArray | undefined) {
    const outHookArray = MemoryHandler.getEmptyArray<MecHook>()

    if (ha1) {
        for (const value of ha1.getHooks()) {
            arrayPush(outHookArray, value)
        }
    }

    if (ha2) {
        for (const value of ha2.getHooks()) {
            arrayPush(outHookArray, value)
        }
    }

    return outHookArray
}
