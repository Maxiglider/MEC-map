import { Level } from '../Level/Level'
import { Meteor } from '../Meteor/Meteor'

class MakeDeleteMeteorsAction {
    // extends MakeAction

    static suppressions: hashtable
    static suppressionLastId: number

    private suppressionId: number
    private level: Level

    private static onInit = (): void => {
        MakeDeleteMeteorsAction.suppressions = InitHashtable()
        MakeDeleteMeteorsAction.suppressionLastId = -1
    }

    static newSuppression = (suppression: hashtable): number => {
        let i: number
        let suppressionId = MakeDeleteMeteorsAction.suppressionLastId + 1
        MakeDeleteMeteorsAction.suppressionLastId = suppressionId
        i = 0
        while (true) {
            if (!HaveSavedInteger(suppression, 0, i)) break
            SaveInteger(MakeDeleteMeteorsAction.suppressions, suppressionId, i, LoadInteger(suppression, 0, i))
            i = i + 1
        }
        return suppressionId
    }

    static removeSuppression = (suppressionId: number): void => {
        FlushChildHashtable(MakeDeleteMeteorsAction.suppressions, suppressionId)
    }

    getLevel = (): Level => {
        return this.level
    }

    static create = (level: Level, suppression: hashtable): MakeDeleteMeteorsAction => {
        let a: MakeDeleteMeteorsAction
        if (suppression === null) {
            return 0
        }
        a = MakeDeleteMeteorsAction.allocate()
        a.isActionMadeB = true
        a.suppressionId = MakeDeleteMeteorsAction.newSuppression(suppression)
        a.level = level
        return a
    }

    onDestroy = (): void => {
        let i: number
        if (this.isActionMadeB) {
            //suppression définitive des météores
            i = 0
            while (true) {
                if (!HaveSavedInteger(MakeDeleteMeteorsAction.suppressions, this.suppressionId, i)) break
                Meteor(LoadInteger(MakeDeleteMeteorsAction.suppressions, this.suppressionId, i)).destroy()
                i = i + 1
            }
        }
        MakeDeleteMeteorsAction.removeSuppression(this.suppressionId)
    }

    cancel = (): boolean => {
        let i: number
        if (!this.isActionMadeB) {
            return false
        }
        //création des météores supprimées
        i = 0
        while (true) {
            if (!HaveSavedInteger(MakeDeleteMeteorsAction.suppressions, this.suppressionId, i)) break
            Meteor(LoadInteger(MakeDeleteMeteorsAction.suppressions, this.suppressionId, i)).createMeteor()
            i = i + 1
        }
        this.isActionMadeB = false
        Text_mkP(this.owner.getPlayer(), 'meteor deleting cancelled')
        return true
    }

    redo = (): boolean => {
        let i: number
        if (this.isActionMadeB) {
            return false
        }
        //suppression des météores recréés
        i = 0
        while (true) {
            if (!HaveSavedInteger(MakeDeleteMeteorsAction.suppressions, this.suppressionId, i)) break
            Meteor(LoadInteger(MakeDeleteMeteorsAction.suppressions, this.suppressionId, i)).removeMeteor()
            i = i + 1
        }
        this.isActionMadeB = true
        Text_mkP(this.owner.getPlayer(), 'meteor deleting redone')
        return true
    }
}
