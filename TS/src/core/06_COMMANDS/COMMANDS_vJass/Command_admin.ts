import { IsBoolString, IsEscaperInGame, jsonDecode, jsonEncode, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS, NB_PLAYERS_MAX } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { GetMirrorEscaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { ReinitTerrains } from 'core/07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains'
import { ReinitTerrainsPositions } from 'core/07_TRIGGERS/Triggers_to_modify_terrains/Reinit_terrains_position_Change_variations_and_ut_at_beginning'
import { AfkMode } from 'core/08_GAME/Afk_mode/Afk_mode'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { udg_doubleHeroesEnabled } from 'core/Double_heroes/double_heroes_config'
import { ServiceManager } from 'Services'
import {
    getUdgCasterTypes,
    getUdgEscapers,
    getUdgLevels,
    getUdgMonsterTypes,
    getUdgTerrainTypes,
    globals,
} from '../../../../globals'
import { initSaveLoad } from '../../../Utils/SaveLoad/SaveLoad'
import { IsPositiveInteger } from '../../01_libraries/Functions_on_numbers'
import { SaveMapInCache } from '../../07_TRIGGERS/Save_map_in_gamecache/SaveMapInCache'
import { SaveLoadTerrain } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Save_load_terrain'
import { MEC_core_API } from '../../API/MEC_core_API'
import { flushLogs } from '../../Log/log'
import { CmdParam, isPlayerId, resolvePlayerId } from './Command_functions'
import { ActivateTeleport, DisableTeleport } from './Teleport'

export const initExecuteCommandMax = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    //-reinitTerrains(rit)   --> rekinds of terrain
    registerCommand({
        name: 'reinitTerrains',
        alias: ['rit'],
        group: 'max',
        argDescription: '',
        description: 'reinitTerrains(<nb>): reinit terrains with <nb> terrains',
        cb: ({ noParam }) => {
            if (noParam) {
                ReinitTerrains.ReinitTerrains()
            }
            return true
        },
    })

    //-reinitTerrainsPosition(ritp)   --> rethe terrain on the map
    registerCommand({
        name: 'reinitTerrainsPosition',
        alias: ['ritp'],
        group: 'max',
        argDescription: '',
        description: 'rethe terrain on the map',
        cb: ({ noParam }) => {
            if (noParam) {
                ReinitTerrainsPositions.ReinitTerrainsPosition()
            }
            return true
        },
    })

    //-saveTerrain(st) [<slotName>]   --> spaces allowed for slotName
    registerCommand({
        name: 'saveTerrain',
        alias: ['st'],
        group: 'max',
        argDescription: '<slotName>',
        description: 'save terrain in <slotName>',
        cb: ({ cmd, noParam }) => {
            if (noParam) {
                SaveLoadTerrain.SaveTerrain('')
            } else {
                SaveLoadTerrain.SaveTerrain(CmdParam(cmd, 0))
            }
            return true
        },
    })

    //-loadTerrain(lt) [<slotName>]
    registerCommand({
        name: 'loadTerrain',
        alias: ['lt'],
        group: 'max',
        argDescription: '<slotName>',
        description: 'load terrain in <slotName>',
        cb: ({ cmd, noParam }, escaper) => {
            if (noParam) {
                SaveLoadTerrain.LoadTerrain('')
            } else {
                if (!SaveLoadTerrain.LoadTerrain(CmdParam(cmd, 0))) {
                    Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                }
            }
            return true
        },
    })

    //-deleteTerrainSave(delts) [<slotName>]
    registerCommand({
        name: 'deleteTerrainSave',
        alias: ['delts'],
        group: 'max',
        argDescription: '<slotName>',
        description: 'delete terrain save in <slotName>',
        cb: ({ cmd, noParam }, escaper) => {
            if (noParam) {
                return true
            }
            if (SaveLoadTerrain.DeleteTerrainSave(CmdParam(cmd, 0))) {
                Text.mkP(escaper.getPlayer(), 'terrain save deleted')
            } else {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
            }
            return true
        },
    })

    //-control(cl) <Pcolor1>|all(a) [<Pcolor2>]   --> gives the control of a hero to player <Pcolor2>
    registerCommand({
        name: 'control',
        alias: ['cl'],
        group: 'max',
        argDescription: '<Pcolor1>|all(a) [<Pcolor2>]',
        description: 'gives the control of a hero to player <Pcolor2>',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2)) {
                return true
            }

            let escaper2: Escaper | null

            if (nbParam === 2) {
                if (!isPlayerId(param2)) {
                    Text.erP(escaper.getPlayer(), 'param2 should be a player color')
                    return true
                }
                escaper2 = getUdgEscapers().get(resolvePlayerId(param2))
                if (escaper2 === null) {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param2 + " doesn't exist")
                    return true
                }
            } else {
                escaper2 = escaper
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) !== null) {
                        getUdgEscapers().get(i)?.giveHeroControl(escaper2)
                    }
                    i = i + 1
                }
                if (escaper === escaper2) {
                    Text.P(escaper.getPlayer(), 'all heroes are now yours')
                } else {
                    Text.P(escaper.getPlayer(), 'all heroes are now to player ' + param2)
                }
                return true
            }
            if (isPlayerId(param1)) {
                let n = resolvePlayerId(param1)
                if (getUdgEscapers().get(n) !== null) {
                    getUdgEscapers().get(n)?.giveHeroControl(escaper2)
                    GetMirrorEscaper(getUdgEscapers().get(n))?.giveHeroControl(escaper2)
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param1 + " doesn't exist")
                    return true
                }
                if (escaper === escaper2) {
                    Text.P(escaper.getPlayer(), 'hero of player ' + param1 + ' is now yours')
                } else {
                    Text.P(escaper.getPlayer(), 'hero of player ' + param1 + ' is now to player ' + param2)
                }
            }
            return true
        },
    })

    //-resetOwners(ro)   --> gives back the control of heroes to their owner
    registerCommand({
        name: 'resetOwners',
        alias: ['ro'],
        group: 'max',
        argDescription: '',
        description: 'gives back the control of heroes to their owner',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) !== null) {
                        getUdgEscapers().get(i)?.resetOwner()
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'all heroes are now to their owners')
            }
            return true
        },
    })

    //-setlives(setl) <nbLives>
    registerCommand({
        name: 'setlives',
        alias: ['setl'],
        group: 'max',
        argDescription: '<nbLives>',
        description: 'set the number of lives',
        cb: ({ nbParam, param1 }) => {
            if (!(nbParam === 1 && IsPositiveInteger(param1))) {
                return true
            }
            ServiceManager.getService('Lives').setNb(S2I(param1))
            return true
        },
    })

    //-teleport(t) <boolean status>   --> enable or disable teleport trigger
    registerCommand({
        name: 'teleport',
        alias: ['t'],
        group: 'max',
        argDescription: '<boolean status>',
        description: 'enable or disable teleport trigger',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (!IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'param1 should be a boolean or a real')
                return true
            }

            const hero = escaper.getHero()
            if (hero) {
                if (S2B(param1)) {
                    ActivateTeleport(hero, false)
                    Text.P(escaper.getPlayer(), 'teleport on')
                } else {
                    DisableTeleport(hero)
                    Text.P(escaper.getPlayer(), 'teleport off')
                }
            }
            return true
        },
    })

    //-redRights(redr) <boolean status>
    registerCommand({
        name: 'redRights',
        alias: ['redr'],
        group: 'max',
        argDescription: '<boolean status>',
        description: 'enable or disable red rights',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1 && IsBoolString(param1))) {
                return true
            }
            Globals.udg_areRedRightsOn = S2B(param1)
            if (S2B(param1)) {
                Text.P(escaper.getPlayer(), 'red rights on')
            } else {
                Text.P(escaper.getPlayer(), 'red rights off')
            }
            return true
        },
    })

    //-autorevive(ar) [<boolean status> [<Pcolor>|all(a)]]
    registerCommand({
        name: 'autorevive',
        alias: ['ar'],
        group: 'max',
        argDescription: '<boolean status> [<Pcolor>|all(a)]',
        description: 'enable or disable autorevive',
        cb: ({ noParam, nbParam, param1, param2 }, escaper) => {
            if (noParam) {
                escaper.setHasAutorevive(true)
                Text.P(escaper.getPlayer(), 'you have now autorevive to on')
                return true
            }
            if (!IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'param1 should be a boolean')
                return true
            }
            let b = S2B(param1)
            if (nbParam === 1) {
                escaper.setHasAutorevive(b)
                if (b) {
                    Text.P(escaper.getPlayer(), 'you have now autorevive to on')
                } else {
                    Text.P(escaper.getPlayer(), 'you have now autorevive to off')
                }
                return true
            }
            if (!(nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'no more than 2 params allowed for this command')
                return true
            }
            if (param2 === 'all' || param2 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) !== null) {
                        getUdgEscapers().get(i)?.setHasAutorevive(b)
                    }
                    i = i + 1
                }
                if (b) {
                    Text.P(escaper.getPlayer(), 'autorevive to on for all')
                } else {
                    Text.P(escaper.getPlayer(), 'autorevive to off for all')
                }
                return true
            }
            if (isPlayerId(param2)) {
                let n = resolvePlayerId(param2)
                if (getUdgEscapers().get(n) !== null) {
                    getUdgEscapers().get(n)?.setHasAutorevive(b)
                    if (b) {
                        Text.P(escaper.getPlayer(), 'autorevive to on for player ' + param2)
                    } else {
                        Text.P(escaper.getPlayer(), 'autorevive to off for player ' + param2)
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param2 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param2 should be a player color or "all"')
            }
            return true
        },
    })

    //-createHero(crh) [<Pcolor>|all(a)]
    registerCommand({
        name: 'createHero',
        alias: ['crh'],
        group: 'max',
        argDescription: '<Pcolor>|all(a)',
        description: 'create a hero for the player',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                if (!escaper.createHeroAtStart()) {
                    Text.erP(escaper.getPlayer(), 'You already have a hero !')
                }
                return true
            }
            if (!(nbParam === 1)) {
                Text.erP(escaper.getPlayer(), 'no more than one param allowed for this command')
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) == null) {
                        getUdgEscapers().newAt(i)
                        if (udg_doubleHeroesEnabled) {
                            getUdgEscapers().newAt(i + NB_PLAYERS_MAX)
                        }
                    }
                    getUdgEscapers().get(i)?.createHeroAtStart()
                    if (udg_doubleHeroesEnabled) {
                        getUdgEscapers()
                            .get(i + NB_PLAYERS_MAX)
                            ?.createHeroAtStart()
                    }
                    i = i + 1
                }
                return true
            }
            if (isPlayerId(param1)) {
                let n = resolvePlayerId(param1)
                if (getUdgEscapers().get(n) == null) {
                    getUdgEscapers().newAt(n)
                    if (udg_doubleHeroesEnabled) {
                        getUdgEscapers().newAt(n + NB_PLAYERS_MAX)
                    }
                }
                if (!getUdgEscapers().get(n)?.createHeroAtStart()) {
                    Text.erP(escaper.getPlayer(), 'this player already has a hero')
                }
                if (udg_doubleHeroesEnabled) {
                    getUdgEscapers()
                        .get(n + NB_PLAYERS_MAX)
                        ?.createHeroAtStart()
                }
            }
            return true
        },
    })

    //-deleteHero(delh) [<Pcolor>|all(a)]
    registerCommand({
        name: 'deleteHero',
        alias: ['delh'],
        group: 'max',
        argDescription: '<Pcolor>|all(a)',
        description: 'delete a hero for the player',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                escaper.removeHero()
                return true
            }
            if (!(nbParam === 1)) {
                Text.erP(escaper.getPlayer(), 'no more than one param allowed for this command')
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (i < NB_ESCAPERS) {
                    if (
                        getUdgEscapers().get(i) != null &&
                        getUdgEscapers().get(i) != escaper &&
                        !getUdgEscapers().get(i)?.isEscaperSecondary()
                    ) {
                        if (IsEscaperInGame(i)) {
                            getUdgEscapers().get(i)?.removeHero()
                        } else {
                            getUdgEscapers().destroyEscaper(i)
                        }
                    }
                    i = i + 1
                }
                return true
            }
            if (isPlayerId(param1)) {
                let n = resolvePlayerId(param1)
                if (getUdgEscapers().get(n) != null) {
                    if (IsEscaperInGame(n)) {
                        getUdgEscapers().get(n)?.removeHero()
                    } else {
                        getUdgEscapers().destroyEscaper(n)
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param1 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param1 should be a player color or "all"')
            }
            return true
        },
    })

    //-canCheat(cc) <Pcolor>|all(a) [<boolean status>]
    registerCommand({
        name: 'canCheat',
        alias: ['cc'],
        group: 'max',
        argDescription: '<Pcolor>|all(a) [<boolean status>]',
        description: 'set the canCheat status for the player',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'one or two params for this command')
                return true
            }

            let b = false

            if (nbParam === 2) {
                if (IsBoolString(param2)) {
                    b = S2B(param2)
                } else {
                    Text.erP(escaper.getPlayer(), 'param2 must be a boolean')
                    return true
                }
            } else {
                b = true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (getUdgEscapers().get(i) != null && getUdgEscapers().get(i) != escaper) {
                        if (!getUdgEscapers().get(i)?.isMaximaxou()) {
                            getUdgEscapers().get(i)?.setCanCheat(b)
                        }
                    }
                    i = i + 1
                }
                if (b) {
                    Text.P(escaper.getPlayer(), 'all players can now cheat and make')
                } else {
                    Text.P(escaper.getPlayer(), "all players who haven't Maximaxou rights can't cheat or make anymore")
                }
                return true
            }
            if (isPlayerId(param1)) {
                let n = resolvePlayerId(param1)
                if (getUdgEscapers().get(n) != null) {
                    if (getUdgEscapers().get(n) != escaper) {
                        if (!getUdgEscapers().get(n)?.isMaximaxou()) {
                            getUdgEscapers().get(n)?.setCanCheat(b)
                            if (b) {
                                Text.P(escaper.getPlayer(), 'player ' + param1 + ' can now cheat and make')
                            } else {
                                Text.P(escaper.getPlayer(), 'player ' + param1 + ' no longer can cheat and make')
                            }
                        } else {
                            Text.erP(
                                escaper.getPlayer(),
                                "you can't change rights of player " + param1 + ', he has Maximaxou rights like you'
                            )
                        }
                    } else {
                        Text.erP(escaper.getPlayer(), "you can't change your own rights")
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param1 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param1 must be a player color or "all"')
            }
            return true
        },
    })

    //-setAfkTime(setafkt) <time>
    registerCommand({
        name: 'setAfkTime',
        alias: ['setafkt'],
        group: 'max',
        argDescription: '<time>',
        description: 'set the afk time for a player',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1 || S2I(param1) <= 0) {
                Text.erP(escaper.getPlayer(), 'there must be one param which is an integer higher than 0')
                return true
            }
            AfkMode.timeMinAfk = S2R(param1)
            Text.P(escaper.getPlayer(), 'afk time to ' + param1)
            return true
        },
    })

    //-setAutoreviveDelay(setard) <time>   --> maximum 15 seconds
    registerCommand({
        name: 'setAutoreviveDelay',
        alias: ['setard'],
        group: 'max',
        argDescription: '<time>',
        description: 'set the autorevive delay, maximum 15 seconds',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1 && (S2R(param1) > 0 || param1 === '0') && S2R(param1) <= 15)) {
                Text.erP(escaper.getPlayer(), 'there must be one param positive real (maximum 15)')
                return true
            }
            let x = S2R(param1)
            globals.autoreviveDelay = x
            if (x > 1) {
                Text.P(escaper.getPlayer(), 'autorevive delay to ' + R2S(x) + ' seconds')
            } else {
                Text.P(escaper.getPlayer(), 'autorevive delay to ' + R2S(x) + ' second')
            }
            return true
        },
    })

    //-saveMapInCache(smic)
    registerCommand({
        name: 'saveMapInCache',
        alias: ['smic'],
        group: 'max',
        argDescription: '',
        description: 'save the map in cache',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                SaveMapInCache.smic(escaper.getPlayer())
            }
            return true
        },
    })

    //-loadMapFromCache(lmfc)
    registerCommand({
        name: 'loadMapFromCache',
        alias: ['lmfc'],
        group: 'max',
        argDescription: '',
        description: 'load the map from cache',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                if (SaveMapInCache.lastSaveFile === '') {
                    Text.mkP(escaper.getPlayer(), 'Failed to load, use -smic first')
                    return true
                }

                const SaveLoad = initSaveLoad()

                Text.A('Loading')
                SaveLoad.readFile(SaveMapInCache.lastSaveFile, GetTriggerPlayer(), data => {
                    Text.A('Loaded')

                    const gameData = (jsonDecode(data) as any).gameData

                    MEC_core_API.setGameData(jsonEncode(gameData))
                    Text.A('Done')
                })
            }
            return true
        },
    })

    //-removeTerrain(remt) <terrainLabel>
    registerCommand({
        name: 'removeTerrain',
        alias: ['remt'],
        group: 'max',
        argDescription: '<terrainLabel>',
        description: 'remove a terrain from the map',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (getUdgTerrainTypes().remove(param1)) {
                Text.mkP(escaper.getPlayer(), 'Terrain removed')
            } else {
                Text.erP(escaper.getPlayer(), 'Unknown terrain')
            }
            return true
        },
    })

    //-removeMonster(remm) <monsterLabel>
    registerCommand({
        name: 'removeMonster',
        alias: ['remm'],
        group: 'max',
        argDescription: '<monsterLabel>',
        description: 'remove a monster from the map',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (getUdgMonsterTypes().remove(param1)) {
                Text.mkP(escaper.getPlayer(), 'monster type removed')
            } else {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
            }
            return true
        },
    })

    //-removeLastLevel(remll)
    registerCommand({
        name: 'removeLastLevel',
        alias: ['remll'],
        group: 'max',
        argDescription: '',
        description: 'remove the last level from the map',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                if (getUdgLevels().destroyLastLevel()) {
                    Text.mkP(
                        escaper.getPlayer(),
                        'level number ' + I2S(getUdgLevels().getLastLevelId() + 1) + ' destroyed'
                    )
                } else {
                    Text.erP(escaper.getPlayer(), 'impossible to destroy the first level')
                }
            }
            return true
        },
    })

    //-removeCaster(remc) <casterLabel>
    registerCommand({
        name: 'removeCaster',
        alias: ['remc'],
        group: 'max',
        argDescription: '<casterLabel>',
        description: 'remove a caster from the map',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            //checkParam 1
            if (!getUdgCasterTypes().isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
                return true
            }
            //apply command
            getUdgCasterTypes().remove(param1)
            Text.mkP(escaper.getPlayer(), 'caster type removed')
            return true
        },
    })

    //-setTerrainsOrder(setto) <terrainLabels>
    registerCommand({
        name: 'setTerrainsOrder',
        alias: ['setto'],
        group: 'max',
        argDescription: '<terrainLabels>',
        description: 'set the order of the terrains',
        cb: ({ cmd }, escaper) => {
            if (getUdgTerrainTypes().setOrder(cmd)) {
                Text.mkP(escaper.getPlayer(), 'terrains order set')
            } else {
                Text.erP(
                    escaper.getPlayer(),
                    "couldn't terrains order. Usage : put all the terrain types as parameters, once each"
                )
            }
            return true
        },
    })

    //-setTerrainCliffClass(settcc) <terrainLabel> <cliffClass>
    registerCommand({
        name: 'setTerrainCliffClass',
        alias: ['settcc'],
        group: 'max',
        argDescription: '<terrainLabel> <cliffClass>',
        description: 'set the cliff class of a terrain',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return true
            }
            //checkParam 1
            let b = getUdgTerrainTypes().getByLabel(param1) != null
            if (!b) {
                return true
            }
            //checkParam 2
            if (param2 !== '1' && param2 !== '2') {
                Text.erP(escaper.getPlayer(), 'cliff class must be 1 or 2')
            }
            //apply command
            getUdgTerrainTypes().getByLabel(param1)?.setCliffClassId(S2I(param2))
            Text.mkP(escaper.getPlayer(), 'cliff class changed to ' + param2)
            return true
        },
    })

    //-setMainTile<tileset>
    registerCommand({
        name: 'setMainTileset',
        alias: [],
        group: 'max',
        argDescription: '<tileset>',
        description: 'set the main tileset',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam > 1) {
                return true
            }
            if (getUdgTerrainTypes().setMainTileset(param1)) {
                Text.mkP(escaper.getPlayer(), 'main tilechanged')
            } else {
                Text.P(
                    escaper.getPlayer(),
                    'available tilesets : ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'auto|r ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'A|r = Ashenvale ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'B|r = Barrens ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'C|r = Felwood ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'D|r = Dungeon ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'F|r = Lordaeron Fall ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'G|r = Underground ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'L|r = Lordaeron Summer ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'N|r = Northrend ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'Q|r = Village Fall ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'V|r = Village ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'W|r = Lordaeron Winter ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'X|r = Dalaran ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'Y|r = Cityscape ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'Z|r = Sunken Ruins ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'I|r = Icecrown ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'J|r = Dalaran Ruins ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'O|r = Outland ; ' +
                        Text.MAKE_TEXT_COLORCODE +
                        'K|r = Black Citadel'
                )
            }
            return true
        },
    })

    //-logs
    registerCommand({
        name: 'logs',
        alias: [],
        group: 'max',
        argDescription: '',
        description: '',
        cb: ({ noParam }) => {
            if (noParam) {
                flushLogs()
            }

            return true
        },
    })

    //-clickWhereYouAre
    registerCommand({
        name: 'clickWhereYouAre',
        alias: ['cwya'],
        group: 'max',
        argDescription: '',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'one or two params for this command')
                return true
            }

            let b = false

            if (nbParam === 2) {
                if (IsBoolString(param2)) {
                    b = S2B(param2)
                } else {
                    Text.erP(escaper.getPlayer(), 'param2 must be a boolean')
                    return true
                }
            } else {
                b = true
            }
            if (param1 === 'all' || param1 === 'a') {
                let i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    getUdgEscapers().get(i)?.enableClickWhereYouAre(b)
                    i = i + 1
                }
                if (b) {
                    Text.P(escaper.getPlayer(), 'all players now turn')
                } else {
                    Text.P(escaper.getPlayer(), 'all players stop turn')
                }
                return true
            }
            if (isPlayerId(param1)) {
                let n = resolvePlayerId(param1)
                if (getUdgEscapers().get(n) != null) {
                    getUdgEscapers().get(n)?.enableClickWhereYouAre(b)
                    if (b) {
                        Text.P(escaper.getPlayer(), 'player ' + param1 + ' now turn')
                    } else {
                        Text.P(escaper.getPlayer(), 'player ' + param1 + ' no longer turn')
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param1 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param1 must be a player color or "all"')
            }
            return true
        },
    })
}
