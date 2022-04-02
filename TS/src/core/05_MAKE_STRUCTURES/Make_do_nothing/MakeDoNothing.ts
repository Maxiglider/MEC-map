import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeDoNothing extends Make {
    constructor(maker: unit) {
        super(maker, 'doNothing')
    }

    doActions() {
        super.doBaseActions()
    }
}
