export class MecHook {
    static lastId = -1

    private id: number
    private cb: (this:void, args: any) => any

    constructor(cb: (this:void) => any) {
        this.id = ++MecHook.lastId
        this.cb = cb
    }

    public getId = () => {
        return this.id
    }

    public execute = (args: any) => {
        return this.cb(args)
    }
}