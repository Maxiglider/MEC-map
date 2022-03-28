import { CommandExecution } from '../../06_COMMANDS/COMMANDS_vJass/Command_execution'
import { Escaper } from './Escaper'

const initEscaperSavedCommands = () => {
    const savedCommands: hashtable = InitHashtable()

    const execute = (escaper: Escaper, commandName: string): boolean => {
        const cmd = LoadStr(savedCommands, escaper, StringHash(commandName))

        if (cmd == null) {
            return false
        } else {
            CommandExecution.ExecuteCommand(escaper, cmd)
        }

        return true
    }

    return { execute }
}

export const EscaperSavedCommands = initEscaperSavedCommands()
