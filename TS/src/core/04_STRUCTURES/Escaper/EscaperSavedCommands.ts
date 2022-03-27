import { CommandExecution } from '../../06_COMMANDS/COMMANDS_vJass/Command_execution'
import { Escaper } from './Escaper'

export const EscaperSavedCommands = () => {
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
