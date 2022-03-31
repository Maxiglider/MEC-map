//todomax execute this at start of the game
import {Monster, udg_monsters} from "./Monster";
import {NewPatrolMonster} from "./Monster_creation_functions";
import {CACHE_SEPARATEUR_PARAM} from "../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache";
import {MonsterType} from "./MonsterType";

const initMonsterSimplePatrol = () => {
    //vérification que les monstres multi-patrouilles patrouillent bien
    simplePatrolMobs = CreateGroup()

    const checkSimplePatrolMobsPeriod = 5

    const CheckSimplePatrolMobsEnum = (): void => {
        if (GetUnitCurrentOrder(GetEnumUnit()) === 0) {
            udg_monsters[GetUnitUserData(GetEnumUnit())].createUnit()
        }
    }

    const CheckSimplePatrolMobs_Actions = (): void => {
        ForGroup(simplePatrolMobs, CheckSimplePatrolMobsEnum)
    }

    const Init_MonsterSimplePatrol = (): void => {
        let trigCheckSimplePatrolMobs = CreateTrigger()
        TriggerAddAction(trigCheckSimplePatrolMobs, CheckSimplePatrolMobs_Actions)
        TriggerRegisterTimerEvent(trigCheckSimplePatrolMobs, checkSimplePatrolMobsPeriod, true)
    }

    Init_MonsterSimplePatrol()
    /////////////////////////////////////////////////////////////////////////
}

let simplePatrolMobs: group



export class MonsterSimplePatrol extends Monster {
    private x1: number
    private y1: number
    private x2: number
    private y2: number

    constructor(mt: MonsterType, x1: number, y1: number, x2: number, y2: number) {
        super(mt)

        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    static count = (): number => {
        return udg_monsters.filter(monster => monster instanceof MonsterSimplePatrol).length
    }

    removeUnit = (): void => {
        if (this.u) {
            GroupRemoveUnit(simplePatrolMobs, this.u)
            super.removeUnit()
        }
    }

    killUnit = (): void => {
        if (this.u && IsUnitAliveBJ(this.u)) {
            GroupRemoveUnit(simplePatrolMobs, this.u)
            super.killUnit()
        }
    }

    createUnit = (): void => {
        super.createUnit(() => (
            NewPatrolMonster(this.mt, this.x1, this.y1, this.x2, this.y2)
        ))

        this.u && GroupAddUnit(simplePatrolMobs, this.u)
    }

    toString = (): string => {
        let str = super.toString()
        str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x1)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y1))
        str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x2)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y2))
        return str
    }

    destroy(){
        this.level && this.level.monstersSimplePatrol.setMonsterNull(this.id)
        super.destroy()
    }
}
