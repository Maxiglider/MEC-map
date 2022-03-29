import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'

export class MonsterTypeArray {
    private monsterTypes: MonsterType[]
    private numberOfMonsterTypes = 0

    get = (label: string): MonsterType => {
        let i = 0
        while (true) {
            if (i >= this.numberOfMonsterTypes) break
            if (this.monsterTypes[i].label == label || this.monsterTypes[i].theAlias == label) {
                return this.monsterTypes[i]
            }
            i = i + 1
        }
        return 0
    }

    isLabelAlreadyUsed = (label: string): boolean => {
        return this.get(label) !== 0
    }

    new = (
        label: string,
        unitTypeId: number,
        scale: number,
        immolationRadius: number,
        speed: number,
        isClickable: boolean
    ): MonsterType => {
        let n = this.numberOfMonsterTypes
        if (this.isLabelAlreadyUsed(label)) {
            return 0
        }
        this.monsterTypes[n] = new MonsterType(label, unitTypeId, scale, immolationRadius, speed, isClickable)
        if (this.monsterTypes[n] !== 0) {
            this.numberOfMonsterTypes = this.numberOfMonsterTypes + 1
        }
        return this.monsterTypes[n]
    }

    remove = (label: string): boolean => {
        let position: number
        let i: number
        let mt = this.get(label)
        if (mt === 0) {
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

    monsterUnit2KillEffectStr = (monsterUnit: unit): string => {
        const moc = new MonsterOrCaster(GetUnitUserData(monsterUnit))
        const mt = moc.getMonsterType()
        moc.destroy()
        return mt.getKillingEffectStr()
    }

    monsterUnit2MonsterType = (monsterUnit: unit): MonsterType => {
        let monsterUnitTypeId = GetUnitTypeId(monsterUnit)
        let i = 0
        while (true) {
            if (i >= this.numberOfMonsterTypes) break
            if (this.monsterTypes[i].getUnitTypeId() == monsterUnitTypeId) {
                return this.monsterTypes[i]
            }
            i = i + 1
        }
        return 0
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
