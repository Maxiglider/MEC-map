import { Text } from 'core/01_libraries/Text'
import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { udg_monsters } from '../../../../globals'
import { MonsterType } from './MonsterType'

export class MonsterTypeArray {
    private monsterTypes: MonsterType[] = []

    get = (label: string) => {
        for (let monsterType of this.monsterTypes) {
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

        const len = this.monsterTypes.length
        this.monsterTypes[len] = new MonsterType(label, unitTypeId, scale, immolationRadius, speed, isClickable)
    }

    remove = (label: string): boolean => {
        const len = this.monsterTypes.length

        for (let i = 0; i < len; i++) {
            if (this.monsterTypes[i].label == label || this.monsterTypes[i].theAlias == label) {
                this.monsterTypes[i].destroy()
                delete this.monsterTypes[i]
                return true
            }
        }

        return false
    }

    displayForPlayer = (p: player) => {
        for (let monsterType of this.monsterTypes) {
            monsterType.displayForPlayer(p)
        }

        if (this.monsterTypes.length === 0) {
            Text.erP(p, 'no monster type saved')
        }
    }

    monsterUnit2KillEffectStr(monsterUnit: unit) {
        const monster = udg_monsters[GetUnitUserData(monsterUnit)]
        const mt = monster.getMonsterType()
        return mt?.getKillingEffectStr()
    }

    saveInCache = () => {
        let i: number
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('monsterTypes', 'monsterTypes', true)
        i = 0
        while (true) {
            if (i >= this.monsterTypes.length) break
            StringArrayForCache.stringArrayForCache.push(this.monsterTypes[i].toString())
            i = i + 1
        }
        StringArrayForCache.stringArrayForCache.writeInCache()
    }
}
