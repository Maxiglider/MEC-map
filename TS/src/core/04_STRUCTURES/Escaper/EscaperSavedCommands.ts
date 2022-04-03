import { Escaper } from './Escaper'
import {ExecuteCommand} from "../../06_COMMANDS/COMMANDS_vJass/Command_execution";



const savedCommands: (Map<string, string>)[] = []

export const newCmd = (escaper: Escaper, commandName: string, command: string) => {
    savedCommands[escaper.getEscaperId()].set(commandName, command)
}

export const execute = (escaper: Escaper, commandName: string): boolean => {
    const cmd = savedCommands[escaper.getEscaperId()].get(commandName)

    if (!cmd) {
        return false
    } else {
        ExecuteCommand(escaper, cmd)
    }

    return true
}
