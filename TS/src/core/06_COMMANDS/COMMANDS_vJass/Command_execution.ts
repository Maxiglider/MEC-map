import {Text} from 'core/01_libraries/Text'
import {Escaper} from 'core/04_STRUCTURES/Escaper/Escaper'
 import { getUdgEscapers } from '../../../../globals'

import {Globals} from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import {createEvent, forRange} from 'Utils/mapUtils'
import {ExecuteCommandRed} from "./Command_first_player";
import {ExecuteCommandAll} from "./Command_all";
import {ExecuteCommandCheat} from "./Command_cheat";
import {ExecuteCommandMax} from "./Command_admin";
import {ExecuteCommandTrueMax} from "./Command_superadmin";
import {IsCmd} from "./Command_functions";
import {ExecuteCommandMake} from "./Command_make";
import {commandsBuffer} from "../../04_STRUCTURES/Escaper/EscaperSavedCommands";
import {NB_PLAYERS_MAX} from "../../01_libraries/Constants";


const ExecuteCommandSingle = (escaper: Escaper, cmd: string) => {
    if (!ExecuteCommandAll(escaper, cmd)) {
        if (!((escaper.getPlayer() == Player(0) && Globals.udg_areRedRightsOn) || escaper.canCheat())) {
            Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
            return
        }
        if (!ExecuteCommandRed(escaper, cmd)) {
            if (!escaper.canCheat()) {
                Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                return
            }
            if (!ExecuteCommandCheat(escaper, cmd)) {
                if (!ExecuteCommandMake(escaper, cmd)) {
                    if (!escaper.isMaximaxou()) {
                        Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                        return
                    }
                    if (!ExecuteCommandMax(escaper, cmd)) {
                        if (!escaper.isTrueMaximaxou()) {
                            Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                            return
                        }
                        if (!ExecuteCommandTrueMax(escaper, cmd)) {
                            Text.erP(escaper.getPlayer(), 'unknown command')
                        }
                    }
                }
            }
        }
    }
}

export const ExecuteCommand = (escaper: Escaper, cmd: string) => {
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
            singleCommands[singleCommandId] = singleCommands[singleCommandId] + char
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


export const init_commandExecution = () => {
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


//Handle buffer of commands
    createEvent({ //todomax find a better solution than a periodic timer
        events: [t => TriggerRegisterTimerEvent(t, 0.001, true)],
        actions: [
            () => {
                if (commandsBuffer.length > 0) {
                    commandsBuffer.map(command => {
                        ExecuteCommand(command.escaper, command.cmd)
                    })

                    commandsBuffer.length = 0
                }
            }
        ]
    })
}
