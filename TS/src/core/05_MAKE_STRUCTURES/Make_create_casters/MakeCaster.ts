import {Make} from 'core/05_MAKE_STRUCTURES/Make/Make'


class MakeCaster extends Make {
    private casterType: CasterType
    private angle: number


    constructor(maker: unit, casterType: CasterType, angle: number) {
        super(maker, "casterCreate");

        this.casterType = casterType
        this.angle = angle
    }

    getCasterType() {
        return this.casterType
    }

    getAngle() {
        return this.angle
    }

    doActions(){
        if(super.doActions()){
            let x = GetOrderPointX()
            let y = GetOrderPointY()

            const caster = this.escaper.getMakingLevel().casters.new(this.getCasterType(), x, y, this.getAngle(), true)
            this.escaper.newAction(new MakeCasterAction(this.escaper.getMakingLevel(), caster))
        }

        return true
    }
}