import { Text } from 'core/01_libraries/Text'
import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { udg_monsters } from '../../../../globals'
import { MonsterType } from './MonsterType'

export class MonsterTypeArray {
    private monsterTypes: { [x: number]: MonsterType } = {}
    private lastInstanceId = -1

    get = (label: string) => {
        for (const [_, monsterType] of pairs(this.monsterTypes)) {
            if (monsterType.label == label || monsterType.theAlias == label) {
                return monsterType
            }
        }

        return null
    }

    isLabelAlreadyUsed = (label: string): boolean => {
        return this.get(label) !== null
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

        this.monsterTypes[++this.lastInstanceId] = new MonsterType(
            label,
            unitTypeId,
            scale,
            immolationRadius,
            speed,
            isClickable
        )
    }

    remove = (label: string): boolean => {
        for (const [i, _monsterType] of pairs(this.monsterTypes)) {
            if (this.monsterTypes[i].label == label || this.monsterTypes[i].theAlias == label) {
                this.monsterTypes[i].destroy()
                delete this.monsterTypes[i]
                return true
            }
        }

        return false
    }

    displayForPlayer = (p: player) => {
        let hasOne = false

        for (const [_, monsterType] of pairs(this.monsterTypes)) {
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

    saveInCache = () => {
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('monsterTypes', 'monsterTypes', true)

        for (const [_, monsterType] of pairs(this.monsterTypes)) {
            StringArrayForCache.stringArrayForCache.push(monsterType.toString())
        }

        StringArrayForCache.stringArrayForCache.writeInCache()
    }
}
