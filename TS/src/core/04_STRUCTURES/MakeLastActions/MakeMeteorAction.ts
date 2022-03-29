export class MakeMeteorAction extends MakeAction {
    private meteor: Meteor
    private level: Level

    getLevel = (): Level => {
        return this.level
    }

    // TODO; Used to be static
    create = (level: Level, meteor: Meteor): MakeMeteorAction => {
        let a: MakeMeteorAction
        if (meteor == 0 || meteor.getItem() == null) {
            return 0
        }
        a = MakeMeteorAction.allocate()
        a.isActionMadeB = true
        a.meteor = meteor
        a.level = level
        return a
    }

    destroy = () => {
        if (!this.isActionMadeB) {
            this.meteor.destroy()
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }
        this.meteor.removeMeteor()
        this.isActionMadeB = false
        Text.mkP(this.owner.getPlayer(), 'meteor creation cancelled')
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }
        this.meteor.createMeteor()
        this.isActionMadeB = true
        Text.mkP(this.owner.getPlayer(), 'meteor creation redone')
        return true
    }
}
