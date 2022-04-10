import type { Level } from './Level'
import { VisibilityModifier } from './VisibilityModifier'

export class VisibilityModifierArray {
    private level: Level
    private vms: VisibilityModifier[] = []

    constructor(level: Level) {
        this.level = level
    }

    new = (x1: number, y1: number, x2: number, y2: number) => {
        const n = this.vms.length
        this.vms[n] = new VisibilityModifier(x1, y1, x2, y2)
        this.vms[n].level = this.level
        this.vms[n].id = n
        return this.vms[n]
    }

    newFromExisting = (vm: VisibilityModifier) => {
        const n = this.vms.length
        this.vms[n] = vm
        return vm
    }

    count = (): number => {
        return this.vms.filter(vm => vm !== undefined).length
    }

    get = (visibilityId: number) => {
        if (visibilityId < 0 || visibilityId > this.vms.length) {
            return null
        }
        return this.vms[visibilityId]
    }

    getLastInstanceId = (): number => {
        return this.vms.length - 1
    }

    removeVisibility = (arrayId: number) => {
        delete this.vms[arrayId]
    }

    removeAllVisibilityModifiers = () => {
        for (const vm of this.vms) {
            vm.destroy()
        }
    }

    removeLasts = (numberOfVMToRemove: number): boolean => {
        const vms = this.vms.filter(vm => vm !== undefined).reverse()

        let i = numberOfVMToRemove
        while (i > 0 && vms.length > 0) {
            vms[0].destroy()
            vms.shift()
            i = i - 1
        }
        return i === 0
    }

    activate = (activ: boolean) => {
        for (const vm of this.vms) {
            vm.activate(activ)
        }
    }

    destroy = () => {
        for (const vm of this.vms) {
            vm.destroy()
        }
    }
}
