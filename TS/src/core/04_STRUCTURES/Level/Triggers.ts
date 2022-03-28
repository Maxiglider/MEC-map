export class Trigger {
    private t: trigger = CreateTrigger()

    destroy = () => {
        DestroyTrigger(this.t)
        ;(this.t as any) = null
    }

    activate = (activ: boolean) => {
        if (activ) {
            EnableTrigger(this.t)
        } else {
            DisableTrigger(this.t)
        }
    }
}

export class TriggerArray {
    private triggers: Trigger[] = []
    private lastInstance = -1

    destroy = () => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            this.triggers[i].destroy()
            i = i + 1
        }
        this.lastInstance = -1
    }

    activate = (activ: boolean) => {
        let i = 0
        while (true) {
            if (i > this.lastInstance) break
            if (this.triggers[i] !== null) {
                this.triggers[i].activate(activ)
            }
            i = i + 1
        }
    }
}
