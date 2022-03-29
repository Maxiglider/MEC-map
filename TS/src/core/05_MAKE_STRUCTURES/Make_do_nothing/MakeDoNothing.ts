import { Make, MakeConsts } from 'core/05_MAKE_STRUCTURES/Make/Make'

const { MAKE_LAST_CLIC_UNIT_ID } = MakeConsts


class MakeDoNothing extends Make{

    constructor(maker: unit) {
        super(maker, 'doNothing')
    }

    doActions() {
        super.doBaseActions()
    }

    cancelLastAction() {
        return false
    }

    redoLastAction() {
        return false
    }

}
