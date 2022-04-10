import { EscaperEffect } from './EscaperEffect'

const NB_EFFECTS_LIMIT = 20

export class EscaperEffectArray {
    private efs: { [x: number]: EscaperEffect } = {}

    new = (efStr: string, u: unit, bodyPart: string) => {
        let lastInstance = this.count() - 1

        if (lastInstance >= NB_EFFECTS_LIMIT - 1) {
            this.efs[0].destroy()

            for (let i = 0; i < 19; i++) {
                this.efs[i] = this.efs[i + 1]
            }
        } else {
            lastInstance = lastInstance + 1
        }

        this.efs[lastInstance] = new EscaperEffect(efStr, u, bodyPart)
    }

    count = () => {
        let n = 0

        for (const [_k, _v] of pairs(this.efs)) {
            n++
        }

        return n
    }

    destroyLastEffects = (numEfToDestroy: number) => {
        let i = numEfToDestroy
        let lastInstance = this.count() - 1

        while (i > 0 && lastInstance >= 0) {
            this.efs[lastInstance] && this.efs[lastInstance].destroy()
            delete this.efs[lastInstance]
            lastInstance--
            i--
        }
    }

    hideEffects = () => {
        for (const [_, ef] of pairs(this.efs)) {
            ef.destroy()
        }
    }

    showEffects = (u: unit) => {
        for (const [_, ef] of pairs(this.efs)) {
            ef.recreate(u)
        }
    }

    destroy = () => {
        this.destroyLastEffects(NB_EFFECTS_LIMIT)
        this.efs = {}
    }
}
