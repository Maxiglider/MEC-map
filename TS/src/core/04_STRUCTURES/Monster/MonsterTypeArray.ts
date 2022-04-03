import { Text } from 'core/01_libraries/Text'
import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { MonsterType } from './MonsterType'
import {udg_monsters} from "../../../../globals";

export class MonsterTypeArray {
    private monsterTypes: MonsterType[] = []
    private numberOfMonsterTypes = 0

    get(label: string) {
        let i = 0
        while (i < this.numberOfMonsterTypes) {
            if (this.monsterTypes[i].label == label || this.monsterTypes[i].theAlias == label) {
                return this.monsterTypes[i]
            }
            i = i + 1
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
        let n = this.numberOfMonsterTypes
        if (this.isLabelAlreadyUsed(label)) {
            return null
        }

        try {
            this.monsterTypes[n] = new MonsterType(label, unitTypeId, scale, immolationRadius, speed, isClickable)
            this.numberOfMonsterTypes = this.numberOfMonsterTypes + 1
        } catch (error) {
            if (typeof error == 'string') {
                Text.erA(error)
            }
        }
    }

    remove = (label: string): boolean => {
        let position: number
        let i: number
        let mt = this.get(label)
        if (!mt) {
            return false
        }

        i = 0
        while (true) {
            if (
                this.monsterTypes[i].label == label ||
                this.monsterTypes[i].theAlias == label ||
                i >= this.numberOfMonsterTypes
            )
                break
            i = i + 1
        }

        if (i < this.numberOfMonsterTypes) {
            position = i
            i = i + 1
            while (true) {
                if (i >= this.numberOfMonsterTypes) break
                this.monsterTypes[i - 1] = this.monsterTypes[i]
                i = i + 1
            }
            this.numberOfMonsterTypes = this.numberOfMonsterTypes - 1
        }
        mt.destroy()

        return true
    }

    displayForPlayer = (p: player) => {
        let i = 0
        while (true) {
            if (i >= this.numberOfMonsterTypes) break
            this.monsterTypes[i].displayForPlayer(p)
            i = i + 1
        }

        if (this.numberOfMonsterTypes === 0) {
            Text.erP(p, 'no monster type saved')
        }
    }

    monsterUnit2KillEffectStr(monsterUnit: unit) {
        const monster = udg_monsters[GetUnitUserData(monsterUnit)]
        const mt = monster.getMonsterType()
        monster.destroy()

        return mt?.getKillingEffectStr() || null
    }

    monsterUnit2MonsterType(monsterUnit: unit) {
        let monsterUnitTypeId = GetUnitTypeId(monsterUnit)
        let i = 0
        while (i < this.numberOfMonsterTypes) {
            if (this.monsterTypes[i].getUnitTypeId() == monsterUnitTypeId) {
                return this.monsterTypes[i]
            }
            i = i + 1
        }
        return null
    }

    saveInCache = () => {
        let i: number
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('monsterTypes', 'monsterTypes', true)
        i = 0
        while (true) {
            if (i >= this.numberOfMonsterTypes) break
            StringArrayForCache.stringArrayForCache.push(this.monsterTypes[i].toString())
            i = i + 1
        }
        StringArrayForCache.stringArrayForCache.writeInCache()
    }
}
