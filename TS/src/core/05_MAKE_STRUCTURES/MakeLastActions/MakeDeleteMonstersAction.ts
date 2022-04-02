import { Level } from '../../04_STRUCTURES/Level/Level'
import { Monster } from '../../04_STRUCTURES/Monster/Monster'
import {MakeAction} from "./MakeAction";
import {Text} from "../../01_libraries/Text";

class MakeDeleteMonstersAction extends MakeAction {
    private suppressedMonsters: Monster[]

    constructor(level: Level, suppressedMonsters: Monster[]) {
        super(level)

        if(suppressedMonsters.length == 0){
            throw "no monster suppressed"
        }

        this.suppressedMonsters = suppressedMonsters
    }

    destroy = (): void => {
        if (this.isActionMadeB) {
            //suppression définitive des mobs
            this.suppressedMonsters.map(monster => {
                monster.destroy()
            })
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }

        //création des monstres supprimés
        this.suppressedMonsters.map(monster => {
            monster.createUnit()
        })

        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'monster deleting cancelled')

        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }

        //suppression des monstres recréés
        this.suppressedMonsters.map(monster => {
            monster.removeUnit()
        })

        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'monster deleting redone')
        
        return true
    }
}
