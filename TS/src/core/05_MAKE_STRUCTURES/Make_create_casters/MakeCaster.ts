import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import {Caster} from "../../04_STRUCTURES/Caster/Caster";
import {MakeCasterAction} from "../../04_STRUCTURES/MakeLastActions/MakeCasterAction";
import {CasterType} from "../../04_STRUCTURES/Caster/CasterType";

export class MakeCaster extends Make {
    private casterType: CasterType
    private angle: number

    constructor(maker: unit, casterType: CasterType, angle: number) {
        super(maker, 'casterCreate')

        this.casterType = casterType
        this.angle = angle
    }

    getCasterType() {
        return this.casterType
    }

    getAngle() {
        return this.angle
    }

    doActions() {
        if (super.doBaseActions()) {
            const caster = new Caster(this.getCasterType(), this.orderX, this.orderY, this.getAngle())
            this.escaper.getMakingLevel().monsters.new(caster, true)
            this.escaper.newAction(new MakeCasterAction(this.escaper.getMakingLevel(), caster))
        }
    }
}
