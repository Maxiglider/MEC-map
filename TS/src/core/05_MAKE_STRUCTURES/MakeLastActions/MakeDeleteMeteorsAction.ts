import { Level } from '../../04_STRUCTURES/Level/Level'
import { Meteor } from '../../04_STRUCTURES/Meteor/Meteor'
import {MakeAction} from "./MakeAction";
import {Text} from "../../01_libraries/Text";

export class MakeDeleteMeteorsAction extends MakeAction {
    private suppressedMeteors

    constructor(level: Level, suppressedMeteors: Meteor[]) {
        super(level)

        if(suppressedMeteors.length == 0){
            throw "no meteor suppressed"
        }

        this.suppressedMeteors = suppressedMeteors
    }

    destroy() {
        if (this.isActionMadeB) {
            //suppression définitive des météores
            this.suppressedMeteors.map(meteor => {
                meteor.destroy()
            })
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }

        //création des météores supprimées
        this.suppressedMeteors.map(meteor => {
            meteor.createMeteorItem()
        })

        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'meteor deleting cancelled')

        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }

        //suppression des météores recréés
        this.suppressedMeteors.map(meteor => {
            meteor.removeMeteorItem()
        })

        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'meteor deleting redone')
        return true
    }
}
