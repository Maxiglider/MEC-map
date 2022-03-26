import {Make} from 'core/05_MAKE_STRUCTURES/Make/Make'


export class MakeMeteor extends Make {

    doActions() {
        if (super.doBaseActions()) {
            const meteor = this.escaper.getMakingLevel().meteors.new(this.orderX, this.orderY, true)
            this.escaper.newAction(MakeMeteorAction.create(this.escaper.getMakingLevel(), meteor))
        }
    }

}
	
	

