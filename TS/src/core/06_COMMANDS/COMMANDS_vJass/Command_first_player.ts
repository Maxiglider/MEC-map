import { ServiceManager } from 'Services'
import { ThemeUtils } from 'Utils/ThemeUtils'
import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS, NB_MAX_OF_TERRAINS } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { TerrainTypeFromString } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_type_from_string'
import { ReinitTerrainsPositions } from 'core/07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains_position_Change_variations_and_ut_at_beginning'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { getUdgEscapers, getUdgLevels, getUdgTerrainTypes, globals } from '../../../../globals'
import { isPlayerId, resolvePlayerId, resolvePlayerIds, resolvePlayerIdsArray } from './Command_functions'

export const initExecuteCommandRed = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    //-kill(kl) <Pcolor>   --> kills a hero
    registerCommand({
        name: 'kill',
        alias: ['kl'],
        group: 'red',
        argDescription: '<Pcolor>',
        description: 'Kills a hero',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            if (escaper.isTrueMaximaxou()) {
                if (isPlayerId(param1)) {
                    if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                        getUdgEscapers().get(resolvePlayerId(param1))?.kill()
                    }
                    return true
                }

                if (param1 === 'all' || param1 === 'a') {
                    for (const [_, esc] of pairs(getUdgEscapers().getAll())) {
                        if (escaper !== esc && !esc.isEscaperSecondary()) {
                            esc.kill()
                        }
                    }
                }
                return true
            }

            if (isPlayerId(param1) && !getUdgEscapers().get(resolvePlayerId(param1))?.canCheat()) {
                if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param1))?.kill()
                }
            }
            return true
        },
    })

    //-kick(kc) <Pcolor>   --> kicks a player
    registerCommand({
        name: 'kick',
        alias: ['kc'],
        group: 'red',
        argDescription: '<Pcolor>',
        description: 'Kicks a player',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            if (escaper.isTrueMaximaxou()) {
                if (isPlayerId(param1)) {
                    const target = getUdgEscapers().get(resolvePlayerId(param1))

                    if (target != null) {
                        escaper.kick(target)
                    }

                    return true
                }
                if (param1 === 'all' || param1 === 'a') {
                    let i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break

                        const target = getUdgEscapers().get(i)

                        if (target != escaper && target != null) {
                            escaper.kick(target)
                        }

                        i = i + 1
                    }
                }
                return true
            }

            const target = getUdgEscapers().get(resolvePlayerId(param1))

            if (isPlayerId(param1) && !target?.canCheat()) {
                if (target != null) {
                    escaper.kick(target)
                }
            }
            return true
        },
    })

    //-restart(-)
    registerCommand({
        name: 'restart',
        alias: [],
        group: 'red',
        argDescription: '',
        description: 'Restarts the game',
        cb: ({ noParam }) => {
            if (noParam) {
                getUdgLevels().restartTheGame()
            }
            return true
        },
    })

    //-restartLevel(-)
    registerCommand({
        name: 'restartLevel',
        alias: [],
        group: 'red',
        argDescription: '',
        description: 'Restarts the level',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                getUdgLevels().restartCurrentLevel(escaper)
            }
            return true
        },
    })

    //-noobedit
    registerCommand({
        name: 'noobedit',
        alias: ['ne'],
        group: 'red',
        argDescription: '<active>',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam === 2 && IsBoolString(param1)) {
                globals.autoreviveDelay = 0.3

                resolvePlayerIds(param2, e => {
                    if (S2B(param1)) {
                        Text.P(escaper.getPlayer(), 'Really? Noobs!')

                        if (e.getId() !== escaper.getId()) {
                            Text.P(e.getPlayer(), 'Really? Noobs!')
                        }

                        e.isNoobedit = true
                        e.setHasAutorevive(true)
                    } else {
                        Text.P(escaper.getPlayer(), "That's better, but you're still Noobs!")

                        if (e.getId() !== escaper.getId()) {
                            Text.P(e.getPlayer(), "That's better, but you're still Noobs!")
                        }

                        e.isNoobedit = false
                        e.setHasAutorevive(false)
                    }
                })
            }

            if (nbParam === 1 && IsBoolString(param1)) {
                if (S2B(param1)) {
                    Text.A('Really? Noobs!')
                } else {
                    if (getUdgLevels().isNoobEdit()) {
                        Text.A("That's better, but you're still Noobs!")
                    }
                }

                getUdgLevels().setIsNoobEdit(S2B(param1))
            }

            return true
        },
    })

    //-speededit
    registerCommand({
        name: 'speededit',
        alias: ['se'],
        group: 'red',
        argDescription: '<active> [player]',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (param2.length === 0) param2 = 'all'

            if ((nbParam === 1 || nbParam === 2) && IsBoolString(param1)) {
                resolvePlayerIds(param2, e => {
                    if (S2B(param1)) {
                        Text.P(e.getPlayer(), 'Letsgoooooo!')

                        if (e.getId() !== escaper.getId() && nbParam === 2) {
                            Text.P(escaper.getPlayer(), 'Letsgoooooo!')
                        }

                        e.isSpeedEdit = true
                        e.absoluteSlideSpeed(800, true)
                        e.absoluteRotationSpeed(1.34)
                    } else {
                        Text.P(e.getPlayer(), 'Speed disabled')

                        if (e.getId() !== escaper.getId() && nbParam === 2) {
                            Text.P(escaper.getPlayer(), 'Speed disabled')
                        }

                        e.isSpeedEdit = false
                        e.stopAbsoluteSlideSpeed(true)
                        e.stopAbsoluteRotationSpeed()
                    }
                })

                getUdgLevels().setIsSpeedEdit(S2B(param1))
            }

            return true
        },
    })

    //-setLevelProgression(setlp) all|allied|solo
    registerCommand({
        name: 'setLevelProgression',
        alias: ['setlp'],
        group: 'red',
        argDescription: '<all|allied|solo> [player]',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (param1 !== 'all' && param1 !== 'allied' && param1 !== 'solo') {
                Text.erP(escaper.getPlayer(), 'Invalid mode')
                return true
            }

            Text.A(`Level progression changed to: ${param1}`)
            getUdgLevels().setLevelProgression(param1)
            return true
        },
    })

    //-setPointsEnabled(setpe) bool
    registerCommand({
        name: 'setPointsEnabled',
        alias: ['setpe'],
        group: 'red',
        argDescription: '<bool>',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (!IsBoolString(param1)) {
                return true
            }

            const enabled = S2B(param1)
            ServiceManager.getService('Multiboard').setPointsEnabled(enabled)
            Text.P(escaper.getPlayer(), `Points have been ${enabled ? 'enabled' : 'disabled'}`)
            return true
        },
    })

    //-setPointsEarnedOnLevelCompletion(setpeolc) number
    registerCommand({
        name: 'setPointsEarnedOnLevelCompletion',
        alias: ['setpeolc'],
        group: 'red',
        argDescription: '<number>',
        description: '',
        enabled: () => ServiceManager.getService('Multiboard').arePointsEnabled(),
        cb: ({ param1 }, escaper) => {
            const points = S2I(param1)
            ServiceManager.getService('Multiboard').setPointsEarnedOnLevelCompletion(points)
            Text.P(escaper.getPlayer(), `Points earned on level completion ${points}`)
            return true
        },
    })

    //-setPointsEarnedOnMeteorCompletion(setpeomc) number
    registerCommand({
        name: 'setPointsEarnedOnMeteorCompletion',
        alias: ['setpeomc'],
        group: 'red',
        argDescription: '<number>',
        description: '',
        enabled: () => ServiceManager.getService('Multiboard').arePointsEnabled(),
        cb: ({ param1 }, escaper) => {
            const points = S2I(param1)
            ServiceManager.getService('Multiboard').setPointsEarnedOnMeteorCompletion(points)
            Text.P(escaper.getPlayer(), `Points earned on meteor completion ${points}`)
            return true
        },
    })

    //-setPointsEarnedOnMeteorCompletionMaxPerLevel(setpeomcmpl) number
    registerCommand({
        name: 'setPointsEarnedOnMeteorCompletionMaxPerLevel',
        alias: ['setpeomcmpl'],
        group: 'red',
        argDescription: '<number>',
        description: '',
        enabled: () => ServiceManager.getService('Multiboard').arePointsEnabled(),
        cb: ({ param1 }, escaper) => {
            const points = S2I(param1)
            ServiceManager.getService('Multiboard').setPointsEarnedOnMeteorCompletionMaxPerLevel(points)
            Text.P(escaper.getPlayer(), `Points earned on meteor completion max per level ${points}`)
            return true
        },
    })

    //-adjustPlayerPoints(adjustpp) <playerId> <points>
    registerCommand({
        name: 'adjustPlayerPoints',
        alias: ['adjustpp'],
        group: 'red',
        argDescription: '<playerId> <points>',
        description: '',
        cb: ({ param1, param2 }, escaper) => {
            const playerId = resolvePlayerId(param1)
            const points = S2I(param2)
            ServiceManager.getService('Multiboard').adjustPlayerPoints(playerId, points)
            Text.P(
                escaper.getPlayer(),
                `Player ${getUdgEscapers().get(playerId)?.getDisplayName()} points adjusted by ${points}`
            )
            return true
        },
    })

    //-setPlayerPoints(setpp) <playerId> <points>
    registerCommand({
        name: 'setPlayerPoints',
        alias: ['setpp'],
        group: 'red',
        argDescription: '<playerId> <points>',
        description: '',
        cb: ({ param1, param2 }, escaper) => {
            const playerId = resolvePlayerId(param1)
            const points = S2I(param2)
            ServiceManager.getService('Multiboard').setPlayerPoints(playerId, points)
            Text.P(
                escaper.getPlayer(),
                `Player ${getUdgEscapers().get(playerId)?.getDisplayName()} points set to ${points}`
            )
            return true
        },
    })

    registerCommand({
        name: 'setGameTheme',
        alias: [],
        group: 'red',
        argDescription: '<theme>',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (IsBoolString(param1) && !S2B(param1)) {
                ThemeUtils.setCurrentTheme(undefined)
                ReinitTerrainsPositions.ReinitTerrainsPosition()
                return true
            }

            if (param1 !== 'fullskill' && param1 !== 'murloc') {
                Text.P(escaper.getPlayer(), 'Invalid theme: ' + ['fullskill', 'murloc'].join(', '))
                return true
            }

            const availableTerrains = NB_MAX_OF_TERRAINS - Globals.udg_nb_used_terrains

            let createTerrains = 0

            const tt = getUdgTerrainTypes()
            const availableThemes = ThemeUtils.availableThemes

            if (!tt.getByCode(availableThemes[param1].slideTerrain)) createTerrains++
            if (!tt.getByCode(availableThemes[param1].deathTerrain)) createTerrains++
            if (!tt.getByCode(availableThemes[param1].walkTerrain)) createTerrains++

            if (createTerrains > availableTerrains) {
                Text.P(escaper.getPlayer(), `Failed, limit of ${NB_MAX_OF_TERRAINS} terrain types reached`)
                return true
            }

            for (const terrainOrder of availableThemes[param1].terrainOrder) {
                if (terrainOrder === 'slide') {
                    if (!tt.getByCode(availableThemes[param1].slideTerrain)) {
                        tt.newSlide(
                            `sgt${param1}s`,
                            TerrainTypeFromString.TerrainTypeString2TerrainTypeId(
                                `'${availableThemes[param1].slideTerrain}'`
                            ),
                            550,
                            true
                        )
                    }
                } else if (terrainOrder === 'death') {
                    if (!tt.getByCode(availableThemes[param1].deathTerrain)) {
                        tt.newDeath(
                            `sgt${param1}d`,
                            TerrainTypeFromString.TerrainTypeString2TerrainTypeId(
                                `'${availableThemes[param1].deathTerrain}'`
                            ),
                            'Abilities\\Spells\\NightElf\\EntanglingRoots\\EntanglingRootsTarget.mdl',
                            0.2,
                            20
                        )
                    }
                } else if (terrainOrder === 'walk') {
                    if (!tt.getByCode(availableThemes[param1].walkTerrain)) {
                        tt.newWalk(
                            `sgt${param1}w`,
                            TerrainTypeFromString.TerrainTypeString2TerrainTypeId(
                                `'${availableThemes[param1].walkTerrain}'`
                            ),
                            522
                        )
                    }
                }
            }

            ThemeUtils.setCurrentTheme(param1)
            ThemeUtils.applyGameTheme()

            const slideTerrain = tt.getByCode(availableThemes[param1].slideTerrain)
            const deathTerrain = tt.getByCode(availableThemes[param1].deathTerrain)
            const walkTerrain = tt.getByCode(availableThemes[param1].walkTerrain)

            if (!slideTerrain || !deathTerrain || !walkTerrain) {
                return true
            }

            for (const [_, terrainType] of pairs(getUdgTerrainTypes().getAll())) {
                for (const terrainOrder of availableThemes[param1].terrainOrder) {
                    if (
                        terrainOrder === 'slide' &&
                        terrainType.kind === 'slide' &&
                        terrainType.terrainTypeId !== slideTerrain.terrainTypeId
                    ) {
                        ThemeUtils.modifyTerrain(
                            terrainType.terrainTypeId,
                            TerrainTypeFromString.TerrainTypeString2TerrainTypeId(
                                `'${availableThemes[param1].slideTerrain}'`
                            )
                        )
                    } else if (
                        terrainOrder === 'death' &&
                        terrainType.kind === 'death' &&
                        terrainType.terrainTypeId !== deathTerrain.terrainTypeId
                    ) {
                        ThemeUtils.modifyTerrain(
                            terrainType.terrainTypeId,
                            TerrainTypeFromString.TerrainTypeString2TerrainTypeId(
                                `'${availableThemes[param1].deathTerrain}'`
                            )
                        )
                    } else if (
                        terrainOrder === 'walk' &&
                        terrainType.kind === 'walk' &&
                        terrainType.terrainTypeId !== walkTerrain.terrainTypeId
                    ) {
                        ThemeUtils.modifyTerrain(
                            terrainType.terrainTypeId,
                            TerrainTypeFromString.TerrainTypeString2TerrainTypeId(
                                `'${availableThemes[param1].walkTerrain}'`
                            )
                        )
                    }
                }
            }

            Text.A(`Welcome to: ${param1} 2.0`)
            return true
        },
    })

    //-overrideCommandAccess(oca) <view|grant|revoke> <cmd> <player|all>
    registerCommand({
        name: 'overrideCommandAccess',
        alias: ['oca'],
        group: 'red',
        argDescription: '<view | grant | revoke> <cmd> <player|all>',
        description: 'override command access',
        cb: ({ param1, param2, param3 }, escaper) => {
            if (param1 !== 'view' && param1 !== 'grant' && param1 !== 'revoke') {
                return true
            }

            const cmd = ServiceManager.getService('Cmd').findTargetCommandSingle(param2, escaper)

            if (!cmd) {
                Text.P(escaper.getPlayer(), 'You need access to this command to be able to override it')
                return true
            }

            switch (param1) {
                case 'view': {
                    const targets = resolvePlayerIdsArray(param3)

                    for (const target of targets) {
                        Text.P(
                            escaper.getPlayer(),
                            `${target.getDisplayName()}: ${cmd.name}: ${
                                target.cmdAccessMap[cmd.name] ? 'Access' : 'No access'
                            }`
                        )
                    }

                    targets.__destroy()
                    break
                }

                case 'grant': {
                    const targets = resolvePlayerIdsArray(param3)

                    for (const target of targets) {
                        target.cmdAccessMap[cmd.name] = true
                        Text.P(escaper.getPlayer(), `${target.getDisplayName()}: ${cmd.name}: access granted`)
                    }

                    targets.__destroy()
                    break
                }

                case 'revoke': {
                    const targets = resolvePlayerIdsArray(param3)

                    for (const target of targets) {
                        delete target.cmdAccessMap[cmd.name]
                        Text.P(escaper.getPlayer(), `${target.getDisplayName()}: ${cmd.name}: access revoked`)
                    }

                    targets.__destroy()
                    break
                }

                default: {
                    Text.P(escaper.getPlayer(), 'Invalid mode')
                    break
                }
            }

            return true
        },
    })

    //-day
    registerCommand({
        name: 'day',
        alias: [],
        group: 'red',
        argDescription: '',
        description: '',
        cb: () => {
            SetFloatGameState(GAME_STATE_TIME_OF_DAY, 12)
            SetTimeOfDayScale(0.0)
            return true
        },
    })

    //-night
    registerCommand({
        name: 'night',
        alias: [],
        group: 'red',
        argDescription: '',
        description: '',
        cb: () => {
            SetFloatGameState(GAME_STATE_TIME_OF_DAY, 0.0)
            SetTimeOfDayScale(0.0)
            return true
        },
    })
}
