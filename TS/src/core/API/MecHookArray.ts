import {MecHook} from "./MecHook";

export class MecHookArray {
    private map = new Map<number, MecHook>()

    public new = (cb: () => any) => {
        const hook = new MecHook(cb)
        this.map.set(hook.getId(), hook)
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

    public values = () => {
        return this.map.values()
    }
}