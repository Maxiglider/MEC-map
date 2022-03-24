import { IEscaper } from './Escaper'

export const EscaperSavedCommands = () => {
    const savedCommands: hashtable = InitHashtable()

    const execute = (escaper: IEscaper, commandName: string): boolean => {
        const cmd = LoadStr(savedCommands, escaper, StringHash(commandName))

        if (cmd == null) {
            return false
        } else {
            ExecuteCommand(escaper, cmd)
        }

        return true
    }
}
