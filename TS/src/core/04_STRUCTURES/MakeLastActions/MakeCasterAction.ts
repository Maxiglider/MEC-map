import {Text} from 'core/01_libraries/Text'
import {Level} from "../Level/Level";


class MakeCasterAction extends MakeAction {
    private caster: Caster

    constructor(level: Level, caster: Caster) {
        super(level)
        this.caster = caster
    }

    destroy() {
        if (!this.isActionMadeB) { //if the action was cancelled'
            this.caster.destroy()
        }
    }

    cancel() {
        if (!this.isActionMadeB) {
            return false
        }

        this.caster.disable()
        this.isActionMadeB = false

        Text.mkP(this.owner.getPlayer(), "caster creation cancelled")

        return true
    }

    redo() {
        if (this.isActionMadeB) {
            return false
        }

        this.caster.enable()
        this.isActionMadeB = true
        Text.mkP(this.owner.getPlayer(), "meteor creation redone")

        return true
    }
}