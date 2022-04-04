import {ClearTextForPlayer, IsBoolString, S2B} from 'core/01_libraries/Basic_functions'
import {
    BLUE,
    DEFAULT_CAMERA_FIELD,
    GREEN,
    GREY,
    LIMIT_NB_HERO_EFFECTS,
    NB_MAX_TERRAIN_DATA_DISPLAY,
    NB_PLAYERS_MAX,
    RED,
    TEAL,
    TERRAIN_DATA_DISPLAY_TIME,
} from 'core/01_libraries/Constants'
import {ColorString2Id, udg_colorCode} from 'core/01_libraries/Init_colorCodes'
import {Text} from 'core/01_libraries/Text'
import {Escaper} from 'core/04_STRUCTURES/Escaper/Escaper'
import {ColorInfo, GetMirrorEscaper} from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import {DisplayTerrainDataToPlayer, GetTerrainData} from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import {Apm} from 'core/08_GAME/Apm_clics_par_minute/Apm'
 import { getUdgEscapers } from '../../../../globals'

import {udg_lives} from 'core/08_GAME/Init_structures/Init_lives'
import { getUdgLevels } from "../../../../globals"

import {Globals} from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import {EscaperEffectFunctions} from '../../04_STRUCTURES/Escaper/EscaperEffect_functions'
import {Disco} from '../../04_STRUCTURES/Escaper/Escaper_disco'
import {TerrainTypeFromString} from '../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_from_string'
import {TerrainTypeNamesAndData} from '../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data'
import {AutoContinueAfterSliding} from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Auto_continue_after_sliding'
import {TurnOnSlide} from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import {CmdName, CmdParam, IsColorString, IsPlayerColorString, NbParam, NoParam} from "./Command_functions";
import {IsInteger, PercentageStringOrX2Integer} from "../../01_libraries/Functions_on_numbers";
import {CommandShortcuts} from "../../08_GAME/Shortcuts/Using_shortcut";
import {execute, newCmd} from "../../04_STRUCTURES/Escaper/EscaperSavedCommands";


export const ExecuteCommandAll = (escaper: Escaper, cmd: string): boolean => {
    let name = CmdName(cmd)
    let noParam = NoParam(cmd)
    let nbParam = NbParam(cmd)

    let n: number
    let i: number
    let j: number
    let k: number

    let b: boolean

    let str: string | null = ''
    let str2 = ''

    let x: number
    let y: number
    let point: location

    let param: string

    let param1 = CmdParam(cmd, 1)
    let param2 = CmdParam(cmd, 2)
    let param3 = CmdParam(cmd, 3)
    let param4 = CmdParam(cmd, 4)

    //-<color>   --> change the base color of the hero
    if (IsColorString(name)) {
        if (noParam) {
            escaper.setBaseColor(ColorString2Id(name))
            return true
        }
        if (nbParam == 1 && escaper.isTrueMaximaxou() && IsPlayerColorString(param1)) {
            getUdgEscapers().get(ColorString2Id(param1))?.setBaseColor(ColorString2Id(name))
        }
        return true
    }

    //-vertexColor(vc) [ <red> <green> <blue> [<transparency>] ]   --> without parameter takes a random vertex color without changing transparency
    if (name === 'vertexColor' || name === 'vc') {
        if (noParam || nbParam === 1) {
            if (nbParam === 1) {
                if (!(IsPlayerColorString(param1) && escaper.isTrueMaximaxou())) {
                    return true
                }
                escaper = getUdgEscapers().get(ColorString2Id(param1))
            }
            escaper.setVcRed(GetRandomPercentageBJ())
            escaper.setVcGreen(GetRandomPercentageBJ())
            escaper.setVcBlue(GetRandomPercentageBJ())
        } else {
            if (!(nbParam === 3 || nbParam === 4)) {
                return true
            }
            if (!escaper.setVcRed(I2R(PercentageStringOrX2Integer(param1)))) {
                Text.P(escaper.getPlayer(), udg_colorCode[RED] + 'Red : not a correct percentage (' + param1 + ')')
            }
            if (!escaper.setVcGreen(I2R(PercentageStringOrX2Integer(param2)))) {
                Text.P(
                    escaper.getPlayer(),
                    udg_colorCode[GREEN] + 'Green : not a correct percentage (' + param2 + ')'
                )
            }
            if (!escaper.setVcBlue(I2R(PercentageStringOrX2Integer(param3)))) {
                Text.P(
                    escaper.getPlayer(),
                    udg_colorCode[BLUE] + 'Blue : not a correct percentage (' + param3 + ')'
                )
            }
            if (nbParam === 4) {
                if (!escaper.setVcTransparency(I2R(PercentageStringOrX2Integer(param4)))) {
                    Text.P(
                        escaper.getPlayer(),
                        udg_colorCode[GREY] + 'Transparency : not a correct percentage (' + param4 + ')'
                    )
                }
            }
        }
        escaper.refreshVertexColor()
        return true
    }

    //-vertexColorRed(vcr) [<red>]   --> changes the red part of the vertex color only
    if (name === 'vertexColorRed' || name === 'vcr') {
        if (noParam) {
            escaper.setVcRed(GetRandomPercentageBJ())
            escaper.refreshVertexColor()
            return true
        }
        if (!(nbParam === 1)) {
            return true
        }
        if (!escaper.setVcRed(I2R(PercentageStringOrX2Integer(param1)))) {
            Text.P(escaper.getPlayer(), udg_colorCode[RED] + 'Red : not a correct percentage (' + param1 + ')')
            return true
        }
        escaper.refreshVertexColor()
        return true
    }

    //-vertexColorGreen(vcg) [<Green>]   --> changes the green part of the vertex color only
    if (name === 'vertexColorGreen' || name === 'vcg') {
        if (noParam) {
            escaper.setVcGreen(GetRandomPercentageBJ())
            escaper.refreshVertexColor()
            return true
        }
        if (!(nbParam === 1)) {
            return true
        }
        if (!escaper.setVcGreen(I2R(PercentageStringOrX2Integer(param1)))) {
            Text.P(escaper.getPlayer(), udg_colorCode[GREEN] + 'Green : not a correct percentage (' + param1 + ')')
            return true
        }
        escaper.refreshVertexColor()
        return true
    }

    //-vertexColorBlue(vcb) [<Blue>]   --> changes the blue part of the vertex color only
    if (name === 'vertexColorBlue' || name === 'vcb') {
        if (noParam) {
            escaper.setVcBlue(GetRandomPercentageBJ())
            escaper.refreshVertexColor()
            return true
        }
        if (!(nbParam === 1)) {
            return true
        }
        if (!escaper.setVcBlue(I2R(PercentageStringOrX2Integer(param1)))) {
            Text.P(escaper.getPlayer(), udg_colorCode[BLUE] + 'Blue : not a correct percentage (' + param1 + ')')
            return true
        }
        escaper.refreshVertexColor()
        return true
    }

    //-vertexColorTransparency(vct) [<transparency>]   --> changes the transparency of the hero
    if (name === 'vertexColorTransparency' || name === 'vct') {
        if (noParam) {
            escaper.setVcTransparency(GetRandomPercentageBJ())
            escaper.refreshVertexColor()
            return true
        }
        if (!(nbParam === 1)) {
            return true
        }
        if (!escaper.setVcTransparency(I2R(PercentageStringOrX2Integer(param1)))) {
            Text.P(
                escaper.getPlayer(),
                udg_colorCode[GREY] + 'Transparency : not a correct percentage (' + param1 + ')'
            )
            return true
        }
        escaper.refreshVertexColor()
        return true
    }

    //-noVertex(nv)   --> put normal vertex color : RGB(100, 100, 100) with 0 transparency
    if (name === 'noVertex' || name === 'nv') {
        if (!(noParam || nbParam === 1)) {
            return true
        }
        if (nbParam === 1) {
            if (!(escaper.isTrueMaximaxou() && IsPlayerColorString(param1))) {
                return true
            }
            escaper = getUdgEscapers().get(ColorString2Id(param1))
        }
        escaper.setVcRed(100)
        escaper.setVcGreen(100)
        escaper.setVcBlue(100)
        escaper.setVcTransparency(0)
        escaper.refreshVertexColor()
        return true
    }

    //-colorInfo(ci) [<Pcolor>]   --> displays base color and vertex color of a hero
    if (name === 'colorInfo' || name === 'ci') {
        if (noParam) {
            ColorInfo(escaper, escaper.getPlayer())
            return true
        }
        if (nbParam === 1 && IsPlayerColorString(param1)) {
            ColorInfo(getUdgEscapers().get(ColorString2Id(param1)), escaper.getPlayer())
            return true
        }
        return true
    }

    //-effect(ef) <effect>   --> adds an effect on each hand of the hero
    if (name === 'effect' || name === 'ef') {
        if (!EscaperEffectFunctions.IsEffectStr(param1)) {
            return true
        }
        if (nbParam == 2 && escaper.isTrueMaximaxou() && IsPlayerColorString(param2)) {
            escaper = getUdgEscapers().get(ColorString2Id(param2))
        } else {
            if (nbParam !== 1) {
                return true
            }
        }
        str = EscaperEffectFunctions.String2EffectStr(param1)

        if (str) {
            escaper.newEffect(str, 'hand right')
            escaper.newEffect(str, 'hand left')
        }

        return true
    }

    //-customEffect(ce) <effect> <body_part>   --> adds an effect on a body part of the hero
    if (name === 'customEffect' || name === 'ce') {
        if (nbParam !== 2) {
            return true
        }
        if (!(EscaperEffectFunctions.IsEffectStr(param1) && EscaperEffectFunctions.IsBodyPartStr(param2))) {
            return true
        }
        str = EscaperEffectFunctions.String2EffectStr(param1)

        if (str) {
            const str3 = EscaperEffectFunctions.String2BodyPartStr(param2)

            if (str3) {
                escaper.newEffect(str, str3)
            }
        }

        return true
    }

    //-effectsEverywhere(efe) <effect>   --> adds the same effect to each body part of the hero
    if (name === 'effectsEverywhere' || name === 'efe') {
        if (!EscaperEffectFunctions.IsEffectStr(param1)) {
            return true
        }
        if (nbParam == 2 && escaper.isTrueMaximaxou() && IsPlayerColorString(param2)) {
            escaper = getUdgEscapers().get(ColorString2Id(param2))
        } else {
            if (nbParam !== 1) {
                return true
            }
        }
        str = EscaperEffectFunctions.String2EffectStr(param1)

        if (str) {
            escaper.newEffect(str, 'hand right')
            escaper.newEffect(str, 'hand left')
            escaper.newEffect(str, 'foot left')
            escaper.newEffect(str, 'foot right')
            escaper.newEffect(str, 'head')
            escaper.newEffect(str, 'chest')
        }

        return true
    }

    //-deleteEffects(de) [<numberOfEffectsToRemove>]   --> delete a specified effect of the hero or all effects if not specified
    if (name === 'deleteEffects' || name === 'de') {
        if (!(noParam || nbParam === 1)) {
            return true
        }
        if (nbParam === 1) {
            if (IsPlayerColorString(param1)) {
                if (!escaper.isTrueMaximaxou()) {
                    return true
                }
                escaper = getUdgEscapers().get(ColorString2Id(param1))
                n = LIMIT_NB_HERO_EFFECTS
            } else {
                n = S2I(param1)
                if (n < 1 || n > LIMIT_NB_HERO_EFFECTS) {
                    return true
                }
            }
        } else {
            n = LIMIT_NB_HERO_EFFECTS
        }
        escaper.destroyLastEffects(n)
        return true
    }

    //-cameraField(cf) x   --> changes the camera field (height), default is 2500
    if (name === 'cameraField' || name === 'cf') {
        if (!(nbParam === 1 && IsInteger(param1))) {
            return true
        }
        escaper.setCameraField(S2I(param1))
        return true
    }

    //-resetCamera(rc)   --> put the camera back like chosen field
    if (name === 'resetCamera' || name === 'rc') {
        if (!noParam) {
            return true
        }
        escaper.resetCamera()
        return true
    }

    //-resetCameraInit(rci)   --> changes the camera field back to its default value (2500)
    if (name === 'resetCameraInit' || name === 'rci') {
        if (!noParam) {
            return true
        }
        escaper.setCameraField(DEFAULT_CAMERA_FIELD)
        return true
    }

    //-animation(an) <string>   --> makes your hero doing an animation
    if (name === 'animation' || name === 'an') {
        if (noParam || !escaper.isAlive()) {
            return true
        }

        const hero = escaper.getHero()

        if (hero) {
            SetUnitAnimation(hero, CmdParam(cmd, 0))

            if (!escaper.isEscaperSecondary()) {
                const hero2 = GetMirrorEscaper(escaper)?.getHero()

                if (hero2) {
                    SetUnitAnimation(hero2, CmdParam(cmd, 0))
                }
            }
        }

        return true
    }

    //-mapNbMonsters(mnbm) [moving(m)|all(a)|notMoving(nm)]   --> "moving" is the default value
    if (name === 'mapNbMonsters' || name === 'mnbm') {
        if (!(noParam || nbParam === 1)) {
            return true
        }
        if (noParam || param1 === 'moving' || param1 === 'm') {
            n = getUdgLevels().getNbMonsters('moving')
            Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' moving monsters in the map.')
            return true
        }
        if (param1 === 'all' || param1 === 'a') {
            n = getUdgLevels().getNbMonsters('all')
            Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' monsters in the map.')
            return true
        }
        if (param1 === 'notMoving' || param1 === 'nm') {
            n = getUdgLevels().getNbMonsters('not moving')
            Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' non moving monsters in the map.')
            return true
        }
        return true
    }

    //-levelNbMonsters(lnbm) [moving(m)|all(a)|notMoving(nm)]   --> "moving" is the default value
    if (name === 'levelNbMonsters' || name === 'lnbm') {
        if (!(noParam || nbParam === 1)) {
            return true
        }
        if (noParam || param1 === 'moving' || param1 === 'm') {
            n = getUdgLevels().getCurrentLevel().getNbMonsters('moving')
            Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' moving monsters in this level.')
            return true
        }
        if (param1 === 'all' || param1 === 'a') {
            n = getUdgLevels().getCurrentLevel().getNbMonsters('all')
            Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' monsters in this level.')
            return true
        }
        if (param1 === 'notMoving' || param1 === 'nm') {
            n = getUdgLevels().getCurrentLevel().getNbMonsters('not moving')
            Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' non moving monsters in this level.')
            return true
        }
        return true
    }

    //-kill(kl)   --> kills your hero
    if ((name === 'kill' || name === 'kl') && noParam) {
        if (!escaper.kill()) {
            Text.erP(escaper.getPlayer(), 'You are already dead.')
        }
        return true
    }

    //-kick(kc)   --> kicks yourself
    if ((name === 'kick' || name === 'kc') && noParam) {
        CustomDefeatBJ(escaper.getPlayer(), 'You have kicked... yourself.')
        Text.A(
            udg_colorCode[GetPlayerId(escaper.getPlayer())] +
            GetPlayerName(escaper.getPlayer()) +
            ' has kicked himself !'
        )
        escaper.destroy()
        GetMirrorEscaper(escaper)?.destroy()
        return true
    }

    //-getTerrainInfo(gti) [ <terrain> | <lowInteger> <upInteger> ]
    if (name === 'getTerrainInfo' || name === 'gti') {
        if (noParam) {
            escaper.makeGetTerrainType()
            Text.mkP(escaper.getPlayer(), 'Get terrain info mode enabled')
            return true
        }
        if (nbParam === 1) {
            n = TerrainTypeFromString.TerrainTypeString2TerrainTypeId(param1)
            if (n !== 0) {
                DisplayTerrainDataToPlayer(escaper.getPlayer(), n)
            }
            return true
        }
        if (nbParam === 2) {
            if (IsInteger(param1) && IsInteger(param2)) {
                i = S2I(param1)
                n = S2I(param2)
                if (
                    i >= 1 &&
                    i < n &&
                    n <= TerrainTypeNamesAndData.NB_TERRAINS_TOTAL &&
                    n - i < NB_MAX_TERRAIN_DATA_DISPLAY
                ) {
                    Text.DisplayLineToPlayer(escaper.getPlayer())
                    while (true) {
                        if (i > n) break
                        DisplayTerrainDataToPlayer(escaper.getPlayer(), i)
                        i = i + 1
                    }
                }
            }
            return true
        }
        //mode recherche
        //param = cmd_param(cmd, 0)
        //n = StringLength(param)
        //if (SubStringBJ(param, 1, 1) == "\"" && SubStringBJ(param, n, n) == "\"") then
        //    call DisplayTerrainDataSearchToPlayer(TP, SubStringBJ(param, 2, n-1))
        //endif
        return true
    }

    //-stop(s)   --> stop creating monsters or terrain or stop getTerrainInfoMode
    if (name === 'stop' || name === 's') {
        if (!noParam) {
            return true
        }
        if (escaper.destroyMake()) {
            Text.mkP(escaper.getPlayer(), 'stop')
        } else {
            Text.erP(escaper.getPlayer(), 'nothing to stop')
        }
        return true
    }

    //-disco(d) [off|1~30]  -> choose the number of color changes in ten seconds, or stop color changing (without parameter once a second)
    if (name === 'disco' || name === 'd') {
        if (noParam) {
            n = 10
        } else {
            if (nbParam === 1) {
                if (IsInteger(param1)) {
                    n = S2I(param1)
                    if (n < 1 || n > 30) {
                        return true
                    }
                } else {
                    if (param1 == 'off' && escaper.discoTrigger != null) {
                        DestroyTrigger(escaper.discoTrigger)
                        ;(escaper.discoTrigger as any) = null

                        const discoTrigger = GetMirrorEscaper(escaper)?.discoTrigger

                        if (discoTrigger) {
                            DestroyTrigger(discoTrigger)
                            ;(GetMirrorEscaper(escaper)!.discoTrigger as any) = null
                        }

                        Text.P(escaper.getPlayer(), 'disco off')
                    }
                    return true
                }
            } else {
                return true
            }
        }

        ;[escaper.discoTrigger, GetMirrorEscaper(escaper)?.discoTrigger].forEach(trigger => {
            if (trigger) {
                DestroyTrigger(trigger)
                trigger = CreateTrigger()
                TriggerAddAction(trigger, Disco.Disco_Actions)
                TriggerRegisterTimerEvent(trigger, 10 / I2R(n), true) //n changements en 10 secondes
            }
        })

        Text.P(escaper.getPlayer(), 'disco : ' + I2S(n) + ' changes in 10 seconds')
        return true
    }

    //-clearText(clr)   --> remove the text on the screen
    if (name === 'clearText' || name === 'clr') {
        if (noParam) {
            ClearTextForPlayer(escaper.getPlayer())
        }
        return true
    }

    //-usedTerrains(ut)   --> display the terrains already used (onto the map) during this game (16 is the maximum possible !)
    if (name === 'usedTerrains' || name === 'ut') {
        if (noParam) {
            Text.DisplayLineToPlayer(escaper.getPlayer())
            Text.P_timed(
                escaper.getPlayer(),
                TERRAIN_DATA_DISPLAY_TIME,
                udg_colorCode[TEAL] + '       Used terrains :'
            )
            i = 0
            while (true) {
                if (i >= Globals.udg_nb_used_terrains) break
                str = udg_colorCode[TEAL] + I2S(i + 1) + ' : '
                str = str + GetTerrainData(Globals.udg_used_terrain_types[i])
                Text.P_timed(escaper.getPlayer(), TERRAIN_DATA_DISPLAY_TIME, str)
                i = i + 1
            }
        }
        return true
    }

    //-drunk(-) <real drunkValue>   --> value between 5 and 60
    if (name === 'drunk') {
        k = GetPlayerId(escaper.getPlayer())
        if (noParam) {
            if (!TurnOnSlide.udg_isDrunk[k]) {
                TurnOnSlide.udg_isDrunk[k] = true
                x = TurnOnSlide.udg_drunk[k]
                Text.P(escaper.getPlayer(), 'drunk mode to ' + R2S(x))
            } else {
                return true
            }
        } else {
            x = S2R(param1)
            if (nbParam == 1 && x >= 5 && x <= 60) {
                TurnOnSlide.udg_isDrunk[k] = true
                TurnOnSlide.udg_drunk[k] = x
            } else {
                return true
            }
        }
        if (x < 10) {
            n = 1
            Text.P(escaper.getPlayer(), 'You begin to feel bad.')
        } else {
            if (x < 15) {
                n = 2
                Text.P(escaper.getPlayer(), 'Burp !')
            } else {
                n = 3
                if (x < 30) {
                    Text.P(escaper.getPlayer(), 'You understand now why driving drunk is dangerous ??!!')
                } else {
                    Text.P(escaper.getPlayer(), 'Dunno how you can stand...')
                }
            }
        }
        if (n !== TurnOnSlide.udg_drunkLevel[k]) {
            DestroyEffect(TurnOnSlide.udg_drunkEffect[k])

            const hero = escaper.getHero()

            if (hero) {
                TurnOnSlide.udg_drunkEffect[k] = AddSpecialEffectTarget(TurnOnSlide.DRUNK_EFFECTS[n], hero, 'head')
            }

            TurnOnSlide.udg_drunkLevel[k] = n
        }
        return true
    }

    //-noDrunk(-)   --> stop drunk mode
    if (name === 'noDrunk') {
        k = GetPlayerId(escaper.getPlayer())
        if (noParam && TurnOnSlide.udg_isDrunk[k]) {
            TurnOnSlide.udg_isDrunk[k] = false
            TurnOnSlide.udg_drunkLevel[k] = 0
            DestroyEffect(TurnOnSlide.udg_drunkEffect[k])
            Text.P(escaper.getPlayer(), 'You feel better now.')
        }
        return true
    }

    //-autoContinueAfterSliding(acas) <boolean status>
    if (name === 'autoContinueAfterSliding' || name === 'acas') {
        k = GetPlayerId(escaper.getPlayer())
        if (nbParam === 1 && IsBoolString(param1)) {
            if (AutoContinueAfterSliding.udg_autoContinueAfterSliding[k] !== S2B(param1)) {
                AutoContinueAfterSliding.udg_autoContinueAfterSliding[k] = S2B(param1)
                if (k < NB_PLAYERS_MAX) {
                    AutoContinueAfterSliding.udg_autoContinueAfterSliding[k + NB_PLAYERS_MAX] = S2B(param1)
                }

                if (S2B(param1)) {
                    Text.P(escaper.getPlayer(), 'auto continue after sliding on')
                } else {
                    Text.P(escaper.getPlayer(), 'auto continue after sliding off')
                }
            }
        }
        return true
    }

    //-apm(-) [all|a]   --> displays apm on slide of everybody or just yourself
    if (name === 'apm') {
        k = GetPlayerId(escaper.getPlayer())
        if (noParam) {
            Apm.DisplayApm(k)
        } else {
            if (nbParam === 1 && (param1 === 'all' || param1 === 'a')) {
                Apm.DisplayApmAll(k)
            }
        }
        return true
    }

    //-assign(as) <shortcut> <command>   --> puts a command into a key (A Z E R Q S D or F)
    if (name === 'assign' || name === 'as') {
        if (!(nbParam > 1 && CommandShortcuts.IsShortcut(param1))) {
            return true
        }

        const stringAssignedFromCommand = CommandShortcuts.GetStringAssignedFromCommand(cmd)

        if (stringAssignedFromCommand) {
            CommandShortcuts.AssignShortcut(GetPlayerId(escaper.getPlayer()), param1, stringAssignedFromCommand)
        }

        return true
    }

    //-unassign(uas) <shortcut>   --> removes the command put into a key
    if (name === 'unassign' || name === 'uas') {
        if (!(nbParam === 1 && CommandShortcuts.IsShortcut(param1))) {
            return true
        }
        CommandShortcuts.UnassignShortcut(GetPlayerId(escaper.getPlayer()), param1)
        return true
    }

    //-displayShortcuts(ds)   --> displays the commands associated to your shortcuts
    if (name === 'displayShortcuts' || name === 'ds') {
        if (noParam) {
            CommandShortcuts.DisplayShortcuts(GetPlayerId(escaper.getPlayer()))
        }
        return true
    }

    //-saveCommand(sc) <commandLabel> <command>   --> save a command into a name of your choice
    if (name === 'saveCommand' || name === 'sc') {
        if (!(nbParam > 1)) {
            return true
        }
        newCmd(escaper, param1, '-' + CommandShortcuts.GetStringAssignedFromCommand(cmd))
        Text.P(escaper.getPlayer(), 'new command "' + param1 + '" added')
        return true
    }

    //-executeCommand(ec) <commandLabel>   --> execute a command you saved with "saveCommand"
    if (name === 'executeCommand' || name === 'ec') {
        if (!(nbParam === 1)) {
            return true
        }
        if (!execute(escaper, param1)) {
            Text.erP(escaper.getPlayer(), 'unknown command name')
        }
        return true
    }

    //-getCurrentLevel(getcl)   --> displays the number of the current level (first one is number 0)
    if (name === 'getCurrentLevel' || name === 'getcl') {
        if (!noParam) {
            return true
        }
        Text.P(escaper.getPlayer(), 'the current level is number ' + I2S(getUdgLevels().getCurrentLevel().getId()))
        return true
    }

    //-leaderboard
    if (name === 'leaderboard' || name === 'ldb') {
        if (nbParam === 1 && IsBoolString(param1)) {
            if (GetLocalPlayer() == escaper.getPlayer()) {
                LeaderboardDisplay(udg_lives.getLeaderboard(), S2B(param1))
            }
        }
        return true
    }

    return false
}