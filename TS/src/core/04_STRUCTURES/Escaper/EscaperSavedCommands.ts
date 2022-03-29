import { CommandExecution } from '../../06_COMMANDS/COMMANDS_vJass/Command_execution'
import { Escaper } from './Escaper'

const initEscaperSavedCommands = () => {
    const savedCommands = InitHashtable()

    const newCmd = (escaper: Escaper, commandName: string, command: string) => {
        SaveStr(savedCommands, escaper, StringHash(commandName), command)
    }

    const execute = (escaper: Escaper, commandName: string): boolean => {
        const cmd = LoadStr(savedCommands, escaper, StringHash(commandName))

        if (cmd == null) {
            return false
        } else {
            CommandExecution.ExecuteCommand(escaper, cmd)
        }

        return true
    }

    return { savedCommands, newCmd, execute }
}

export const EscaperSavedCommands = initEscaperSavedCommands()
