import {sortArrayOfObjectsByIds} from "../01_libraries/Basic_functions";

type BaseModel = { getId?: () => number; destroy: () => void; toJson: () => {} }

export abstract class BaseArray<T extends BaseModel> {
    private manageIds = false

    protected lastInstanceId = -1
    protected data: { [x: number]: T } = {}

    constructor(manageIds: boolean) {
        this.manageIds = manageIds
    }

    protected _new = (v: T) => {
        if (this.manageIds) {
            this.data[++this.lastInstanceId] = v
        } else {
            const id = v.getId?.()

            if (!id) {
                throw `BaseArray: _new: v.getId() is null (${this.constructor.name})`
            }

            this.data[id] = v
        }

        return this.lastInstanceId
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
        for (const [_, element] of pairs(this.data)) {
            cb(element)
        }
    }

    getAll = () => this.data

    toJson: () => any = () => sortArrayOfObjectsByIds(Object.values(this.data)).map(item => item.toJson())

    destroy = () => {
        for (const [id, v] of pairs(this.data)) {
            v.destroy()
            delete this.data[id]
        }
    }
}
