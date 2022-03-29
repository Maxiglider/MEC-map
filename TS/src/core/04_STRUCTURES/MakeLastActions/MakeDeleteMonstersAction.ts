class MakeDeleteMonstersAction {
    // extends MakeAction

    static suppressions: hashtable
    static suppressionLastId: integer

    private suppressionId: integer
    private level: Level

    private static onInit = (): void => {
        MakeDeleteMonstersAction.suppressions = InitHashtable()
        MakeDeleteMonstersAction.suppressionLastId = -1
    }

    static newSuppression = (suppression: hashtable): number => {
        let i: number
        let suppressionId = MakeDeleteMonstersAction.suppressionLastId + 1
        MakeDeleteMonstersAction.suppressionLastId = suppressionId
        i = 0
        while (true) {
            if (!HaveSavedInteger(suppression, 0, i)) break
            SaveInteger(MakeDeleteMonstersAction.suppressions, suppressionId, i, LoadInteger(suppression, 0, i))
            i = i + 1
        }
        return suppressionId
    }

    static removeSuppression = (suppressionId: number): void => {
        FlushChildHashtable(MakeDeleteMonstersAction.suppressions, suppressionId)
    }

    getLevel = (): Level => {
        return this.level
    }

    static create = (level: Level, suppression: hashtable): MakeDeleteMonstersAction => {
        let a: MakeDeleteMonstersAction
        if (suppression === null) {
            return 0
        }
        a = MakeDeleteMonstersAction.allocate()
        a.isActionMadeB = true
        a.suppressionId = MakeDeleteMonstersAction.newSuppression(suppression)
        a.level = level
        return a
    }

    onDestroy = (): void => {
        let i: number
        if (this.isActionMadeB) {
            //suppression définitive des mobs
            i = 0
            while (true) {
                if (!HaveSavedInteger(MakeDeleteMonstersAction.suppressions, this.suppressionId, i)) break
                Monster(LoadInteger(MakeDeleteMonstersAction.suppressions, this.suppressionId, i)).destroy()
                i = i + 1
            }
        }
        MakeDeleteMonstersAction.removeSuppression(this.suppressionId)
    }

    cancel = (): boolean => {
        let i: number
        if (!this.isActionMadeB) {
            return false
        }
        //création des monstres supprimés
        i = 0
        while (true) {
            if (!HaveSavedInteger(MakeDeleteMonstersAction.suppressions, this.suppressionId, i)) break
            Monster(LoadInteger(MakeDeleteMonstersAction.suppressions, this.suppressionId, i)).createUnit()
            i = i + 1
        }
        this.isActionMadeB = false
        Text_mkP(this.owner.getPlayer(), 'monster deleting cancelled')
        return true
    }

    redo = (): boolean => {
        let i: number
        if (this.isActionMadeB) {
            return false
        }
        //suppression des monstres recréés
        i = 0
        while (true) {
            if (!HaveSavedInteger(MakeDeleteMonstersAction.suppressions, this.suppressionId, i)) break
            Monster(LoadInteger(MakeDeleteMonstersAction.suppressions, this.suppressionId, i)).removeUnit()
            i = i + 1
        }
        this.isActionMadeB = true
        Text_mkP(this.owner.getPlayer(), 'monster deleting redone')
        return true
    }
}
