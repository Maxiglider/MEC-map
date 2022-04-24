import { catchAndDisplay, Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { createEvent, forRange } from 'Utils/mapUtils'
import { ObjectHandler } from 'Utils/ObjectHandler'
import { getUdgEscapers } from '../../../../globals'
import { NB_PLAYERS_MAX } from '../../01_libraries/Constants'
import { initExecuteCommandMax } from './Command_admin'
import { initCommandAll } from './Command_all'
import { initExecuteCommandCheat } from './Command_cheat'
import { initExecuteCommandRed } from './Command_first_player'
import { CmdName, CmdParam, IsCmd, NbParam, NoParam } from './Command_functions'
import { initExecuteCommandMake } from './Command_make'
import { initExecuteCommandTrueMax } from './Command_superadmin'

export type ICommandExecution = ReturnType<typeof initCommandExecution>

type ICommand = {
    name: string
    alias: string[]
    group: 'all' | 'red' | 'cheat' | 'make' | 'max' | 'truemax'
    argDescription: string
    description: string
    enabled?: (cmd: IParsedCmdContext, escaper: Escaper) => boolean
    cb: (cmd: IParsedCmdContext, escaper: Escaper) => true
}

type IParsedCmdContext = ReturnType<typeof parseCmdContext>

const parseCmdContext = (cmd: string) => {
    const obj = ObjectHandler.getNewObject<{
        cmd: string
        name: string
        noParam: boolean
        nbParam: number
        param1: string
        param2: string
        param3: string
        param4: string
    }>()

    obj.cmd = cmd
    obj.name = CmdName(cmd)
    obj.noParam = NoParam(cmd)
    obj.nbParam = NbParam(cmd)

    obj.param1 = CmdParam(cmd, 1)
    obj.param2 = CmdParam(cmd, 2)
    obj.param3 = CmdParam(cmd, 3)
    obj.param4 = CmdParam(cmd, 4)

    return obj
}

export const initCommandExecution = () => {
    const commands: ICommand[] = []

    const registerCommand = (cmd: ICommand) => {
        commands.push(cmd)
    }

    const accessCheck = (escaper: Escaper, cmd: ICommand) => {
        switch (cmd.group) {
            case 'truemax': {
                if (!escaper.isTrueMaximaxou()) {
                    Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                    return false
                }
            }

            case 'max': {
                if (!escaper.isMaximaxou()) {
                    Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                    return false
                }
            }

            case 'make':
            case 'cheat': {
                if (!escaper.canCheat()) {
                    Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                    return false
                }
            }

            case 'red': {
                if (!((escaper.getPlayer() === Player(0) && Globals.udg_areRedRightsOn) || escaper.canCheat())) {
                    Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                    return false
                }
            }

            case 'all':
            default:
                return true
        }
    }

    const ExecuteCommandSingle = (escaper: Escaper, cmd: string) => {
        catchAndDisplay(() => {
            const parsedContext = parseCmdContext(cmd)

            const targetCmd = commands.find(
                cmd =>
                    (cmd.name.toLowerCase() === parsedContext.name.toLowerCase() ||
                        cmd.alias.find(a => a.toLowerCase() === parsedContext.name.toLowerCase())) &&
                    (cmd.enabled ? cmd.enabled(parsedContext, escaper) : true) &&
                    accessCheck(escaper, cmd)
            )

            targetCmd?.cb(parsedContext, escaper)

            ObjectHandler.clearObject(parsedContext)

            // if (!ExecuteCommandAll(escaper, cmd)) {
            //     if (!((escaper.getPlayer() == Player(0) && Globals.udg_areRedRightsOn) || escaper.canCheat())) {
            //         Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
            //         return
            //     }
            //     if (!ExecuteCommandRed(escaper, cmd)) {
            //         if (!escaper.canCheat()) {
            //             Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
            //             return
            //         }
            //         if (!ExecuteCommandCheat(escaper, cmd)) {
            //             if (!ExecuteCommandMake(escaper, cmd)) {
            //                 if (!escaper.isMaximaxou()) {
            //                     Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
            //                     return
            //                 }
            //                 if (!ExecuteCommandMax(escaper, cmd)) {
            //                     if (!escaper.isTrueMaximaxou()) {
            //                         Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
            //                         return
            //                     }
            //                     if (!ExecuteCommandTrueMax(escaper, cmd)) {
            //                         Text.erP(escaper.getPlayer(), 'unknown command')
            //                     }
            //                 }
            //             }
            //         }
            //     }
            // }
        }, escaper.getPlayer())
    }

    const ExecuteCommand = (escaper: Escaper, cmd: string) => {
        let singleCommands: string[] = []
        let char: string
        let i: number
        let nbParenthesesNonFermees = 0
        let singleCommandId = 0
        let charId: number

        //ex : "-(abc def)" --> "-abc def"
        if (SubStringBJ(cmd, 2, 2) === '(' && SubStringBJ(cmd, StringLength(cmd), StringLength(cmd)) === ')') {
            cmd = SubStringBJ(cmd, 1, 1) + SubStringBJ(cmd, 3, StringLength(cmd) - 1)
        }

        charId = 2
        while (true) {
            if (charId > StringLength(cmd)) break
            char = SubStringBJ(cmd, charId, charId)
            if (char === ',') {
                if (nbParenthesesNonFermees <= 0) {
                    singleCommandId = singleCommandId + 1
                    charId = charId + 1
                }
            } else {
                if (char === '(') {
                    nbParenthesesNonFermees = nbParenthesesNonFermees + 1
                } else {
                    if (char === ')') {
                        nbParenthesesNonFermees = nbParenthesesNonFermees - 1
                    }
                }
            }
            if (char !== ',' || nbParenthesesNonFermees > 0) {
                singleCommands[singleCommandId] = (singleCommands[singleCommandId] || '') + char
            }
            charId = charId + 1
        }
        i = 0
        while (true) {
            if (i > singleCommandId) break
            if (singleCommands[i] !== null && singleCommands[i] !== '') {
                ExecuteCommandSingle(escaper, '-' + singleCommands[i])
            }
            i = i + 1
        }
    }

    createEvent({
        events: [t => forRange(NB_PLAYERS_MAX, i => TriggerRegisterPlayerChatEvent(t, Player(i), '-', false))],
        actions: [
            () => {
                if (!IsCmd(GetEventPlayerChatString())) {
                    return
                }

                const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))

                if (!escaper) {
                    return
                }

                ExecuteCommand(escaper, GetEventPlayerChatString())
            },
        ],
    })

    const initCommands = () => {
        initCommandAll()
        initExecuteCommandRed()
        initExecuteCommandCheat()
        initExecuteCommandMake()
        initExecuteCommandMax()
        initExecuteCommandTrueMax()

        registerCommand({
            name: 'help',
            alias: ['h', '?'],
            group: 'all',
            argDescription: '',
            description: '',
            cb: ({ param1 }) => {
                const filtered = commands.filter(cmd => {
                    return param1
                        ? cmd.name.toLowerCase().indexOf(param1.toLowerCase()) >= 0 ||
                              (cmd.alias &&
                                  cmd.alias.find(alias => alias.toLowerCase().indexOf(param1.toLowerCase()) >= 0))
                        : true
                })

                const s =
                    'Commands:\n' +
                    filtered
                        .map(
                            cmd =>
                                '-' +
                                cmd.name +
                                (cmd.alias.length > 0 ? `(${cmd.alias.join(' | ')})` : '') +
                                (cmd.argDescription.length > 0 ? ' ' + cmd.argDescription : '') +
                                (cmd.description.length > 0 ? ' --> ' + cmd.description : '')
                        )
                        .join('\n')

                Text.P(GetTriggerPlayer(), s)

                return true
            },
        })
    }

    return { registerCommand, ExecuteCommand, initCommands }
}
