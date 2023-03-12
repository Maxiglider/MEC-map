import { createTimer } from 'Utils/mapUtils'
import { udg_monsters } from '../../../../globals'
import { Monster } from './Monster'
import { MonsterMultiplePatrols } from './MonsterMultiplePatrols'
import { MonsterType } from './MonsterType'
import { NewPatrolMonster } from './Monster_functions'

export const initMonsterSimplePatrol = () => {
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
    x1: number
    y1: number
    x2: number
    y2: number

    constructor(mt: MonsterType, x1: number, y1: number, x2: number, y2: number, forceId: number | null = null) {
        super(mt, forceId)

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

    toJson() {
        const output = super.toJson()
        if (output) {
            output['x1'] = R2I(this.x1)
            output['y1'] = R2I(this.y1)
            output['x2'] = R2I(this.x2)
            output['y2'] = R2I(this.y2)
        }
        return output
    }
}

export const createMonsterSmartPatrol = (
    mt: MonsterType,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    forceId: number | null = null
) => {
    const maxDistance = Math.sqrt(Math.pow(Math.abs(x1 - x2), 2) + Math.pow(Math.abs(y1 - y2), 2))
    const maxTiles = 6 * 128

    if (maxDistance < maxTiles) {
        return new MonsterSimplePatrol(mt, x1, y1, x2, y2, forceId)
    } else {
        const amountOfPatrols = Math.ceil(maxDistance / maxTiles)
        const dx = (x1 - x2) / amountOfPatrols
        const dy = (y1 - y2) / amountOfPatrols

        MonsterMultiplePatrols.destroyLocs()

        for (let i = 0; i <= amountOfPatrols; i++) {
            const ddx = i * dx
            const ddy = i * dy

            MonsterMultiplePatrols.storeNewLoc(x1 - ddx, y1 - ddy)
        }

        return new MonsterMultiplePatrols(mt, 'string', forceId)
    }
}
