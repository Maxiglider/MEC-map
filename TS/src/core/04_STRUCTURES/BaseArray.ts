import {arrayPush, sortArrayOfObjectsByIds} from '../01_libraries/Basic_functions'
import {ArrayHandler} from "../../Utils/ArrayHandler";

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

    get = (id: number): T | null => this.data[id] || null

    forAll(cb: (v: T, id: number) => void) {
        for (const [id, element] of pairs(this.data)) {
            cb(element, id)
        }
    }

    getAll = () => this.data

    toJson: () => any = () => { //todomax did i actually do it ?
        const outputArray = ArrayHandler.getNewArray<{ [x: string | number]: any }[]>()

        for (const [_, element] of pairs(this.data)) {
            const json = element.toJson()
            if(json){
                arrayPush(outputArray, json)
            }
        }

        return sortArrayOfObjectsByIds(outputArray)
    }

    destroyOne = (id: number) => {
        if(this.data[id]){
            this.data[id].destroy()
            delete this.data[id]
            return true
        }else{
            return false
        }
    }

    destroy = () => {
        for (const [id, v] of pairs(this.data)) {
            v.destroy()
            delete this.data[id]
        }
    }
}
