import { Text } from '../../01_libraries/Text'
import { BaseArray } from '../BaseArray'
import type { Level } from '../Level/Level'
import type { MonsterType } from '../Monster/MonsterType'
import type { MonsterSpawn } from './MonsterSpawn'

export class MonsterSpawnArray extends BaseArray<MonsterSpawn> {
    private level: Level

    constructor(level: Level) {
        super()
        this.level = level
    }

    getFromLabel = (label: string) => {
        for (const [_, ms] of pairs(this.data)) {
            if (ms.getLabel() === label) {
                return ms
            }
        }

        return null
    }

    new(monsterSpawn: MonsterSpawn, activate: boolean) {
        this._new(monsterSpawn)
        activate && monsterSpawn.activate()
        monsterSpawn.level = this.level
    }

    removeMonsterSpawn = (monsterSpawnId: number) => {
        delete this.data[monsterSpawnId]
    }

    clearMonsterSpawn = (label: string): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            delete this.data[ms.getId()]
            ms.destroy()
            return true
        } else {
            return false
        }
    }

    setMonsterType = (label: string, mt: MonsterType): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            ms.setMonsterType(mt)
            return true
        } else {
            return false
        }
    }

    setSens = (label: string, sens: string): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            ms.setSens(sens)
            return true
        } else {
            return false
        }
    }

    setFrequence = (label: string, frequence: number): boolean => {
        let ms = this.getFromLabel(label)
        if (ms) {
            ms.setFrequence(frequence)
            return true
        } else {
            return false
        }
    }

    activate = () => {
        for (const [_, ms] of pairs(this.data)) {
            ms.activate()
        }
    }

    deactivate = () => {
        for (const [_, ms] of pairs(this.data)) {
            ms.deactivate()
        }
    }

    displayForPlayer = (p: player) => {
        let nbMs = this.count()
        if (nbMs == 0) {
            Text.erP(p, 'no monster spawn for this level')
        } else {
            for (const [_, ms] of pairs(this.data)) {
                ms.displayForPlayer(p)
            }
        }
    }

    changeLabel = (oldLabel: string, newLabel: string): boolean => {
        const msWithOldLabel = this.getFromLabel(oldLabel)
        const msWithNewLabel = this.getFromLabel(newLabel)

        if (!msWithOldLabel || msWithNewLabel) {
            return false
        }

        msWithOldLabel.setLabel(newLabel)

        return true
    }
}
