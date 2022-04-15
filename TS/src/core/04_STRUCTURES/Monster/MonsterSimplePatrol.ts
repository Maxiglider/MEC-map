//todomax execute this at start of the game
import { createTimer } from 'Utils/mapUtils'
import { udg_monsters } from '../../../../globals'
import { CACHE_SEPARATEUR_PARAM } from '../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { Monster } from './Monster'
import { MonsterType } from './MonsterType'
import { NewPatrolMonster } from './Monster_functions'

const initMonsterSimplePatrol = () => {
    //vérification que les monstres multi-patrouilles patrouillent bien
    simplePatrolMobs = CreateGroup()

    const checkSimplePatrolMobsPeriod = 5

    const CheckSimplePatrolMobsEnum = () => {
        if (GetUnitCurrentOrder(GetEnumUnit()) === 0) {
            udg_monsters[GetUnitUserData(GetEnumUnit())].createUnit()
        }
    }

    const CheckSimplePatrolMobs_Actions = () => {
        ForGroup(simplePatrolMobs, CheckSimplePatrolMobsEnum)
    }

    const Init_MonsterSimplePatrol = () => {
        createTimer(checkSimplePatrolMobsPeriod, true, CheckSimplePatrolMobs_Actions)
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

    static count = () => {
        let n = 0

        for (const [_, monster] of pairs(udg_monsters)) {
            if (monster instanceof MonsterSimplePatrol) {
                n++
            }
        }

        return n
    }

    removeUnit() {
        if (this.u) {
            GroupRemoveUnit(simplePatrolMobs, this.u)
            super.removeUnit()
        }
    }

    killUnit = () => {
        if (this.u && IsUnitAliveBJ(this.u)) {
            GroupRemoveUnit(simplePatrolMobs, this.u)
            super.killUnit()
        }
    }

    createUnit = () => {
        super.createUnit(() => (this.mt ? NewPatrolMonster(this.mt, this.x1, this.y1, this.x2, this.y2) : undefined))

        this.u && GroupAddUnit(simplePatrolMobs, this.u)
    }

    toString = (): string => {
        let str = super.toString()
        str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x1)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y1))
        str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x2)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y2))
        return str
    }

    toJson = () => ({
        ...super.toJson(),
        x1: R2I(this.x1),
        y1: R2I(this.y1),
        x2: R2I(this.x2),
        y2: R2I(this.y2),
    })
}
