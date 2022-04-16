export class EscaperEffect {
    private ef: effect
    private efStr: string
    private bodyPart: string

    constructor(efStr: string, u: unit, bodyPart: string) {
        this.efStr = efStr
        this.bodyPart = bodyPart
        this.ef = AddSpecialEffectTarget(efStr, u, bodyPart)
    }

    recreate = (u: unit) => {
        this.destroy()
        this.ef = AddSpecialEffectTarget(this.efStr, u, this.bodyPart)
    }

    toJson = () => ({
        //useless but mandatory due to BaseArray implementation
    })

    destroy = () => {
        DestroyEffect(this.ef)
    }
}
