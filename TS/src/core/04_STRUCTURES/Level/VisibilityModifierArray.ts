import type { Level } from './Level'
import { VisibilityModifier } from './VisibilityModifier'

export class VisibilityModifierArray {
    private level: Level
    private vms: { [x: number]: VisibilityModifier } = {}

    constructor(level: Level) {
        this.level = level
    }

    new = (x1: number, y1: number, x2: number, y2: number) => {
        const n = this.count()
        this.vms[n] = new VisibilityModifier(x1, y1, x2, y2)
        this.vms[n].level = this.level
        this.vms[n].id = n
        return this.vms[n]
    }

    newFromExisting = (vm: VisibilityModifier) => {
        const n = this.count()
        this.vms[n] = vm
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
        if (visibilityId < 0 || visibilityId > this.count()) {
            return null
        }
        return this.vms[visibilityId]
    }

    getLastInstanceId = (): number => {
        return this.count() - 1
    }

    removeVisibility = (arrayId: number) => {
        delete this.vms[arrayId]
    }

    removeAllVisibilityModifiers = () => {
        for (const [_, vm] of pairs(this.vms)) {
            vm.destroy()
        }
    }

    removeLasts = (numberOfVMToRemove: number): boolean => {
        const vms = Object.values(this.vms)
            .filter(vm => vm !== undefined)
            .reverse()

        let i = numberOfVMToRemove
        while (i > 0 && vms.length > 0) {
            vms[0].destroy()
            vms.shift()
            i = i - 1
        }
        return i === 0
    }

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
