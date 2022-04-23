import {MecHook} from "./MecHook";

export class MecHookArray {
    private map = new Map<number, MecHook>()

    public new = (cb: () => any) => {
        const hook = new MecHook(cb)
        this.map.set(hook.getId(), hook)
        hook.mecHookArray = this
        return hook.getId()
    }

    public destroy = (id: number) => {
        const hook = this.map.get(id)
        if(hook){
            this.map.delete(id)
            return true
        }else{
            return false
        }
    }

    public getMap = () => {
        return this.map
    }

    public values = () => {
        return this.map.values()
    }

    public applyMapFromBoth(ha1: MecHookArray | undefined, ha2: MecHookArray | undefined){
        if(ha1) {
            for (const [key, value] of ha1.getMap()) {
                this.map.set(key, value)
            }
        }

        if(ha2) {
            for (const [key, value] of ha2.getMap()) {
                this.map.set(key, value)
            }
        }
    }
}


export function CombineHooks(ha1: MecHookArray | undefined, ha2: MecHookArray | undefined){
    const outHookArray = new MecHookArray()
    outHookArray.applyMapFromBoth(ha1, ha2)
    return outHookArray
}