import { Escaper } from './Escaper'



const savedCommands: (Map<string, string>)[] = []

export const newCmd = (escaper: Escaper, commandName: string, command: string) => {
    savedCommands[escaper.getEscaperId()].set(commandName, command)
}


export const commandsBuffer: {
    escaper: Escaper,
    cmd: string
}[] = []


export const execute = (escaper: Escaper, commandName: string, directCommand = false): boolean => {
    let cmd: string | undefined

    if (directCommand) {
        cmd = commandName
    } else {
        cmd = savedCommands[escaper.getEscaperId()].get(commandName)
    }

    if (!cmd) {
        return false
    } else {
        commandsBuffer.push({
            escaper, cmd
        })
    }

    return true
}
