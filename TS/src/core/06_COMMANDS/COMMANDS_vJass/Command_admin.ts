import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { FunctionsOnNumbers } from 'core/01_libraries/Functions_on_numbers'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { SaveLoadTerrainWithoutName } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Save_load_terrain_without_name'
import { CommandsFunctions } from './Command_functions'

const initCommandMax = () => {
    const ExecuteCommandMax = (escaper: Escaper, cmd: string): boolean => {
        let name = CommandsFunctions.CmdName(cmd)
        let noParam = CommandsFunctions.NoParam(cmd)
        let nbParam = CommandsFunctions.NbParam(cmd)

        let n: number
        let i: number
        let j: number
        let k: number

        let b: boolean

        let str = ''
        let str2 = ''

        let x: number
        let y: number
        let point: location

        let param: string

        let param1 = CommandsFunctions.CmdParam(cmd, 1)
        let param2 = CommandsFunctions.CmdParam(cmd, 2)
        let param3 = CommandsFunctions.CmdParam(cmd, 3)
        let param4 = CommandsFunctions.CmdParam(cmd, 4)

        let speed: number

        let escaper2: Escaper

        //-reinitTerrains(rit)   --> rekinds of terrain
        if (name === 'reinitTerrains' || name === 'rit') {
            if (noParam) {
                ReinitTerrains()
            }
            return true
        }

        //-reinitTerrainsPosition(ritp)   --> rethe terrain on the map
        if (name === 'reinitTerrainsPosition' || name === 'ritp') {
            if (noParam) {
                ReinitTerrainsPosition()
            }
            return true
        }

        //-saveTerrain(st) [<slotName>]   --> spaces allowed for slotName
        if (name === 'saveTerrain' || name === 'st') {
            if (noParam) {
                SaveLoadTerrainWithoutName.SaveTerrainWithoutName()
            } else {
                SaveTerrainWithName(CommandsFunctions.CmdParam(cmd, 0))
            }
            return true
        }

        //-loadTerrain(lt) [<slotName>]
        if (name === 'loadTerrain' || name === 'lt') {
            if (noParam) {
                SaveLoadTerrainWithoutName.LoadTerrainWithoutName()
            } else {
                if (!LoadTerrainWithName(CommandsFunctions.CmdParam(cmd, 0))) {
                    Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
                }
            }
            return true
        }

        //-deleteTerrainSave(delts) [<slotName>]
        if (name === 'deleteTerrainSave' || name === 'delts') {
            if (noParam) {
                return true
            }
            if (DeleteTerrainSaveWithName(CommandsFunctions.CmdParam(cmd, 0))) {
                Text.mkP(escaper.getPlayer(), 'terrain save deleted')
            } else {
                Text.erP(escaper.getPlayer(), "this terrain save doesn't exist")
            }
            return true
        }

        //-control(cl) <Pcolor1>|all(a) [<Pcolor2>]   --> gives the control of a hero to player <Pcolor2>
        if (name === 'control' || name === 'cl') {
            if (!(nbParam === 1 || nbParam === 2)) {
                return true
            }
            if (nbParam === 2) {
                if (!CommandsFunctions.IsPlayerColorString(param2)) {
                    Text.erP(escaper.getPlayer(), 'param2 should be a player color')
                    return true
                }
                escaper2 = udg_escapers.get(ColorCodes.ColorString2Id(param2))
                if (escaper2 === 0) {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param2 + " doesn't exist")
                    return true
                }
            } else {
                escaper2 = escaper
            }
            if (param1 === 'all' || param1 === 'a') {
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) != 0) {
                        udg_escapers.get(i).giveHeroControl(escaper2)
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
            if (CommandsFunctions.IsPlayerColorString(param1)) {
                n = ColorCodes.ColorString2Id(param1)
                if (udg_escapers.get(n) != 0) {
                    udg_escapers.get(n).giveHeroControl(escaper2)
                    EscaperFunctions.GetMirrorEscaper(udg_escapers.get(n)).giveHeroControl(escaper2)
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
        }

        //-resetOwners(ro)   --> gives back the control of heroes to their owner
        if (name === 'resetOwners' || name === 'ro') {
            if (noParam) {
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) != 0) {
                        udg_escapers.get(i).resetOwner()
                    }
                    i = i + 1
                }
                Text.P(escaper.getPlayer(), 'all heroes are now to their owners')
            }
            return true
        }

        //-setlives(setl) <nbLives>
        if (name === 'setlives' || name === 'setl') {
            if (!(nbParam === 1 && FunctionsOnNumbers.IsPositiveInteger(param1))) {
                return true
            }
            udg_lives.setNb(S2I(param1))
            return true
        }

        //-teleport(t) <boolean status>   --> enable or disable teleport trigger
        if (name === 'teleport' || name === 't') {
            if (!(nbParam === 1)) {
                return true
            }
            if (!BasicFunctions.IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'param1 should be a boolean or a real')
                return true
            }
            if (BasicFunctions.S2B(param1)) {
                EnableTrigger(gg_trg_Teleport)
                Text.P(escaper.getPlayer(), 'teleport on')
            } else {
                DisableTrigger(gg_trg_Teleport)
                Text.P(escaper.getPlayer(), 'teleport off')
            }
            return true
        }

        //-redRights(redr) <boolean status>
        if (name === 'redRights' || name === 'redr') {
            if (!(nbParam === 1 && BasicFunctions.IsBoolString(param1))) {
                return true
            }
            Globals.udg_areRedRightsOn = BasicFunctions.S2B(param1)
            if (BasicFunctions.S2B(param1)) {
                Text.P(escaper.getPlayer(), 'red rights on')
            } else {
                Text.P(escaper.getPlayer(), 'red rights off')
            }
            return true
        }

        //-autorevive(ar) [<boolean status> [<Pcolor>|all(a)]]
        if (name === 'autorevive' || name === 'ar') {
            if (noParam) {
                escaper.setHasAutorevive(true)
                Text.P(escaper.getPlayer(), 'you have now autorevive to on')
                return true
            }
            if (!BasicFunctions.IsBoolString(param1)) {
                Text.erP(escaper.getPlayer(), 'param1 should be a boolean')
                return true
            }
            b = BasicFunctions.S2B(param1)
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
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) != 0) {
                        udg_escapers.get(i).setHasAutorevive(b)
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
            if (CommandsFunctions.IsPlayerColorString(param2)) {
                n = ColorCodes.ColorString2Id(param2)
                if (udg_escapers.get(n) != 0) {
                    udg_escapers.get(n).setHasAutorevive(b)
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
        }

        //-createHero(crh) [<Pcolor>|all(a)]
        if (name === 'createHero' || name === 'crh') {
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
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) == 0) {
                        udg_escapers.newAt(i)
                        if (udg_doubleHeroesEnabled) {
                            udg_escapers.newAt(i + NB_PLAYERS_MAX)
                        }
                    }
                    udg_escapers.get(i).createHeroAtStart()
                    if (udg_doubleHeroesEnabled) {
                        udg_escapers.get(i + NB_PLAYERS_MAX).createHeroAtStart()
                    }
                    i = i + 1
                }
                return true
            }
            if (CommandsFunctions.IsPlayerColorString(param1)) {
                n = ColorCodes.ColorString2Id(param1)
                if (udg_escapers.get(n) == 0) {
                    udg_escapers.newAt(n)
                    if (udg_doubleHeroesEnabled) {
                        udg_escapers.newAt(n + NB_PLAYERS_MAX)
                    }
                }
                if (!udg_escapers.get(n).createHeroAtStart()) {
                    Text.erP(escaper.getPlayer(), 'this player already has a hero')
                }
                if (udg_doubleHeroesEnabled) {
                    udg_escapers.get(n + NB_PLAYERS_MAX).createHeroAtStart()
                }
            }
            return true
        }

        //-deleteHero(delh) [<Pcolor>|all(a)]
        if (name === 'deleteHero' || name === 'delh') {
            if (noParam) {
                escaper.removeHero()
                return true
            }
            if (!(nbParam === 1)) {
                Text.erP(escaper.getPlayer(), 'no more than one param allowed for this command')
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) != 0 && udg_escapers.get(i) != escaper) {
                        if (BasicFunctions.IsEscaperInGame(i)) {
                            udg_escapers.get(i).removeHero()
                        } else {
                            udg_escapers.remove(i)
                        }
                    }
                    i = i + 1
                }
                return true
            }
            if (CommandsFunctions.IsPlayerColorString(param1)) {
                n = ColorCodes.ColorString2Id(param1)
                if (udg_escapers.get(n) != 0) {
                    if (BasicFunctions.IsEscaperInGame(n)) {
                        udg_escapers.get(n).removeHero()
                    } else {
                        udg_escapers.remove(n)
                    }
                } else {
                    Text.erP(escaper.getPlayer(), 'escaper ' + param1 + " doesn't exist")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'param1 should be a player color or "all"')
            }
            return true
        }

        //-canCheat(cc) <Pcolor>|all(a) [<boolean status>]
        if (name === 'canCheat' || name === 'cc') {
            if (!(nbParam === 1 || nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'one or two params for this command')
                return true
            }
            if (nbParam === 2) {
                if (BasicFunctions.IsBoolString(param2)) {
                    b = BasicFunctions.S2B(param2)
                } else {
                    Text.erP(escaper.getPlayer(), 'param2 must be a boolean')
                    return true
                }
            } else {
                b = true
            }
            if (param1 === 'all' || param1 === 'a') {
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) != 0 && udg_escapers.get(i) != escaper) {
                        if (!udg_escapers.get(i).isMaximaxou()) {
                            udg_escapers.get(i).setCanCheat(b)
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
            if (CommandsFunctions.IsPlayerColorString(param1)) {
                n = ColorCodes.ColorString2Id(param1)
                if (udg_escapers.get(n) != 0) {
                    if (udg_escapers.get(n) != escaper) {
                        if (!udg_escapers.get(n).isMaximaxou()) {
                            udg_escapers.get(n).setCanCheat(b)
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
        }

        //-setAfkTime(setafkt) <time>
        if (name === 'setAfkTime' || name === 'setafkt') {
            if (nbParam !== 1 || S2I(param1) <= 0) {
                Text.erP(escaper.getPlayer(), 'there must be one param which is an integer higher than 0')
                return true
            }
            timeMinAfk = S2R(param1)
            Text.P(escaper.getPlayer(), 'afk time to ' + param1)
            return true
        }

        //-setAutoreviveDelay(setard) <time>   --> maximum 15 seconds
        if (name === 'setAutoreviveDelay' || name === 'setard') {
            if (!(nbParam === 1 && (S2R(param1) > 0 || param1 === '0') && S2R(param1) <= 15)) {
                Text.erP(escaper.getPlayer(), 'there must be one param positive real (maximum 15)')
                return true
            }
            x = S2R(param1)
            udg_autoreviveDelay = x
            if (x > 1) {
                Text.P(escaper.getPlayer(), 'autorevive delay to ' + R2S(x) + ' seconds')
            } else {
                Text.P(escaper.getPlayer(), 'autorevive delay to ' + R2S(x) + ' second')
            }
            return true
        }

        //-saveMapInCache(smic)
        if (name === 'saveMapInCache' || name === 'smic') {
            if (noParam) {
                StartSaveMapInCache()
            }
            return true
        }

        //-removeTerrain(remt) <terrainLabel>
        if (name === 'removeTerrain' || name === 'remt') {
            if (!(nbParam === 1)) {
                return true
            }
            if (udg_terrainTypes.remove(param1)) {
                Text.mkP(escaper.getPlayer(), 'terrain removed')
            } else {
                Text.erP(escaper.getPlayer(), 'unknown terrain')
            }
            return true
        }

        //-removeMonster(remm) <monsterLabel>
        if (name === 'removeMonster' || name === 'remm') {
            if (!(nbParam === 1)) {
                return true
            }
            if (udg_monsterTypes.remove(param1)) {
                Text.mkP(escaper.getPlayer(), 'monster type removed')
            } else {
                Text.erP(escaper.getPlayer(), 'unknown monster type')
            }
            return true
        }

        //-removeLastLevel(remll)
        if (name === 'removeLastLevel' || name === 'remll') {
            if (noParam) {
                if (udg_levels.destroyLastLevel()) {
                    Text.mkP(escaper.getPlayer(), 'level number ' + I2S(udg_levels.getLastLevelId() + 1) + ' destroyed')
                } else {
                    Text.erP(escaper.getPlayer(), 'impossible to destroy the first level')
                }
            }
            return true
        }

        //-removeCaster(remc) <casterLabel>
        if (name === 'removeCaster' || name === 'remc') {
            if (nbParam !== 1) {
                return true
            }
            //checkParam 1
            if (!udg_casterTypes.isLabelAlreadyUsed(param1)) {
                Text.erP(escaper.getPlayer(), 'unknown caster type "' + param1 + '"')
                return true
            }
            //apply command
            udg_casterTypes.remove(param1)
            Text.mkP(escaper.getPlayer(), 'caster type removed')
            return true
        }

        //-setTerrainsOrder(setto) <terrainLabels>
        if (name === 'setTerrainsOrder' || name === 'setto') {
            if (udg_terrainTypes.setOrder(cmd)) {
                Text.mkP(escaper.getPlayer(), 'terrains order set')
            } else {
                Text.erP(
                    escaper.getPlayer(),
                    "couldn't terrains order. Usage : put all the terrain types as parameters, once each"
                )
            }
            return true
        }

        //-setTerrainCliffClass(settcc) <terrainLabel> <cliffClass>
        if (name === 'setTerrainCliffClass' || name === 'settcc') {
            if (nbParam !== 2) {
                return true
            }
            //checkParam 1
            b = udg_terrainTypes.get(param1) != 0
            if (!b) {
                return true
            }
            //checkParam 2
            if (param2 !== '1' && param2 !== '2') {
                Text.erP(escaper.getPlayer(), 'cliff class must be 1 or 2')
            }
            //apply command
            udg_terrainTypes.get(param1).setCliffClassId(S2I(param2))
            Text.mkP(escaper.getPlayer(), 'cliff class changed to ' + param2)
            return true
        }

        //-setMainTile<tileset>
        if (name === 'setMainTileset') {
            if (nbParam > 1) {
                return true
            }
            if (udg_terrainTypes.setMainTileset(param1)) {
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
        }

        return false
    }

    return { ExecuteCommandMax }
}

export const CommandMax = initCommandMax()
