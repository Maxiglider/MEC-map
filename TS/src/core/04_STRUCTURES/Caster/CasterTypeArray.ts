import { Text } from 'core/01_libraries/Text'
import { StringArrayForCache } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { CasterType } from './CasterType'

export class CasterTypeArray {
    private casterTypes: CasterType[] = []
    private numberOfCasterTypes = 0

    get = (label: string) => {
        let i = 0
        while (true) {
            if (i >= this.numberOfCasterTypes) break
            if (this.casterTypes[i].label == label || this.casterTypes[i].theAlias == label) {
                return this.casterTypes[i]
            }
            i = i + 1
        }

        return null
    }

    isLabelAlreadyUsed = (label: string): boolean => {
        return this.get(label) !== null
    }

    new = (
        label: string,
        casterMonsterType: MonsterType,
        projectileMonsterType: MonsterType,
        range: number,
        projectileSpeed: number,
        loadTime: number,
        animation: string
    ) => {
        let n = this.numberOfCasterTypes
        if (this.isLabelAlreadyUsed(label)) {
            return null
        }
        this.casterTypes[n] = new CasterType(
            label,
            casterMonsterType,
            projectileMonsterType,
            range,
            projectileSpeed,
            loadTime,
            animation
        )
        if (this.casterTypes[n] !== null) {
            this.numberOfCasterTypes = this.numberOfCasterTypes + 1
        }
        return this.casterTypes[n]
    }

    remove = (label: string): boolean => {
        let position: number
        let i: number
        let ct = this.get(label)
        if (ct === null) {
            return false
        }
        i = 0
        while (true) {
            if (
                this.casterTypes[i].label == label ||
                this.casterTypes[i].theAlias == label ||
                i >= this.numberOfCasterTypes
            )
                break
            i = i + 1
        }
        if (i < this.numberOfCasterTypes) {
            position = i
            i = i + 1
            while (true) {
                if (i >= this.numberOfCasterTypes) break
                this.casterTypes[i - 1] = this.casterTypes[i]
                i = i + 1
            }
            this.numberOfCasterTypes = this.numberOfCasterTypes - 1
        }
        ct.destroy()
        return true
    }

    displayForPlayer = (p: player) => {
        let i = 0
        while (true) {
            if (i >= this.numberOfCasterTypes) break
            this.casterTypes[i].displayForPlayer(p)
            i = i + 1
        }
        if (this.numberOfCasterTypes === 0) {
            Text.erP(p, 'no caster type saved')
        }
    }

    saveInCache = () => {
        let i: number
        StringArrayForCache.stringArrayForCache = new StringArrayForCache('casterTypes', 'casterTypes', true)
        i = 0
        while (true) {
            if (i >= this.numberOfCasterTypes) break
            StringArrayForCache.stringArrayForCache.push(this.casterTypes[i].toString())
            i = i + 1
        }
        StringArrayForCache.stringArrayForCache.writeInCache()
    }
}
