import { getUdgMonsterTypes } from '../../../../globals'
import { Text } from '../../01_libraries/Text'
import { BaseArray } from '../BaseArray'
import type { Level } from '../Level/Level'
import type { MonsterType } from '../Monster/MonsterType'
import { MonsterSpawn } from './MonsterSpawn'

export class MonsterSpawnArray extends BaseArray<MonsterSpawn> {
    private level: Level

    constructor(level: Level) {
        super(false)
        this.level = level
    }

    getByLabel = (label: string) => {
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

        this.level.updateDebugRegions()
    }

    newFromJson = (monsterSpawnsJson: { [x: string]: any }[]) => {
        for (let ms of monsterSpawnsJson) {
            const mt = getUdgMonsterTypes().getByLabel(ms.monsterTypeLabel)
            if (!mt) {
                Text.erA('Monster type "' + ms.monsterTypeLabel + '" unknown')
            } else {
                const monsterSpawn = new MonsterSpawn(
                    ms.label,
                    mt,
                    ms.sens,
                    ms.frequence,
                    ms.minX,
                    ms.minY,
                    ms.maxX,
                    ms.maxY
                )
                monsterSpawn.setSpawnAmount(ms.spawnAmount || 1)
                monsterSpawn.setSpawnOffset(ms.spawnOffset || 0)
                monsterSpawn.setInitialDelay(ms.initialDelay || 0)
                monsterSpawn.setFixedSpawnOffset(ms.fixedSpawnOffset)
                monsterSpawn.setFixedSpawnOffsetBounce(ms.fixedSpawnOffsetBounce)
                monsterSpawn.setFixedSpawnOffsetMirrored(ms.fixedSpawnOffsetMirrored)
                this.new(monsterSpawn, false)
            }
        }
    }

    removeMonsterSpawn = (monsterSpawnId: number) => {
        delete this.data[monsterSpawnId]

        this.level.updateDebugRegions()
    }

    clearMonsterSpawn = (label: string): boolean => {
        let ms = this.getByLabel(label)
        if (ms) {
            delete this.data[ms.getId()]
            ms.destroy()
            return true
        } else {
            return false
        }
    }

    setMonsterType = (label: string, mt: MonsterType): boolean => {
        let ms = this.getByLabel(label)
        if (ms) {
            ms.setMonsterType(mt)
            return true
        } else {
            return false
        }
    }

    setSens = (label: string, sens: string): boolean => {
        let ms = this.getByLabel(label)
        if (ms) {
            ms.setSens(sens)
            return true
        } else {
            return false
        }
    }

    setFrequence = (label: string, frequence: number): boolean => {
        let ms = this.getByLabel(label)
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
        const msWithOldLabel = this.getByLabel(oldLabel)
        const msWithNewLabel = this.getByLabel(newLabel)

        if (!msWithOldLabel || msWithNewLabel) {
            return false
        }

        msWithOldLabel.setLabel(newLabel)

        return true
    }
}
