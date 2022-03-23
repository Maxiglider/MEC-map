export type IEscaperEffect = ReturnType<typeof EscaperEffect>

export const EscaperEffect = (efStr: string, u: unit, bodyPart: string) => {
    let ef: effect | null = AddSpecialEffectTarget(efStr, u, bodyPart)

    const destroy = () => {
        if (ef !== null) {
            DestroyEffect(ef)
            ef = null
        }
    }

    const recreate = (u: unit) => {
        destroy()
        ef = AddSpecialEffectTarget(efStr, u, bodyPart)
    }

    return { efStr, bodyPart, ef, destroy, recreate }
}
