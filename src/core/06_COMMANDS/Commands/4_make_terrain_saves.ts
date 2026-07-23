import { getUdgLevels, getUdgTerrainSaves } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { errorHandler } from '../../../Utils/mapUtils'
import { Constants } from '../../01_libraries/Constants'
import { IsPositiveInteger } from '../../01_libraries/Functions_on_numbers'
import { Text } from '../../01_libraries/Text'
import type { Level } from '../../04_STRUCTURES/Level/Level'
import type { TerrainSave } from '../../04_STRUCTURES/TerrainSave/TerrainSave'
import { USAGE } from '../Helpers/Command_functions'
import {
    displayTerrainSaveDetail,
    formatTerrainSaveSummaryLine,
    isNewTerrainSaveLabelValid,
} from '../Helpers/Command_functions-terrainSaves'
import { handlePagination } from '../Helpers/Pagination'

export const initExecuteCommandMake_terrain_saves = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')
    const group = 'make'

    //-saveTerrain(st) <label> [all|rect] [global|g]
    registerCommand({
        name: 'saveTerrain',
        alias: ['st'],
        group,
        argDescription: '<label> [all|rect] [global|g]',
        description:
            'Saves the whole terrain or a clicked zone into a name, associated to the current level unless "global"/"g" is passed',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam < 1 || nbParam > 3) {
                return USAGE
            }

            const label = param1
            if (!isNewTerrainSaveLabelValid(label)) {
                Text.erP(escaper.getPlayer(), 'terrain save label cannot start with a digit or with "-"')
                return true
            }

            if (nbParam >= 2 && param2 !== 'all' && param2 !== 'rect') {
                return USAGE
            }

            let level: Level | null = escaper.getMakingLevel()
            if (nbParam === 3) {
                if (param3 !== 'global' && param3 !== 'g') {
                    return USAGE
                }
                level = null
            }

            if (param2 === 'rect') {
                if (!getUdgTerrainSaves().canAssignLevel(label, level)) {
                    Text.erP(
                        escaper.getPlayer(),
                        `terrain save label "${label}" already used for this level/global scope`
                    )
                    return true
                }

                const make = escaper.makeSaveTerrainZone(label, level)
                if (make) {
                    Text.mkP(escaper.getPlayer(), make.getMakingMessage())
                } else {
                    Text.erP(escaper.getPlayer(), 'failed to initiate the creation of the terrain save')
                }
                return true
            }

            let terrainSave: TerrainSave | undefined = undefined

            errorHandler(
                () => {
                    terrainSave = getUdgTerrainSaves().new(label, level, null)
                    terrainSave.captureTerrain()
                },
                e => {
                    if (terrainSave !== undefined) {
                        getUdgTerrainSaves().remove(terrainSave)
                        terrainSave = undefined
                    }
                    Text.erP(escaper.getPlayer(), typeof e === 'string' ? e : 'failed to create terrain save')
                }
            )()

            if (terrainSave !== undefined) {
                Text.mkP(escaper.getPlayer(), `terrain save "${label}" created`)
            }
            return true
        },
    })

    //-loadTerrain(lt) <label>
    registerCommand({
        name: 'loadTerrain',
        alias: ['lt'],
        group,
        argDescription: '<label>',
        description: 'Applies the terrain save <label>',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }

            const terrainSave = getUdgTerrainSaves().resolveLabel(param1, escaper.getMakingLevel())
            if (terrainSave === null) {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                return true
            }

            terrainSave.apply()
            Text.mkP(escaper.getPlayer(), 'terrain loaded')
            return true
        },
    })

    //-unloadTerrain(ult) <label>
    registerCommand({
        name: 'unloadTerrain',
        alias: ['ult'],
        group,
        argDescription: '<label>',
        description: 'Unapplies the terrain save <label>, restoring the terrain from before it was applied',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }

            const terrainSave = getUdgTerrainSaves().resolveLabel(param1, escaper.getMakingLevel())
            if (terrainSave === null) {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                return true
            }

            if (terrainSave.unapply()) {
                Text.mkP(escaper.getPlayer(), 'terrain unloaded')
            } else {
                Text.erP(escaper.getPlayer(), 'this terrain save is not currently applied')
            }
            return true
        },
    })

    //-displayTerrainSave(dts) [<label>|<levelNum>|global|g|current|c] [page]
    registerCommand({
        name: 'displayTerrainSave',
        alias: ['dts'],
        group,
        argDescription: '[<label>|<levelNum>|global|g|current|c] [page]',
        description: 'Displays terrain saves - a label shows details, otherwise lists them, filterable and paginated',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam > 2) {
                return USAGE
            }

            const currentLevel = escaper.getMakingLevel()

            const isSelector =
                nbParam === 0 ||
                param1 === 'global' ||
                param1 === 'g' ||
                param1 === 'current' ||
                param1 === 'c' ||
                IsPositiveInteger(param1)

            if (!isSelector) {
                if (nbParam > 1) {
                    return USAGE
                }

                const terrainSave = getUdgTerrainSaves().resolveLabel(param1, currentLevel)
                if (terrainSave === null) {
                    Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                    return true
                }

                displayTerrainSaveDetail(terrainSave, escaper.getPlayer())
                return true
            }

            let filterLevel: Level | null | 'both' = 'both'
            if (nbParam >= 1 && param1 !== '') {
                if (param1 === 'global' || param1 === 'g') {
                    filterLevel = null
                } else if (param1 === 'current' || param1 === 'c') {
                    filterLevel = currentLevel
                } else {
                    const level = getUdgLevels().get(S2I(param1))
                    if (level === null) {
                        Text.erP(escaper.getPlayer(), 'unknown level')
                        return true
                    }
                    filterLevel = level
                }
            }

            if (nbParam === 2 && !IsPositiveInteger(param2)) {
                return USAGE
            }
            const pageNum = nbParam === 2 ? S2I(param2) : 1

            const lines: string[] = []
            if (filterLevel === 'both') {
                getUdgTerrainSaves().forAll(ts => {
                    if (ts.getLevel() === null) {
                        lines.push(formatTerrainSaveSummaryLine(ts))
                    }
                })
                getUdgTerrainSaves().forAll(ts => {
                    if (ts.getLevel() === currentLevel) {
                        lines.push(formatTerrainSaveSummaryLine(ts))
                    }
                })
            } else {
                getUdgTerrainSaves().forAll(ts => {
                    if (ts.getLevel() === filterLevel) {
                        lines.push(formatTerrainSaveSummaryLine(ts))
                    }
                })
            }

            const pag = handlePagination(lines, pageNum)

            if (pag.cmds.length === 0) {
                Text.erP(escaper.getPlayer(), 'no terrain save found')
            } else {
                Text.P_timed(
                    escaper.getPlayer(),
                    Constants.TERRAIN_DATA_DISPLAY_TIME,
                    `|cff00ff00Terrain Saves (page |cff00ccff${pageNum}|r|cff00ff00/|cff00ccff${pag.totalPages}|r|cff00ff00)|r`
                )
                for (const l of pag.cmds) {
                    Text.P_timed(escaper.getPlayer(), Constants.TERRAIN_DATA_DISPLAY_TIME, l)
                }
            }
            return true
        },
    })

    //-updateTerrainSave(uts) <label> [all|rect]
    registerCommand({
        name: 'updateTerrainSave',
        alias: ['uts'],
        group,
        argDescription: '<label> [all|rect]',
        description:
            'Re-captures the terrain data for <label>. With "rect", redraws the zone first; otherwise re-captures in place',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2) {
                return USAGE
            }

            if (nbParam === 2 && param2 !== 'all' && param2 !== 'rect') {
                return USAGE
            }

            const terrainSave = getUdgTerrainSaves().resolveLabel(param1, escaper.getMakingLevel())
            if (terrainSave === null) {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                return true
            }

            if (param2 === 'rect') {
                const make = escaper.makeUpdateTerrainSaveZone(terrainSave)
                if (make) {
                    Text.mkP(escaper.getPlayer(), make.getMakingMessage())
                } else {
                    Text.erP(escaper.getPlayer(), 'failed to initiate the update of the terrain save')
                }
                return true
            }

            terrainSave.captureTerrain()
            Text.mkP(escaper.getPlayer(), `terrain save "${terrainSave.getLabel()}" updated`)
            return true
        },
    })

    //-deleteTerrainSave(delts) <label>
    registerCommand({
        name: 'deleteTerrainSave',
        alias: ['delts'],
        group,
        argDescription: '<label>',
        description: 'Deletes a terrain save and its associated events',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }

            const terrainSave = getUdgTerrainSaves().resolveLabel(param1, escaper.getMakingLevel())
            if (terrainSave === null) {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                return true
            }

            getUdgTerrainSaves().remove(terrainSave)
            Text.mkP(escaper.getPlayer(), 'terrain save deleted')
            return true
        },
    })

    //-setTerrainSaveLevel(settsl) <label> <levelNum>|global|g|current|c
    registerCommand({
        name: 'setTerrainSaveLevel',
        alias: ['settsl'],
        group,
        argDescription: '<label> <levelNum>|global|g|current|c',
        description: 'Moves a terrain save to another level, or to/from global',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }

            const terrainSave = getUdgTerrainSaves().resolveLabel(param1, escaper.getMakingLevel())
            if (terrainSave === null) {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                return true
            }

            let newLevel: Level | null
            if (param2 === 'global' || param2 === 'g') {
                newLevel = null
            } else if (param2 === 'current' || param2 === 'c') {
                newLevel = escaper.getMakingLevel()
            } else if (IsPositiveInteger(param2)) {
                const level = getUdgLevels().get(S2I(param2))
                if (level === null) {
                    Text.erP(escaper.getPlayer(), 'unknown level')
                    return true
                }
                newLevel = level
            } else {
                return USAGE
            }

            if (terrainSave.setLevel(newLevel)) {
                if (newLevel === null) {
                    Text.mkP(escaper.getPlayer(), 'terrain save scope changed to global')
                } else {
                    Text.mkP(escaper.getPlayer(), 'terrain save scope changed to level ' + newLevel.id)
                }
            } else {
                Text.erP(escaper.getPlayer(), 'this label is already used for this level/global scope')
            }
            return true
        },
    })
}
