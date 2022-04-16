import { Text } from 'core/01_libraries/Text'
import { BaseArray } from '../BaseArray'
import { MonsterType } from '../Monster/MonsterType'
import { CasterType } from './CasterType'

export class CasterTypeArray extends BaseArray<CasterType> {
    constructor() {
        super(true)
    }

    getByLabel = (label: string) => {
        for (const [_, casterType] of pairs(this.data)) {
            if (casterType.label === label || casterType.theAlias === label) {
                return casterType
            }
        }

        return null
    }

    isLabelAlreadyUsed = (label: string): boolean => {
        return this.getByLabel(label) !== null
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
        if (this.isLabelAlreadyUsed(label)) {
            return null
        }

        const casterType = new CasterType(
            label,
            casterMonsterType,
            projectileMonsterType,
            range,
            projectileSpeed,
            loadTime,
            animation
        )

        this._new(casterType)

        return casterType
    }

    remove = (label: string): boolean => {
        for (const [casterTypeId, casterType] of pairs(this.data)) {
            if (casterType.label === label || casterType.theAlias === label) {
                this.data[casterTypeId].destroy()
                delete this.data[casterTypeId]
            }
        }

        return true
    }

    displayForPlayer = (p: player) => {
        let hadOne = false

        for (const [_, casterType] of pairs(this.data)) {
            casterType.displayForPlayer(p)
            hadOne = true
        }

        if (!hadOne) {
            Text.erP(p, 'no caster type saved')
        }
    }

    toJson = () => Object.values(this.data).map(item => item.toJson())
}
