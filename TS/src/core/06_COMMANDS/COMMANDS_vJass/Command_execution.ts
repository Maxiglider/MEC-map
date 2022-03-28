import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { Globals } from 'core/09_From_old_Worldedit_triggers/globals_variables_and_triggers'
import { createEvent, forRange } from 'Utils/mapUtils'
import { CommandMax } from './Command_admin'
import { CommandCheat } from './Command_cheat'
import { CommandRed } from './Command_first_player'
import { CommandsFunctions } from './Command_functions'
import { CommandMake } from './Command_make'
import { CommandTrueMax } from './Command_superadmin'

export const initCommandExecution = () => {
    const ExecuteCommandSingle = (escaper: Escaper, cmd: string) => {
        if (!ExecuteCommandAll(escaper, cmd)) {
            if (!((escaper.getPlayer() == Player(0) && Globals.udg_areRedRightsOn) || escaper.canCheat())) {
                Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                return
            }
            if (!CommandRed.ExecuteCommandRed(escaper, cmd)) {
                if (!escaper.canCheat()) {
                    Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                    return
                }
                if (!CommandCheat.ExecuteCommandCheat(escaper, cmd)) {
                    if (!CommandMake.ExecuteCommandMake(escaper, cmd)) {
                        if (!escaper.isMaximaxou()) {
                            Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                            return
                        }
                        if (!CommandMax.ExecuteCommandMax(escaper, cmd)) {
                            if (!escaper.isTrueMaximaxou()) {
                                Text.erP(escaper.getPlayer(), 'unknown command or not enough rights')
                                return
                            }
                            if (!CommandTrueMax.ExecuteCommandTrueMax(escaper, cmd)) {
                                Text.erP(escaper.getPlayer(), 'unknown command')
                            }
                        }
                    }
                }
            }
        }
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

    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerChatEvent(t, Player(i), '-', false))],
        actions: [
            () => {
                if (!CommandsFunctions.IsCmd(GetEventPlayerChatString())) {
                    return
                }

                ExecuteCommand(udg_escapers.get(GetPlayerId(GetTriggerPlayer())), GetEventPlayerChatString())
            },
        ],
    })
}
