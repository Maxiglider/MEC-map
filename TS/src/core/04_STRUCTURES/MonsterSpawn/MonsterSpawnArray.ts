import { convertTextToAngle } from 'core/01_libraries/Basic_functions'
import { Constants } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { getUdgMonsterTypes } from '../../../../globals'
import { handlePaginationArgs, handlePaginationObj } from '../../06_COMMANDS/Helpers/Pagination'
import { BaseArray } from '../BaseArray'
import type { Level } from '../Level/Level'
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
                    typeof ms.sens === 'string' ? convertTextToAngle(ms.sens) : ms.sens,
                    ms.frequence,
                    ms.minX,
                    ms.minY,
                    ms.maxX,
                    ms.maxY
                )

                // Load click coordinates if they exist
                if (ms.clickX1 !== undefined) monsterSpawn.setClickX1(ms.clickX1)
                if (ms.clickY1 !== undefined) monsterSpawn.setClickY1(ms.clickY1)
                if (ms.clickX2 !== undefined) monsterSpawn.setClickX2(ms.clickX2)
                if (ms.clickY2 !== undefined) monsterSpawn.setClickY2(ms.clickY2)

                monsterSpawn.setSpawnAmount(ms.spawnAmount || 1)
                monsterSpawn.setSpawnOffset(ms.spawnOffset || 0)
                monsterSpawn.setInitialDelay(ms.initialDelay || 0)
                monsterSpawn.setFixedSpawnOffset(ms.fixedSpawnOffset)
                monsterSpawn.setFixedSpawnOffsetBounce(ms.fixedSpawnOffsetBounce)
                monsterSpawn.setFixedSpawnOffsetMirrored(ms.fixedSpawnOffsetMirrored)
                monsterSpawn.setTimedUnspawn(ms.timedUnspawn)
                if (ms.spawnShape !== undefined) monsterSpawn.setSpawnShape(ms.spawnShape)
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

    changeLabel = (oldLabel: string, newLabel: string): boolean => {
        const msWithOldLabel = this.getByLabel(oldLabel)
        const msWithNewLabel = this.getByLabel(newLabel)

        if (!msWithOldLabel || msWithNewLabel) {
            return false
        }

        msWithOldLabel.setLabel(newLabel)

        return true
    }

    displayPaginatedForPlayer = (p: player, cmd: string) => {
        const { searchTerms, pageNum } = handlePaginationArgs(cmd)
        const searchTerm = searchTerms.join(' ')

        if (searchTerm.length !== 0) {
            if (this.getByLabel(searchTerm)) {
                this.getByLabel(searchTerm)?.displayForPlayer(p)
            } else {
                Text.erP(p, `unknown monster spawn`)
            }
        } else {
            const pag = handlePaginationObj(this.getAll(), pageNum)

            if (pag.cmds.length === 0) {
                Text.erP(p, `no monster spawn for this level`)
            } else {
                for (const l of pag.cmds) {
                    Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, l)
                }
            }
        }
    }
}
