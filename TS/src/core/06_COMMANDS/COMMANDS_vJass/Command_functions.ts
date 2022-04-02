import { NB_PLAYERS_MAX } from 'core/01_libraries/Constants'

const initCommandsFunctions = () => {
    //gives the name of the entered command  ////the name of the entered command is <command_name>
    const CmdName = (str: string): string => {
        let length = StringLength(str)
        let outputStr = ''
        let car: string
        let i = 0

        if (SubString(str, 0, 1) === '-' && length > 1) {
            car = SubString(str, 1, 2)
            i = 1
            while (true) {
                if (i >= length || car === ' ') break
                outputStr = outputStr + car
                i = i + 1
                car = SubString(str, i, i + 1)
            }
        }
        if (StringLength(outputStr) >= 1) {
            return outputStr
        }

        return ''
    }

    const IsCmd = (str: string): boolean => {
        return CmdName(str) !== null
    }

    //gives the parameter number 'paramNumber' of the entered command : <paramX>
    const CmdParam = (str: string, paramNumber: number): string => {
        let length = StringLength(str)
        let nameLength = StringLength(CmdName(str))
        let outputStr: string = ''
        let char: string
        let i = 0
        let currentParamNumber = 1
        let lastSpaceFound_pos = nameLength + 2

        if (!IsCmd(str)) {
            return ''
        }

        i = lastSpaceFound_pos + 1

        if (paramNumber === 0) {
            return SubStringBJ(str, i, length)
        }

        while (true) {
            if (currentParamNumber === paramNumber || i > length) break
            char = SubStringBJ(str, i, i)
            if (char === ' ' && i - 1 === lastSpaceFound_pos) {
                return ''
            }
            if (char === ' ') {
                lastSpaceFound_pos = i
                currentParamNumber = currentParamNumber + 1
            }
            i = i + 1
        }

        if (currentParamNumber === paramNumber) {
            while (true) {
                if (i > length) break
                char = SubStringBJ(str, i, i)
                if (char === ' ') break
                outputStr = outputStr + char
                i = i + 1
            }
            return outputStr
        }
        return ''
    }

    const NbParam = (str: string): number => {
        let i = 1
        while (true) {
            if (CmdParam(str, i) === null) break
            i = i + 1
        }
        return i - 1
    }

    const NoParam = (str: string): boolean => {
        return CmdParam(str, 0) === null
    }

    const IsColorString = (colorString: string): boolean => {
        return ColorString2Id(colorString) >= 0
    }

    const IsPlayerColorString = (colorString: string): boolean => {
        return ColorString2Id(colorString) >= 0 && ColorString2Id(colorString) <= NB_PLAYERS_MAX
    }

    return { CmdName, IsCmd, CmdParam, NbParam, NoParam, IsColorString, IsPlayerColorString }
}

export const CommandsFunctions = initCommandsFunctions()
