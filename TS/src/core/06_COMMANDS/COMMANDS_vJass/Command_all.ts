import { ClearTextForPlayer, IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
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
import { ColorString2Id, udg_colorCode, udg_colorStrings } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { ColorInfo, GetMirrorEscaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { TerrainTypeWalk } from 'core/04_STRUCTURES/TerrainType/TerrainTypeWalk'
import { DisplayTerrainDataToPlayer, GetTerrainData } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { Apm } from 'core/08_GAME/Apm_clics_par_minute/Apm'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { PRESS_TIME_TO_ENABLE_FOLLOW_MOUSE } from 'core/Follow_mouse/Follow_mouse'
import { ServiceManager } from 'Services'
import { createTimer } from 'Utils/mapUtils'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { IsInteger, PercentageStringOrX2Integer } from '../../01_libraries/Functions_on_numbers'
import { EscaperEffectFunctions } from '../../04_STRUCTURES/Escaper/EscaperEffect_functions'
import { execute, newCmd } from '../../04_STRUCTURES/Escaper/EscaperSavedCommands'
import { Disco } from '../../04_STRUCTURES/Escaper/Escaper_disco'
import { TerrainTypeFromString } from '../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_from_string'
import { TerrainTypeNamesAndData } from '../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_names_and_data'
import { AutoContinueAfterSliding } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/Auto_continue_after_sliding'
import { TurnOnSlide } from '../../07_TRIGGERS/Slide_and_CheckTerrain_triggers/To_turn_on_slide'
import { GetStringAssignedFromCommand, KeyboardShortcut } from '../../Keyboard_shortcuts/KeyboardShortcut'
import { CmdParam, isPlayerId, resolvePlayerId, resolvePlayerIds } from './Command_functions'

const cameraFieldMap: { [x: string]: camerafield } = {
    TARGET_DISTANCE: CAMERA_FIELD_TARGET_DISTANCE,
    FARZ: CAMERA_FIELD_FARZ,
    ANGLE_OF_ATTACK: CAMERA_FIELD_ANGLE_OF_ATTACK,
    FIELD_OF_VIEW: CAMERA_FIELD_FIELD_OF_VIEW,
    ROLL: CAMERA_FIELD_ROLL,
    ROTATION: CAMERA_FIELD_ROTATION,
    ZOFFSET: CAMERA_FIELD_ZOFFSET,
    NEARZ: CAMERA_FIELD_NEARZ,
    LOCAL_PITCH: CAMERA_FIELD_LOCAL_PITCH,
    LOCAL_YAW: CAMERA_FIELD_LOCAL_YAW,
    LOCAL_ROLL: CAMERA_FIELD_LOCAL_ROLL,
}

export const initCommandAll = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    for (const { name, alias } of udg_colorStrings) {
        //-<color>   --> change the base color of the hero
        registerCommand({
            name,
            alias,
            group: 'all',
            argDescription: '',
            description: '',
            cb: ({ noParam, nbParam, param1 }, escaper) => {
                if (noParam) {
                    escaper.setBaseColor(ColorString2Id(name))
                    return true
                }
                if (nbParam == 1 && escaper.isTrueMaximaxou() && isPlayerId(param1)) {
                    getUdgEscapers().get(resolvePlayerId(param1))?.setBaseColor(ColorString2Id(name))
                }
                return true
            },
        })
    }

    //-vertexColor(vc) [ <red> <green> <blue> [<transparency>] ]   --> without parameter takes a random vertex color without changing transparency
    registerCommand({
        name: 'vertexColor',
        alias: ['vc', 'wild'],
        group: 'all',
        argDescription: '[ <red> <green> <blue> [<transparency>] ]',
        description: 'without parameter takes a random vertex color without changing transparency',
        cb: ({ noParam, nbParam, param1, param2, param3, param4 }, escaper) => {
            if (noParam || nbParam === 1) {
                if (nbParam === 1) {
                    if (!(isPlayerId(param1) && escaper.isTrueMaximaxou())) {
                        return true
                    }

                    const targetEscaper = getUdgEscapers().get(resolvePlayerId(param1))

                    if (!targetEscaper) {
                        return true
                    }

                    escaper = targetEscaper
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
        },
    })

    //-vertexColorRed(vcr) [<red>]   --> changes the red part of the vertex color only
    registerCommand({
        name: 'vertexColorRed',
        alias: ['vcr'],
        group: 'all',
        argDescription: '[<red>]',
        description: 'changes the red part of the vertex color only',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
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
        },
    })

    //-vertexColorGreen(vcg) [<Green>]   --> changes the green part of the vertex color only
    registerCommand({
        name: 'vertexColorGreen',
        alias: ['vcg'],
        group: 'all',
        argDescription: '[<Green>]',
        description: 'changes the green part of the vertex color only',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
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
        },
    })

    //-vertexColorBlue(vcb) [<Blue>]   --> changes the blue part of the vertex color only
    registerCommand({
        name: 'vertexColorBlue',
        alias: ['vcb'],
        group: 'all',
        argDescription: '[<Blue>]',
        description: 'changes the blue part of the vertex color only',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
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
        },
    })

    //-vertexColorTransparency(vct) [<transparency>]   --> changes the transparency of the hero
    registerCommand({
        name: 'vertexColorTransparency',
        alias: ['vct'],
        group: 'all',
        argDescription: '[<transparency>]',
        description: 'changes the transparency of the hero',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
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
        },
    })

    //-noVertex(nv)   --> put normal vertex color : RGB(100, 100, 100) with 0 transparency
    registerCommand({
        name: 'noVertex',
        alias: ['nv'],
        group: 'all',
        argDescription: '',
        description: 'put normal vertex color : RGB(100, 100, 100) with 0 transparency',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (!(noParam || nbParam === 1)) {
                return true
            }
            if (nbParam === 1) {
                if (!(escaper.isTrueMaximaxou() && isPlayerId(param1))) {
                    return true
                }

                const targetEscaper = getUdgEscapers().get(resolvePlayerId(param1))

                if (!targetEscaper) {
                    return true
                }

                escaper = targetEscaper
            }
            escaper.setVcRed(100)
            escaper.setVcGreen(100)
            escaper.setVcBlue(100)
            escaper.setVcTransparency(0)
            escaper.refreshVertexColor()
            return true
        },
    })

    //-colorInfo(ci) [<Pcolor>]   --> displays base color and vertex color of a hero
    registerCommand({
        name: 'colorInfo',
        alias: ['ci'],
        group: 'all',
        argDescription: '[<Pcolor>]',
        description: 'displays base color and vertex color of a hero',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (noParam) {
                ColorInfo(escaper, escaper.getPlayer())
                return true
            }
            if (nbParam === 1 && isPlayerId(param1)) {
                const targetEscaper = getUdgEscapers().get(resolvePlayerId(param1))
                targetEscaper && ColorInfo(targetEscaper, escaper.getPlayer())
                return true
            }
            return true
        },
    })

    //-effect(ef) <effect>   --> adds an effect on each hand of the hero
    registerCommand({
        name: 'effect',
        alias: ['ef'],
        group: 'all',
        argDescription: '<effect>',
        description: 'adds an effect on each hand of the hero',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!EscaperEffectFunctions.IsEffectStr(param1)) {
                return true
            }
            if (nbParam == 2 && escaper.isTrueMaximaxou() && isPlayerId(param2)) {
                const targetEscaper = getUdgEscapers().get(resolvePlayerId(param2))

                if (!targetEscaper) {
                    return true
                }

                escaper = targetEscaper
            } else {
                if (nbParam !== 1) {
                    return true
                }
            }
            const str = EscaperEffectFunctions.String2EffectStr(param1)

            if (str) {
                escaper.newEffect(str, 'hand right')
                escaper.newEffect(str, 'hand left')
            }

            return true
        },
    })

    //-customEffect(ce) <effect> <body_part>   --> adds an effect on a body part of the hero
    registerCommand({
        name: 'customEffect',
        alias: ['ce'],
        group: 'all',
        argDescription: '<effect> <body_part>',
        description: 'adds an effect on a body part of the hero',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return true
            }
            if (!(EscaperEffectFunctions.IsEffectStr(param1) && EscaperEffectFunctions.IsBodyPartStr(param2))) {
                return true
            }
            const str = EscaperEffectFunctions.String2EffectStr(param1)

            if (str) {
                const str3 = EscaperEffectFunctions.String2BodyPartStr(param2)

                if (str3) {
                    escaper.newEffect(str, str3)
                }
            }

            return true
        },
    })

    //-effectsEverywhere(efe) <effect>   --> adds the same effect to each body part of the hero
    registerCommand({
        name: 'effectsEverywhere',
        alias: ['efe'],
        group: 'all',
        argDescription: '<effect>',
        description: 'adds the same effect to each body part of the hero',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!EscaperEffectFunctions.IsEffectStr(param1)) {
                return true
            }
            if (nbParam == 2 && escaper.isTrueMaximaxou() && isPlayerId(param2)) {
                const targetEscaper = getUdgEscapers().get(resolvePlayerId(param2))

                if (!targetEscaper) {
                    return true
                }

                escaper = targetEscaper
            } else {
                if (nbParam !== 1) {
                    return true
                }
            }

            const str = EscaperEffectFunctions.String2EffectStr(param1)

            if (str) {
                escaper.newEffect(str, 'hand right')
                escaper.newEffect(str, 'hand left')
                escaper.newEffect(str, 'foot left')
                escaper.newEffect(str, 'foot right')
                escaper.newEffect(str, 'head')
                escaper.newEffect(str, 'chest')
            }

            return true
        },
    })

    //-deleteEffects(de) [<numberOfEffectsToRemove>]   --> delete a specified effect of the hero or all effects if not specified
    registerCommand({
        name: 'deleteEffects',
        alias: ['de'],
        group: 'all',
        argDescription: '[<numberOfEffectsToRemove>]',
        description: 'delete a specified effect of the hero or all effects if not specified',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (!(noParam || nbParam === 1)) {
                return true
            }

            let n = 0

            if (nbParam === 1) {
                if (S2I(param1) !== 0) {
                    n = S2I(param1)
                    if (n < 1 || n > LIMIT_NB_HERO_EFFECTS) {
                        return true
                    }
                } else if (isPlayerId(param1)) {
                    if (!escaper.isTrueMaximaxou()) {
                        return true
                    }

                    const targetEscaper = getUdgEscapers().get(resolvePlayerId(param1))

                    if (!targetEscaper) {
                        return true
                    }

                    escaper = targetEscaper
                    n = LIMIT_NB_HERO_EFFECTS
                } else {
                    n = 0
                }
            } else {
                n = LIMIT_NB_HERO_EFFECTS
            }
            escaper.destroyLastEffects(n)
            return true
        },
    })

    //-cameraField(cf) x   --> changes the camera field (height), default is 2500
    registerCommand({
        name: 'cameraField',
        alias: ['cf'],
        group: 'all',
        argDescription: 'x',
        description: 'changes the camera field (height), default is 2500',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (!((nbParam === 1 || nbParam === 2) && IsInteger(param1))) {
                return true
            }

            if (nbParam === 2) {
                if (param2.toUpperCase() in cameraFieldMap) {
                    SetCameraFieldForPlayer(escaper.getPlayer(), cameraFieldMap[param2.toUpperCase()], S2I(param1), 0)
                    Text.P(escaper.getPlayer(), `Set: ${param2.toUpperCase()} to ${S2I(param1)}`)
                }

                return true
            }

            if (nbParam === 1) {
                escaper.setCameraField(S2I(param1))
            }

            return true
        },
    })

    //-debugCameraField
    registerCommand({
        name: 'debugCameraField',
        alias: ['dcf'],
        group: 'all',
        argDescription: '',
        description: '',
        cb: (_, escaper) => {
            Text.P(
                escaper.getPlayer(),
                `
            TARGET_DISTANCE: ${GetCameraField(CAMERA_FIELD_TARGET_DISTANCE)}
            FARZ: ${GetCameraField(CAMERA_FIELD_FARZ)}
            ANGLE_OF_ATTACK: ${Rad2Deg(GetCameraField(CAMERA_FIELD_ANGLE_OF_ATTACK))}
            FIELD_OF_VIEW: ${Rad2Deg(GetCameraField(CAMERA_FIELD_FIELD_OF_VIEW))}
            ROLL: ${Rad2Deg(GetCameraField(CAMERA_FIELD_ROLL))}
            ROTATION: ${Rad2Deg(GetCameraField(CAMERA_FIELD_ROTATION))}
            ZOFFSET: ${GetCameraField(CAMERA_FIELD_ZOFFSET)}
            NEARZ: ${GetCameraField(CAMERA_FIELD_NEARZ)}
            LOCAL_PITCH: ${Rad2Deg(GetCameraField(CAMERA_FIELD_LOCAL_PITCH))}
            LOCAL_YAW: ${Rad2Deg(GetCameraField(CAMERA_FIELD_LOCAL_YAW))}
            LOCAL_ROLL: ${Rad2Deg(GetCameraField(CAMERA_FIELD_LOCAL_ROLL))}
                    `
            )

            return true
        },
    })

    //-resetCamera(rc)   --> put the camera back like chosen field
    registerCommand({
        name: 'resetCamera',
        alias: ['rc'],
        group: 'all',
        argDescription: '',
        description: 'put the camera back like chosen field',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.resetCamera()
            return true
        },
    })

    //-resetCameraInit(rci)   --> changes the camera field back to its default value (2500)
    registerCommand({
        name: 'resetCameraInit',
        alias: ['rci'],
        group: 'all',
        argDescription: '',
        description: 'changes the camera field back to its default value (2500)',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            escaper.setCameraField(DEFAULT_CAMERA_FIELD)
            return true
        },
    })

    //-animation(an) <string>   --> makes your hero doing an animation
    registerCommand({
        name: 'animation',
        alias: ['an'],
        group: 'all',
        argDescription: '<string>',
        description: 'makes your hero doing an animation',
        cb: ({ cmd, noParam }, escaper) => {
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
        },
    })

    //-mapNbMonsters(mnbm) [moving(m)|all(a)|notMoving(nm)]   --> "moving" is the default value
    registerCommand({
        name: 'mapNbMonsters',
        alias: ['mnbm'],
        group: 'all',
        argDescription: '[moving(m)|all(a)|notMoving(nm)]',
        description: '"moving" is the default value',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (!(noParam || nbParam === 1)) {
                return true
            }

            let n = 0

            if (noParam || param1 === 'all' || param1 === 'a') {
                n = getUdgLevels().getNbMonsters('all')
                Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' monsters in the map.')
                return true
            }
            if (param1 === 'moving' || param1 === 'm') {
                n = getUdgLevels().getNbMonsters('moving')
                Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' moving monsters in the map.')
                return true
            }
            if (param1 === 'notMoving' || param1 === 'nm') {
                n = getUdgLevels().getNbMonsters('not moving')
                Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' non moving monsters in the map.')
                return true
            }
            return true
        },
    })

    //-levelNbMonsters(lnbm) [moving(m)|all(a)|notMoving(nm)]   --> "moving" is the default value
    registerCommand({
        name: 'levelNbMonsters',
        alias: ['lnbm'],
        group: 'all',
        argDescription: '[moving(m)|all(a)|notMoving(nm)]',
        description: '"moving" is the default value',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            if (!(noParam || nbParam === 1)) {
                return true
            }

            let n = 0

            if (noParam || param1 === 'all' || param1 === 'a') {
                n = getUdgLevels().getCurrentLevel(escaper).getNbMonsters('all')
                Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' monsters in this level.')

                let p = 0

                for (const [_, ms] of pairs(getUdgLevels().getCurrentLevel(escaper).monsterSpawns.getAll())) {
                    if (ms.monsters) {
                        p += BlzGroupGetSize(ms.monsters)
                    }
                }

                if (p > 0) {
                    Text.P(escaper.getPlayer(), 'There are ' + I2S(p) + ' spawned monsters in this level.')
                }

                return true
            }
            if (param1 === 'moving' || param1 === 'm') {
                n = getUdgLevels().getCurrentLevel(escaper).getNbMonsters('moving')
                Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' moving monsters in this level.')
                return true
            }
            if (param1 === 'notMoving' || param1 === 'nm') {
                n = getUdgLevels().getCurrentLevel(escaper).getNbMonsters('not moving')
                Text.P(escaper.getPlayer(), 'There are ' + I2S(n) + ' non moving monsters in this level.')
                return true
            }

            return true
        },
    })

    //-kill(kl)   --> kills your hero
    registerCommand({
        name: 'kill',
        alias: ['kl'],
        group: 'all',
        argDescription: '',
        description: 'kills your hero',
        enabled: ({ noParam }) => noParam,
        cb: ({}, escaper) => {
            if (!escaper.kill()) {
                Text.erP(escaper.getPlayer(), 'You are already dead.')
            }
            return true
        },
    })

    //-kick(kc)   --> kicks yourself
    registerCommand({
        name: 'kick',
        alias: ['kc'],
        group: 'all',
        argDescription: '',
        description: 'kicks yourself',
        enabled: ({ noParam }) => noParam,
        cb: ({}, escaper) => {
            CustomDefeatBJ(escaper.getPlayer(), 'You have kicked... yourself.')
            Text.A(udg_colorCode[escaper.getColorId()] + escaper.getDisplayName() + ' has kicked himself !')
            escaper.destroy()
            GetMirrorEscaper(escaper)?.destroy()
            return true
        },
    })

    //-getTerrainInfo(gti) [ <terrain> | <lowInteger> <upInteger> ]
    registerCommand({
        name: 'getTerrainInfo',
        alias: ['gti'],
        group: 'all',
        argDescription: '[ <terrain> | <lowInteger> <upInteger> ]',
        description: '',
        cb: ({ noParam, nbParam, param1, param2 }, escaper) => {
            if (noParam) {
                escaper.makeGetTerrainType()
                Text.mkP(escaper.getPlayer(), 'Get terrain info mode enabled')
                return true
            }

            let i = 0
            let n = 0

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
        },
    })

    //-stop(s)   --> stop creating monsters or terrain or stop getTerrainInfoMode
    registerCommand({
        name: 'stop',
        alias: ['s'],
        group: 'all',
        argDescription: '',
        description: 'stop creating monsters or terrain or stop getTerrainInfoMode',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            if (escaper.destroyMake()) {
                Text.mkP(escaper.getPlayer(), 'stop')
            } else {
                Text.erP(escaper.getPlayer(), 'nothing to stop')
            }
            return true
        },
    })

    //-disco(d) [off|1~30]  -> choose the number of color changes in ten seconds, or stop color changing (without parameter once a second)
    registerCommand({
        name: 'disco',
        alias: ['d'],
        group: 'all',
        argDescription: '[off|1~30]',
        description:
            'choose the number of color changes in ten seconds, or stop color changing (without parameter once a second)',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            let n = 0

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
                            escaper.discoTrigger.destroy()
                            GetMirrorEscaper(escaper)?.discoTrigger?.destroy()

                            Text.P(escaper.getPlayer(), 'disco off')
                        }
                        return true
                    }
                } else {
                    return true
                }
            }

            escaper.discoTrigger?.destroy()
            escaper.discoTrigger = createTimer(10 / I2R(n), true, () => Disco.Disco_Actions(escaper.getEscaperId())) //n changements en 10 secondes

            const mirrorEscaper = GetMirrorEscaper(escaper)

            if (mirrorEscaper) {
                mirrorEscaper.discoTrigger?.destroy()
                mirrorEscaper.discoTrigger = createTimer(10 / I2R(n), true, () =>
                    Disco.Disco_Actions(escaper.getEscaperId())
                ) //n changements en 10 secondes
            }

            Text.P(escaper.getPlayer(), 'disco : ' + I2S(n) + ' changes in 10 seconds')
            return true
        },
    })

    //-clearText(clr)   --> remove the text on the screen
    registerCommand({
        name: 'clearText',
        alias: ['clr'],
        group: 'all',
        argDescription: '',
        description: 'remove the text on the screen',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                ClearTextForPlayer(escaper.getPlayer())
            }
            return true
        },
    })

    //-usedTerrains(ut)   --> display the terrains already used (onto the map) during this game (16 is the maximum possible !)
    registerCommand({
        name: 'usedTerrains',
        alias: ['ut'],
        group: 'all',
        argDescription: '',
        description: 'display the terrains already used (onto the map) during this game (16 is the maximum possible !)',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                Text.DisplayLineToPlayer(escaper.getPlayer())
                Text.P_timed(
                    escaper.getPlayer(),
                    TERRAIN_DATA_DISPLAY_TIME,
                    udg_colorCode[TEAL] + '       Used terrains :'
                )

                let i = 0
                let str = ''

                while (true) {
                    if (i >= Globals.udg_nb_used_terrains) break
                    str = udg_colorCode[TEAL] + I2S(i + 1) + ' : '
                    str = str + GetTerrainData(Globals.udg_used_terrain_types[i])
                    Text.P_timed(escaper.getPlayer(), TERRAIN_DATA_DISPLAY_TIME, str)
                    i = i + 1
                }
            }
            return true
        },
    })

    //-drunk(-) <real drunkValue>   --> value between 5 and 60
    registerCommand({
        name: 'drunk',
        alias: [],
        group: 'all',
        argDescription: '<real drunkValue>',
        description: 'value between 5 and 60',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            const k = GetPlayerId(escaper.getPlayer())
            let x = 0
            let n = 0

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
        },
    })

    //-noDrunk(-)   --> stop drunk mode
    registerCommand({
        name: 'noDrunk',
        alias: [],
        group: 'all',
        argDescription: '',
        description: 'stop drunk mode',
        cb: ({ noParam }, escaper) => {
            const k = GetPlayerId(escaper.getPlayer())
            if (noParam && TurnOnSlide.udg_isDrunk[k]) {
                TurnOnSlide.udg_isDrunk[k] = false
                TurnOnSlide.udg_drunkLevel[k] = 0
                DestroyEffect(TurnOnSlide.udg_drunkEffect[k])
                Text.P(escaper.getPlayer(), 'You feel better now.')
            }
            return true
        },
    })

    //-autoContinueAfterSliding(acas) <boolean status>
    registerCommand({
        name: 'autoContinueAfterSliding',
        alias: ['acas'],
        group: 'all',
        argDescription: '<boolean status>',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            const k = GetPlayerId(escaper.getPlayer())
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
        },
    })

    //-apm(-) [all|a]   --> displays apm on slide of everybody or just yourself
    registerCommand({
        name: 'apm',
        alias: [],
        group: 'all',
        argDescription: '[all|a]',
        description: 'displays apm on slide of everybody or just yourself',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            const k = GetPlayerId(escaper.getPlayer())
            if (noParam) {
                Apm.DisplayApm(k)
            } else {
                if (nbParam === 1 && (param1 === 'all' || param1 === 'a')) {
                    Apm.DisplayApmAll(k)
                }
            }
            return true
        },
    })

    //-assign(as) <shortcut> <command>   --> puts a command into a key (A Z E R Q S D or F)
    registerCommand({
        name: 'assign',
        alias: ['as'],
        group: 'all',
        argDescription: '[<modifier>]<key> <command>',
        description:
            'puts a command into any alphanumeric key with of without modifiers ctrl (C) or shift (S) or both (CS)',
        cb: ({ cmd, nbParam, param1 }, escaper) => {
            if (nbParam <= 1) {
                return true
            }

            const stringAssignedFromCommand = GetStringAssignedFromCommand(cmd)

            if (stringAssignedFromCommand) {
                const keyboardShortcut = new KeyboardShortcut(escaper, param1, stringAssignedFromCommand)
                escaper.getKeyboardShortcutsArray().new(keyboardShortcut, true)
                Text.mkP(escaper.getPlayer(), 'command assigned')
            }

            return true
        },
    })

    //-unassign(uas) <shortcut>   --> removes the command put into a key
    registerCommand({
        name: 'unassign',
        alias: ['uas'],
        group: 'all',
        argDescription: '[<modifier>]<key>',
        description: 'removes the command put into a key',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }

            if (escaper.getKeyboardShortcutsArray().destroyOneByKey(param1)) {
                Text.mkP(escaper.getPlayer(), 'shortcut removed')
            } else {
                Text.erP(escaper.getPlayer(), 'you have no such shortcut')
            }

            return true
        },
    })

    //-displayShortcuts(ds)   --> displays the commands associated to your shortcuts
    registerCommand({
        name: 'displayShortcuts',
        alias: ['ds'],
        group: 'all',
        argDescription: '',
        description: 'displays the commands associated to your shortcuts',
        cb: ({ noParam }, escaper) => {
            if (noParam) {
                escaper.getKeyboardShortcutsArray().displayAll()
            }
            return true
        },
    })

    //-saveCommand(sc) <commandLabel> <command>   --> save a command into a name of your choice
    registerCommand({
        name: 'saveCommand',
        alias: ['sc'],
        group: 'all',
        argDescription: '<commandLabel> <command>',
        description: 'save a command into a name of your choice',
        cb: ({ cmd, nbParam, param1 }, escaper) => {
            if (!(nbParam > 1)) {
                return true
            }
            newCmd(escaper, param1, '-' + GetStringAssignedFromCommand(cmd))
            Text.P(escaper.getPlayer(), 'new command "' + param1 + '" added')
            return true
        },
    })

    //-executeCommand(ec) <commandLabel>   --> execute a command you saved with "saveCommand"
    registerCommand({
        name: 'executeCommand',
        alias: ['ec'],
        group: 'all',
        argDescription: '<commandLabel>',
        description: 'execute a command you saved with "saveCommand"',
        cb: ({ nbParam, param1 }, escaper) => {
            if (!(nbParam === 1)) {
                return true
            }
            if (!execute(escaper, param1)) {
                Text.erP(escaper.getPlayer(), 'unknown command name')
            }
            return true
        },
    })

    //-getCurrentLevel(getcl)   --> displays the number of the current level (first one is number 0)
    registerCommand({
        name: 'getCurrentLevel',
        alias: ['getcl'],
        group: 'all',
        argDescription: '',
        description: 'displays the number of the current level (first one is number 0)',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return true
            }
            Text.P(
                escaper.getPlayer(),
                'the current level is number ' + I2S(getUdgLevels().getCurrentLevel(escaper).getId())
            )
            return true
        },
    })

    //-leaderboard
    registerCommand({
        name: 'leaderboard',
        alias: ['ldb'],
        group: 'all',
        argDescription: 'on | off | mb|multiboard|reset | classic | global | current',
        description: 'displays the leaderboard',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1) {
                if (IsBoolString(param1)) {
                    escaper.hideLeaderboard = !S2B(param1)
                    ServiceManager.getService('Multiboard').setVisibility(escaper, S2B(param1))
                } else if (param1 === 'classic') {
                    ServiceManager.getService('Multiboard').setMode(escaper, 'leaderboard')
                } else if (param1 === 'reset' || param1 === 'multiboard' || param1 === 'mb') {
                    ServiceManager.getService('Multiboard').setMode(escaper, 'multiboard')
                } else if (param1 === 'global') {
                    ServiceManager.getService('Multiboard').setMode(escaper, 'multiboard')
                    ServiceManager.getService('Multiboard').setStatsMode(escaper, 'global')
                } else if (param1 === 'current') {
                    ServiceManager.getService('Multiboard').setMode(escaper, 'multiboard')
                    ServiceManager.getService('Multiboard').setStatsMode(escaper, 'current')
                }
            }

            return true
        },
    })

    //-firstPersonCam(fpc)
    registerCommand({
        name: 'firstPersonCam',
        alias: ['fpc'],
        group: 'all',
        argDescription: 'on | off',
        description: 'displays the first person camera',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1 && IsBoolString(param1)) {
                escaper.getFirstPersonHandle().toggleFirstPerson(S2B(param1))
                Text.mkP(escaper.getPlayer(), `First person cam ${S2B(param1) ? 'enabled' : 'disabled'}`)
            }

            return true
        },
    })

    //-lockCam(lc)
    registerCommand({
        name: 'lockCam',
        alias: ['lc'],
        group: 'all',
        argDescription: '[<player> | on | off]',
        description: 'locks the camera',
        cb: ({ noParam, nbParam, param1 }, escaper) => {
            let target: Escaper | null = null

            if (nbParam > 1) {
                throw 'Wrong command parameters'
            }

            if (IsBoolString(param1)) {
                if (S2B(param1)) {
                    target = escaper
                } else {
                    target = null
                }
            } else {
                target = noParam ? escaper : nbParam === 1 ? getUdgEscapers().get(resolvePlayerId(param1)) : null
            }

            escaper.setLockCamTarget(target)
            escaper.resetCamera()

            if (target) {
                Text.mkP(escaper.getPlayer(), 'Camera locked')
            } else {
                Text.mkP(escaper.getPlayer(), 'Camera unlocked')
            }

            return true
        },
    })

    //-lockCamRotation(lcr)
    registerCommand({
        name: 'lockCamRotation',
        alias: ['lcr'],
        group: 'all',
        argDescription: 'on | off',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1 && IsBoolString(param1)) {
                escaper.setLockCamTarget(S2B(param1) ? escaper : null)
                escaper.resetCamera()
                escaper.toggleLockCamRotation(S2B(param1))
                Text.mkP(escaper.getPlayer(), `Camera rotation ${S2B(param1) ? 'locked' : 'unlocked'}`)
            }

            return true
        },
    })

    //-lockCamHeight(lch)
    registerCommand({
        name: 'lockCamHeight',
        alias: ['lch'],
        group: 'all',
        argDescription: 'on | off',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam === 1 && IsBoolString(param1)) {
                escaper.resetCamera()
                escaper.toggleLockCamHeight(S2B(param1))
                Text.mkP(escaper.getPlayer(), `Camera height ${S2B(param1) ? 'locked' : 'unlocked'}`)
            }

            return true
        },
    })

    //-followMouse <boolean>
    registerCommand({
        name: 'followMouse',
        alias: ['fm'],
        group: 'all',
        argDescription: '<boolean> [neverDisable|nd]',
        description: 'follows the mouse',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam != 1 && nbParam != 2) {
                return true
            }

            const neverDisable = param2 == 'neverDisable' || param2 == 'nd'

            escaper.enableFollowMouseMode(S2B(param1), neverDisable)

            if (S2B(param1)) {
                Text.mkP(
                    escaper.getPlayer(),
                    'Follow mouse mode enabled : hold right click during ' +
                        PRESS_TIME_TO_ENABLE_FOLLOW_MOUSE +
                        's while sliding to activate it. Do a normal click to disable it'
                )
            } else {
                Text.mkP(escaper.getPlayer(), 'Follow mouse mode disabled')
            }

            return true
        },
    })

    //-mirror <boolean>
    registerCommand({
        name: 'mirror',
        alias: ['m', 'reverse'],
        group: 'all',
        argDescription: '<boolean>',
        description: 'mirrors the camera',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            if (!IsBoolString(param1)) {
                return true
            }

            if (!(escaper.getLastTerrainType() instanceof TerrainTypeWalk)) {
                Text.erP(escaper.getPlayer(), 'You must be on a walkable terrain to use this command')
                return true
            }

            escaper.setSlideMirror(S2B(param1))

            if (S2B(param1)) {
                Text.mkP(escaper.getPlayer(), 'Mirror mode enabled')
            } else {
                Text.mkP(escaper.getPlayer(), 'Mirror mode disabled')
            }

            return true
        },
    })

    //-ignoreDeathMessages(idm) <boolean>
    registerCommand({
        name: 'ignoreDeathMessages',
        alias: ['idm'],
        group: 'all',
        argDescription: '<boolean>',
        description: 'ignores death messages',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            if (!IsBoolString(param1)) {
                return true
            }

            escaper.setIgnoreDeathMessages(S2B(param1))

            if (S2B(param1)) {
                Text.mkP(escaper.getPlayer(), 'Ignoring death messages')
            } else {
                Text.mkP(escaper.getPlayer(), 'Not ignoring death messages')
            }

            return true
        },
    })

    //-panCameraOnRevive(pcor) <coop | all | none>
    registerCommand({
        name: 'panCameraOnRevive',
        alias: ['pcor'],
        group: 'all',
        argDescription: '<coop | all | none> [distance]',
        description: 'pan camera on revive, default distance = 2048',
        cb: ({ param1, param2 }, escaper) => {
            if (param1 !== 'coop' && param1 !== 'all' && param1 !== 'none') {
                Text.mkP(escaper.getPlayer(), `param1 must be: coop | all | none`)
                return true
            }

            if (S2I(param2) !== 0) {
                escaper.moveCamDistance = S2I(param2)
            }

            escaper.setPanCameraOnRevive(param1)
            Text.mkP(escaper.getPlayer(), `Pan camera on revive set to: ${param1} at ${escaper.moveCamDistance} `)

            return true
        },
    })

    //-panCameraOnPortal(pcop) <boolean>
    registerCommand({
        name: 'panCameraOnPortal',
        alias: ['pcop'],
        group: 'all',
        argDescription: '<boolean>',
        description: 'pan camera on portal',
        cb: ({ param1 }, escaper) => {
            if (!IsBoolString(param1)) {
                Text.mkP(escaper.getPlayer(), 'Invalid boolean')
                return true
            }

            escaper.panCameraOnPortal = S2B(param1)
            Text.mkP(escaper.getPlayer(), `Pan camera on revive set to: ${param1}`)

            return true
        },
    })

    //-showNames <boolean>
    registerCommand({
        name: 'showNames',
        alias: ['sn'],
        group: 'all',
        argDescription: '<boolean>',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            if (!IsBoolString(param1)) {
                return true
            }

            if (S2B(param1)) {
                Text.mkP(escaper.getPlayer(), 'Showing player names')
            } else {
                Text.mkP(escaper.getPlayer(), 'Hiding player names')
            }

            escaper.setShowNames(S2B(param1))

            return true
        },
    })

    //-othersTransparency <number> | off | reset
    registerCommand({
        name: 'othersTransparency',
        alias: ['ot'],
        group: 'all',
        argDescription: '<number> | off|reset',
        description: '',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                return true
            }

            if (param1 === 'off' || param1 === 'reset') {
                if (GetLocalPlayer() == escaper.getPlayer()) {
                    Escaper.setOthersTransparency(null)
                }
                Text.mkP(escaper.getPlayer(), `Showing other heroes as normal`)
                return true
            }

            if (!(S2I(param1) >= 0 && S2I(param1) <= 100)) {
                return true
            }

            Text.mkP(escaper.getPlayer(), `Showing other heroes with transparency: ${S2I(param1)}`)

            if (GetLocalPlayer() == escaper.getPlayer()) {
                Escaper.setOthersTransparency(S2I(param1))
            }

            return true
        },
    })

    //-myStartCommands(msc) [ list [player] | add <command> | del <commandNumber> | ec <commandNumber> | delall ]
    registerCommand({
        name: 'myStartCommands',
        alias: ['msc'],
        group: 'all',
        argDescription: '[ list [player] | add <command> | del <commandNumber> | ec <commandNumber> | delall ]',
        description: 'Run commands on start of the game',
        cb: ({ cmd, nbParam, param1, param2 }, escaper) => {
            if (!escaper.getStartCommandsHandle().isLoaded()) {
                Text.erP(escaper.getPlayer(), 'Start commands not yet loaded')
                return true
            }

            if (nbParam === 2 && param1 === 'list') {
                const resolvedPlayer = getUdgEscapers().get(resolvePlayerId(param2))

                if (!resolvedPlayer) {
                    return true
                }

                Text.P(escaper.getPlayer(), `${resolvedPlayer.getDisplayName()}'s start commands: `)

                let i = 0
                for (const startCmd of resolvedPlayer.getStartCommandsHandle().getStartCommands()) {
                    Text.P(escaper.getPlayer(), `${++i}: ${startCmd}`)
                }
            } else if (nbParam === 0 || (nbParam === 1 && param1 === 'list')) {
                Text.P(escaper.getPlayer(), 'My start commands: ')

                let i = 0
                for (const startCmd of escaper.getStartCommandsHandle().getStartCommands()) {
                    Text.P(escaper.getPlayer(), `${++i}: ${startCmd}`)
                }
            } else if (param1 === 'del' && nbParam === 2) {
                if (S2I(param2) === 0) {
                    Text.erP(escaper.getPlayer(), 'You must specify a command to delete')
                    return true
                }

                const deletedCmd = escaper.getStartCommandsHandle().removeStartCommand(S2I(param2) - 1)

                if (deletedCmd) {
                    Text.P(escaper.getPlayer(), `Deleted command: '${deletedCmd[0]}'`)
                }
            } else if (param1 === 'delall' && nbParam === 1) {
                escaper.getStartCommandsHandle().removeStartCommands()
                Text.P(escaper.getPlayer(), `Deleted all commands`)
            } else if (param1 === 'add') {
                const targetCmd = cmd.substring(cmd.indexOf(' add ') + 5)

                escaper.getStartCommandsHandle().addStartCommand(targetCmd)
                Text.P(escaper.getPlayer(), `Added command: '${targetCmd}'`)
            } else if (param1 === 'ec' && nbParam === 2) {
                if (S2I(param2) === 0) {
                    Text.erP(escaper.getPlayer(), 'You must specify a command to execute')
                    return true
                }

                const executingCommandNumber = S2I(param2) - 1

                if (!escaper.getStartCommandsHandle().executeStartCommand(executingCommandNumber)) {
                    Text.erP(escaper.getPlayer(), 'Wrong command number')
                }
            }

            return true
        },
    })

    //-userInterface(ui) [off|on|map]
    registerCommand({
        name: 'userInterface',
        alias: ['ui'],
        group: 'all',
        argDescription: 'off | on | map',
        description: 'Disable partly or totally the graphical user interface',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam != 1) {
                Text.erP(escaper.getPlayer(), 'wrong command parameters')
                return true
            }

            let enable = false
            let showMinimap = false

            if (param1 == 'map') {
                showMinimap = true
            } else if (IsBoolString(param1)) {
                enable = S2B(param1)
            } else {
                Text.erP(escaper.getPlayer(), 'wrong command parameters')
            }

            if (!escaper.enableInterface(enable, showMinimap)) {
                Text.erP(escaper.getPlayer(), 'nothing to change')
            }

            return true
        },
    })

    const setAlliedState = (escaper: Escaper, target: Escaper, state: boolean) => {
        if (escaper.getId() === target.getId()) {
            return
        }

        escaper.alliedState[target.getId()] = state

        Text.P(
            escaper.getPlayer(),
            `${udg_colorCode[escaper.getId()]}You|r ${state ? '' : 'un'}allied ${
                udg_colorCode[target.getId()]
            }${target.getDisplayName()}`
        )
        Text.P(
            target.getPlayer(),
            `${udg_colorCode[escaper.getId()]}${escaper.getDisplayName()}|r ${state ? '' : 'un'}allied ${
                udg_colorCode[target.getId()]
            }you`
        )
    }

    //-ally [player]
    registerCommand({
        name: 'ally',
        alias: [],
        group: 'all',
        argDescription: 'player',
        description: 'Ally people, lets you revive them',
        cb: ({ param1 }, escaper) => {
            resolvePlayerIds(param1, target => setAlliedState(escaper, target, true))
            return true
        },
    })

    //-unally [player]
    registerCommand({
        name: 'unally',
        alias: [],
        group: 'all',
        argDescription: 'player',
        description: 'Unally people, prevents you from reviving them',
        cb: ({ param1 }, escaper) => {
            resolvePlayerIds(param1, target => setAlliedState(escaper, target, false))
            return true
        },
    })

    //-hideChat(hc)
    registerCommand({
        name: 'hideChat',
        alias: ['hc', 'monk'],
        group: 'all',
        argDescription: 'on | off',
        description: 'hides the chat',
        cb: ({ param1 }, escaper) => {
            if (!param1) param1 = 'true'

            if (IsBoolString(param1)) {
                const frame = BlzGetOriginFrame(ORIGIN_FRAME_CHAT_MSG, 0)

                if (GetLocalPlayer() === escaper.getPlayer()) {
                    BlzFrameSetVisible(frame, !S2B(param1))
                }

                Text.mkP(escaper.getPlayer(), `Chat ${!S2B(param1) ? 'shown' : 'hidden'}`)
            }

            return true
        },
    })
}
