import { Text } from 'core/01_libraries/Text'
import { Level } from '../Level/Level'
import { VisibilityModifier } from '../Level/VisibilityModifier'
import { MakeAction } from './MakeAction'

export class MakeVisibilityModifierAction extends MakeAction {
    private level: Level
    private visibilityModifierSave: VisibilityModifier
    private visibilityModifierPointeur: VisibilityModifier //pointe vers le vm effectif

    getLevel = (): Level => {
        return this.level
    }

    // TODO; Used to be static
    create = (level: Level, visibilityModifier: VisibilityModifier): MakeVisibilityModifierAction => {
        let a: MakeVisibilityModifierAction
        if (visibilityModifier === 0) {
            return 0
        }
        a = MakeVisibilityModifierAction.allocate()
        a.isActionMadeB = true
        a.level = level
        a.visibilityModifierSave = 0
        a.visibilityModifierPointeur = visibilityModifier
        return a
    }

    destroy = () => {
        if (this.visibilityModifierSave !== 0) {
            this.visibilityModifierSave.destroy()
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }
        this.visibilityModifierSave = this.visibilityModifierPointeur.copy()
        this.visibilityModifierPointeur.destroy()
        this.isActionMadeB = false
        Text.mkP(this.owner.getPlayer(), 'visibility creation cancelled')
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }
        this.visibilityModifierPointeur = this.level.newVisibilityModifierFromExisting(this.visibilityModifierSave)
        if (this.visibilityModifierPointeur === 0) {
            Text.erP(this.owner.getPlayer(), "can't recreate visibility, full for this level")
        } else {
            this.visibilityModifierPointeur.activate(true)
        }
        this.visibilityModifierSave = 0
        this.isActionMadeB = true
        Text.mkP(this.owner.getPlayer(), 'visibility creation redone')
        return true
    }
}
