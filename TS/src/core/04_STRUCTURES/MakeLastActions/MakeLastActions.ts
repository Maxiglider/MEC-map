import { Text } from 'core/01_libraries/Text'
import { Escaper } from '../Escaper/Escaper'
import { Level } from '../Level/Level'
import { MakeAction } from './MakeAction'
import { MakeCasterAction } from './MakeCasterAction'
import { MakeMeteorAction } from './MakeMeteorAction'
import { MakeMonsterAction } from './MakeMonsterAction'
import { MakeVisibilityModifierAction } from './MakeVisibilityModifierAction'

NB_MAX_ACTIONS_SAVED = 30

export class MakeLastActions {
    private lastActions: MakeAction[] = []
    private lastActionId = -1
    private lastActionEffective = -1 //anciennement appelé "pointeur"
    private owner: Escaper

    // TODO; Used to be static

    constructor(owner: Escaper) {
        this.owner = owner
    }

    destroy = () => {
        let i = 0
        while (true) {
            if (i > this.lastActionId) break
            this.lastActions[i].destroy()
            i = i + 1
        }
    }

    newAction = (action: MakeAction): MakeAction => {
        let i: number
        if (this.lastActionEffective < this.lastActionId) {
            //suppression des actions annulées (à l'ajout d'une nouvelle action)
            i = this.lastActionEffective + 1
            while (true) {
                if (i > this.lastActionId) break
                this.lastActions[i].destroy()
                i = i + 1
            }
        }
        if (this.lastActionEffective === NB_MAX_ACTIONS_SAVED - 1) {
            //suppression de la plus ancienne des actions et décalage de tout le tableau
            this.lastActions[0].destroy()
            i = 0
            while (true) {
                if (i === NB_MAX_ACTIONS_SAVED - 1) break
                this.lastActions[i] = this.lastActions[i + 1]
                i = i + 1
            }
        } else {
            this.lastActionEffective = this.lastActionEffective + 1
        }
        //sauvegarde de l'action
        this.lastActions[this.lastActionEffective] = action
        this.lastActionId = this.lastActionEffective
        //assignation du "owner" de l'action
        action.owner = this.owner
        return action
    }

    cancelLastAction = (): boolean => {
        if (this.lastActionEffective < 0) {
            return false
        }
        if (this.lastActions[this.lastActionEffective] === 0) {
            Text.erP(this.owner.getPlayer(), 'action obsolète')
        } else {
            //annulation de l'action
            if (!this.lastActions[this.lastActionEffective].cancel()) {
                Text.erA('error : action already cancelled for player ' + I2S(GetPlayerId(this.owner.getPlayer())))
            }
        }
        this.lastActionEffective = this.lastActionEffective - 1
        return true
    }

    redoLastAction = (): boolean => {
        if (this.lastActionEffective === this.lastActionId) {
            return false
        }
        this.lastActionEffective = this.lastActionEffective + 1
        if (this.lastActions[this.lastActionEffective] === 0) {
            Text.erP(this.owner.getPlayer(), 'action obsolète')
        } else {
            //réexécution de l'action
            if (!this.lastActions[this.lastActionEffective].redo()) {
                Text.erA('error : action already redone for player ' + I2S(GetPlayerId(this.owner.getPlayer())))
            }
        }
        return true
    }

    deleteSpecificActionsForLevel = (level: Level) => {
        //actions spécifiques à un niveau :
        //MakeMonsterAction
        //MakeDeleteMonstersAction
        //MakeVisibilityModifierAction
        //MakeMeteorAction
        //MakeDeleteMeteorsAction
        //MakeCasterAction
        //MakeDeleteCastersAction
        //////
        let i = 0
        while (true) {
            if (i > this.lastActionId) break
            if (this.lastActions[i].getType() == MakeMonsterAction.typeid) {
                if (MakeMonsterAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            } else if (this.lastActions[i].getType() == MakeDeleteMonstersAction.typeid) {
                if (MakeDeleteMonstersAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            } else if (this.lastActions[i].getType() == MakeVisibilityModifierAction.typeid) {
                if (MakeVisibilityModifierAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            } else if (this.lastActions[i].getType() == MakeMeteorAction.typeid) {
                if (MakeMeteorAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            } else if (this.lastActions[i].getType() == MakeDeleteMeteorsAction.typeid) {
                if (MakeDeleteMeteorsAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            } else if (this.lastActions[i].getType() == MakeCasterAction.typeid) {
                if (MakeCasterAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            } else if (this.lastActions[i].getType() == MakeDeleteCastersAction.typeid) {
                if (MakeDeleteCastersAction(integer(this.lastActions[i])).getLevel() == level) {
                    this.lastActions[i].destroy()
                    this.lastActions[i] = 0
                }
            }
            i = i + 1
        }
    }

    destroyCancelledActions = () => {
        if (this.lastActionEffective === this.lastActionId) {
            return
        }
        while (true) {
            if (this.lastActionId <= this.lastActionEffective) break
            this.lastActions[this.lastActionId].destroy()
            this.lastActionId = this.lastActionId - 1
        }
    }

    destroyAllActions = () => {
        let i = 0
        while (true) {
            if (i > this.lastActionId) break
            this.lastActions[i].destroy()
            i = i + 1
        }
        this.lastActionId = -1
        this.lastActionEffective = -1
    }
}
