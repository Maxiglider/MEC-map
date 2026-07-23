import { getUdgLevels, getUdgTerrainSaves } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { IsPositiveInteger } from '../../01_libraries/Functions_on_numbers'
import { Text } from '../../01_libraries/Text'
import type { Level } from '../../04_STRUCTURES/Level/Level'
import type { TerrainSave } from '../../04_STRUCTURES/TerrainSave/TerrainSave'
import { isNewTerrainSaveLabelValid } from '../Helpers/commands-helpers'

export const initExecuteCommandMake_terrain_saves = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')
    const group = 'make'

    //-saveTerrain(st) <label> [all] [global|g]   --> zone-scoped saves ("rect") not available yet
    registerCommand({
        name: 'saveTerrain',
        alias: ['st'],
        group,
        argDescription: '<label> [all] [global|g]',
        description:
            'Saves the whole terrain into a name, associated to the current level unless "global"/"g" is passed',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam < 1 || nbParam > 3) {
                Text.erP(escaper.getPlayer(), 'wrong number of parameters')
                return true
            }

            const label = param1
            if (!isNewTerrainSaveLabelValid(label)) {
                Text.erP(escaper.getPlayer(), 'terrain save label cannot start with a digit or with "-"')
                return true
            }

            if (nbParam >= 2 && param2 !== 'all') {
                Text.erP(escaper.getPlayer(), 'zone-scoped terrain saves are not available yet, use "all"')
                return true
            }

            let level: Level | null = escaper.getMakingLevel()
            if (nbParam === 3) {
                if (param3 !== 'global' && param3 !== 'g') {
                    Text.erP(escaper.getPlayer(), 'wrong parameters')
                    return true
                }
                level = null
            }

            let terrainSave: TerrainSave | undefined = undefined
            try {
                terrainSave = getUdgTerrainSaves().new(label, level, null)
                terrainSave.captureTerrain()
            } catch (e) {
                if (terrainSave !== undefined) {
                    getUdgTerrainSaves().remove(terrainSave)
                }
                throw e
            }

            Text.mkP(escaper.getPlayer(), `terrain save "${label}" created`)
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
                Text.erP(escaper.getPlayer(), 'wrong number of parameters')
                return true
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
                Text.erP(escaper.getPlayer(), 'wrong number of parameters')
                return true
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

    //-deleteTerrainSave(delts) <label>
    registerCommand({
        name: 'deleteTerrainSave',
        alias: ['delts'],
        group,
        argDescription: '<label>',
        description: 'Deletes a terrain save and its associated events',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                Text.erP(escaper.getPlayer(), 'wrong number of parameters')
                return true
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
                Text.erP(escaper.getPlayer(), 'wrong number of parameters')
                return true
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
                Text.erP(escaper.getPlayer(), 'wrong parameters')
                return true
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
