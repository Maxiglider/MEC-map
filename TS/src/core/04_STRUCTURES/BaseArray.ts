type BaseModel = { getId?: () => number; destroy: () => void }

export abstract class BaseArray<T extends BaseModel> {
    protected lastInstanceId = -1
    protected data: { [x: number]: T } = {}

    protected _new = (v: T) => {
        const id = v.getId?.()

        if (id) {
            this.data[id] = v
        } else {
            this.data[++this.lastInstanceId] = v
        }
    }

    count = () => {
        let n = 0

        for (const [_k, _v] of pairs(this.data)) {
            n++
        }

        return n
    }

    get = (id: number) => this.data[id]

    forAll(cb: (v: T) => void) {
        for (const [_, escaper] of pairs(this.data)) {
            cb(escaper)
        }
    }

    getAll = () => this.data

    destroy = () => {
        for (const [id, v] of pairs(this.data)) {
            v.destroy()
            delete this.data[id]
        }
    }
}
