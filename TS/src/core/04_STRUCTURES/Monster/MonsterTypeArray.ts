import { Text } from 'core/01_libraries/Text'
import { udg_monsters } from '../../../../globals'
import { BaseArray } from '../BaseArray'
import { MonsterType } from './MonsterType'

export class MonsterTypeArray extends BaseArray<MonsterType> {
    constructor() {
        super(true)
    }

    getByLabel = (label: string) => {
        for (const [_, monsterType] of pairs(this.data)) {
            if (monsterType.label == label || monsterType.theAlias == label) {
                return monsterType
            }
        }

        return null
    }

    isLabelAlreadyUsed = (label: string): boolean => {
        return this.getByLabel(label) !== null
    }

    new(
        label: string,
        unitTypeId: number,
        scale: number,
        immolationRadius: number,
        speed: number,
        isClickable: boolean
    ) {
        if (this.isLabelAlreadyUsed(label)) {
            throw 'Label already used'
        }

        this._new(new MonsterType(label, unitTypeId, scale, immolationRadius, speed, isClickable))
    }

    remove = (label: string): boolean => {
        for (const [i, _monsterType] of pairs(this.data)) {
            if (this.data[i].label == label || this.data[i].theAlias == label) {
                this.data[i].destroy()
                delete this.data[i]
                return true
            }
        }

        return false
    }

    displayForPlayer = (p: player) => {
        let hasOne = false

        for (const [_, monsterType] of pairs(this.data)) {
            hasOne = true
            monsterType.displayForPlayer(p)
        }

        if (!hasOne) {
            Text.erP(p, 'no monster type saved')
        }
    }

    monsterUnit2KillEffectStr(monsterUnit: unit) {
        const monster = udg_monsters[GetUnitUserData(monsterUnit)]
        const mt = monster.getMonsterType()
        return mt?.getKillingEffectStr()
    }
}
