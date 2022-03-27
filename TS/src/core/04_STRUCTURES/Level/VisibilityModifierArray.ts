import { VisibilityModifier } from './VisibilityModifier'

export class VisibilityModifierArray {
    private vms: VisibilityModifier[] = []
    private lastInstance = -1

    destroy = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            this.vms[i].destroy()
            i = i + 1
        }
        this.lastInstance = -1
    }

    new = (x1: number, y1: number, x2: number, y2: number): VisibilityModifier => {
        if (this.lastInstance >= 99) {
            return 0
        }
        this.lastInstance = this.lastInstance + 1
        this.vms[this.lastInstance] = VisibilityModifier.create(x1, y1, x2, y2)
        this.vms[this.lastInstance].level = udg_levels.getLevelFromVisibilityModifierArray(this)
        this.vms[this.lastInstance].arrayId = this.lastInstance
        return this.vms[this.lastInstance]
    }

    newFromExisting = (vm: VisibilityModifier): VisibilityModifier => {
        if (this.lastInstance >= 199) {
            return 0
        }
        this.lastInstance = this.lastInstance + 1
        this.vms[this.lastInstance] = vm
        return vm
    }

    count = (): number => {
        let n = 0
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.vms[i] !== 0) {
                n = n + 1
            }
            i = i + 1
        }
        return n
    }

    get = (visibilityId: number): VisibilityModifier => {
        if (visibilityId < 0 || visibilityId > this.lastInstance) {
            return 0
        }
        return this.vms[visibilityId]
    }

    getLastInstanceId = (): number => {
        return this.lastInstance
    }

    setNull = (arrayId: number): void => {
        if (arrayId >= 0 && arrayId <= this.lastInstance) {
            this.vms[arrayId] = 0
        }
    }

    removeAllVisibilityModifiers = (): void => {
        while (true) {
            if (this.lastInstance < 0) break
            this.vms[this.lastInstance].destroy()
            this.lastInstance = this.lastInstance - 1
        }
    }

    removeLasts = (numberOfVMToRemove: number): boolean => {
        let i = numberOfVMToRemove
        while (true) {
            if (i <= 0 || this.lastInstance < 0) break
            this.vms[this.lastInstance].destroy()
            this.lastInstance = this.lastInstance - 1
            i = i - 1
        }
        return i === 0
    }

    activate = (activ: boolean): void => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            this.vms[i].activate(activ)
            i = i + 1
        }
    }
}
