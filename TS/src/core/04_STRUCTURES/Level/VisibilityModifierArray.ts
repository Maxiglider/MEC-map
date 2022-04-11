import type { Level } from './Level'
import { VisibilityModifier } from './VisibilityModifier'

export class VisibilityModifierArray {
    private lastInstance = -1
    private level: Level
    private vms: { [x: number]: VisibilityModifier } = {}

    constructor(level: Level) {
        this.level = level
    }

    new = (x1: number, y1: number, x2: number, y2: number) => {
        this.lastInstance++
        this.vms[this.lastInstance] = new VisibilityModifier(x1, y1, x2, y2)
        this.vms[this.lastInstance].level = this.level
        this.vms[this.lastInstance].id = this.lastInstance
        return this.vms[this.lastInstance]
    }

    newFromExisting = (vm: VisibilityModifier) => {
        this.lastInstance++
        this.vms[this.lastInstance] = vm
        return vm
    }

    count = () => {
        let n = 0

        for (const [_k, _v] of pairs(this.vms)) {
            n++
        }

        return n
    }

    get = (visibilityId: number) => {
        if (visibilityId < 0 || visibilityId > this.lastInstance) {
            return null
        }
        return this.vms[visibilityId]
    }

    getLastInstanceId = (): number => {
        return this.lastInstance
    }

    removeVisibility = (arrayId: number) => {
        delete this.vms[arrayId]
    }

    removeAllVisibilityModifiers = () => {
        for (const [_, vm] of pairs(this.vms)) {
            vm.destroy()
        }
    }

    // Unused
    // removeLasts = (numberOfVMToRemove: number): boolean => {
    //     const vms = this.vms
    //         .filter(vm => vm !== undefined)
    //         .reverse()

    //     let i = numberOfVMToRemove
    //     while (i > 0 && vms.length > 0) {
    //         vms[0].destroy()
    //         vms.shift()
    //         i = i - 1
    //     }
    //     return i === 0
    // }

    activate = (activ: boolean) => {
        for (const [_, vm] of pairs(this.vms)) {
            vm.activate(activ)
        }
    }

    destroy = () => {
        for (const [_, vm] of pairs(this.vms)) {
            vm.destroy()
        }
    }
}
