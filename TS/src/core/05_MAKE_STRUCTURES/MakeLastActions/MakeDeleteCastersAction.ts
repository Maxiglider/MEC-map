import { Caster } from '../../04_STRUCTURES/Caster/Caster'
import { Level } from '../../04_STRUCTURES/Level/Level'

class MakeDeleteCastersAction {
    // extends MakeAction

    static suppressions: hashtable
    static suppressionLastId: number

    private suppressionId: number
    private level: Level

    private static onInit = (): void => {
        MakeDeleteCastersAction.suppressions = InitHashtable()
        MakeDeleteCastersAction.suppressionLastId = -1
    }

    static newSuppression = (suppression: hashtable): number => {
        let i: number
        let suppressionId: number = MakeDeleteCastersAction.suppressionLastId + 1
        MakeDeleteCastersAction.suppressionLastId = suppressionId
        i = 0
        while (true) {
            if (!HaveSavedInteger(suppression, 0, i)) break
            SaveInteger(MakeDeleteCastersAction.suppressions, suppressionId, i, LoadInteger(suppression, 0, i))
            i = i + 1
        }
        return suppressionId
    }

    static removeSuppression = (suppressionId: number): void => {
        FlushChildHashtable(MakeDeleteCastersAction.suppressions, suppressionId)
    }

    getLevel = (): Level => {
        return this.level
    }

    // TODO; Used to be static
    create = (level: Level, suppression: hashtable): MakeDeleteCastersAction => {
        let a: MakeDeleteCastersAction
        if (suppression === null) {
            return 0
        }
        a = MakeDeleteCastersAction.allocate()
        a.isActionMadeB = true
        a.suppressionId = MakeDeleteCastersAction.newSuppression(suppression)
        a.level = level
        return a
    }

    onDestroy = (): void => {
        let i: number
        if (this.isActionMadeB) {
            //suppression définitive des casters
            i = 0
            while (true) {
                if (!HaveSavedInteger(MakeDeleteCastersAction.suppressions, this.suppressionId, i)) break
                Caster(LoadInteger(MakeDeleteCastersAction.suppressions, this.suppressionId, i)).destroy()
                i = i + 1
            }
        }
        MakeDeleteCastersAction.removeSuppression(this.suppressionId)
    }

    cancel = (): boolean => {
        let i: number
        if (!this.isActionMadeB) {
            return false
        }
        //création des casters supprimées
        i = 0
        while (true) {
            if (!HaveSavedInteger(MakeDeleteCastersAction.suppressions, this.suppressionId, i)) break
            Caster(LoadInteger(MakeDeleteCastersAction.suppressions, this.suppressionId, i)).enable()
            i = i + 1
        }
        this.isActionMadeB = false
        Text_mkP(this.owner.getPlayer(), 'caster deleting cancelled')
        return true
    }

    redo = (): boolean => {
        let i: number
        if (this.isActionMadeB) {
            return false
        }
        //suppression des casters recréés
        i = 0
        while (true) {
            if (!HaveSavedInteger(MakeDeleteCastersAction.suppressions, this.suppressionId, i)) break
            Caster(LoadInteger(MakeDeleteCastersAction.suppressions, this.suppressionId, i)).disable()
            i = i + 1
        }
        this.isActionMadeB = true
        Text_mkP(this.owner.getPlayer(), 'caster deleting redone')
        return true
    }
}
