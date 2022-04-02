import { MakeMeteorAction } from 'core/05_MAKE_STRUCTURES/MakeLastActions/MakeMeteorAction'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeMeteor extends Make {
    constructor(maker: unit) {
        super(maker, 'meteorCreate')
    }

    doActions() {
        if (super.doBaseActions()) {
            const meteor = this.escaper.getMakingLevel().meteors.new(this.orderX, this.orderY, true)
            this.escaper.newAction(new MakeMeteorAction(this.escaper.getMakingLevel(), meteor))
        }
    }
}
