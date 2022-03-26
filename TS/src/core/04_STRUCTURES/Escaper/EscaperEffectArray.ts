import { EscaperEffect, IEscaperEffect } from './EscaperEffect'

export type IEscaperEffectArray = ReturnType<typeof EscaperEffectArray>

export const EscaperEffectArray = () => {
    const efs: IEscaperEffect[] = []
    let lastInstance: number = -1

    const new = (efStr: string, u: unit, bodyPart: string) => {
        let i: number

        if (lastInstance >= 19) {
            efs[0].destroy()

            i = 0

            while (!(i >= 19)) {
                efs[i] = efs[i + 1]
                i = i + 1
            }
        } else {
            lastInstance = lastInstance + 1
        }

        efs[lastInstance] = EscaperEffect(efStr, u, bodyPart)
    }

    const count = () => {
        let n = 0
        let i = 0

        while (!(i > lastInstance)) {
            if (!!efs[i]) {
                n = n + 1
            }

            i = i + 1
        }

        return n
    }

    const destroy = () => {
        while (!(lastInstance < 0)) {
            efs[lastInstance].destroy()
            lastInstance = lastInstance - 1
        }
    }

    const destroyLastEffects = (numEfToDestroy: number) => {
        let i = numEfToDestroy

        while (!(i <= 0 || lastInstance < 0)) {
            efs[lastInstance].destroy()
            lastInstance = lastInstance - 1
            i = i - 1
        }
    }

    const hideEffects = () => {
        let i = 0

        while (!(i > lastInstance)) {
            efs[i].destroy()
            i = i + 1
        }
    }

    const showEffects = (u: unit) => {
        let i = 0

        while (!(i > lastInstance)) {
            efs[i].recreate(u)
            i = i + 1
        }
    }

    return {
        new,
        count,
        destroy,
        destroyLastEffects,
        hideEffects,
        showEffects,
    }
}
