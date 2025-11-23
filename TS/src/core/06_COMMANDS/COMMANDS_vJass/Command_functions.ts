import { MemoryHandler } from 'Utils/MemoryHandler'
import { forRange } from 'Utils/mapUtils'
import { arrayPush, stringReplaceAll } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS, NB_PLAYERS_MAX, NB_PLAYERS_MAX_REFORGED } from 'core/01_libraries/Constants'
import { ColorString2Id } from 'core/01_libraries/Init_colorCodes'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { getUdgEscapers } from '../../../../globals'

export const rawPlayerNames: string[] = []

const cachedPlayerNames: { [x: string]: number } = {}

export const removeHash = (name: string) => {
    const i = name.indexOf('#')

    if (i === -1) {
        return name
    }

    return name.substring(0, i)
}

export const initCachedPlayerNames = () => {
    forRange(24, i => {
        cachedPlayerNames[removeHash(stringReplaceAll(' ', '_', GetPlayerName(Player(i)).toLowerCase()))] = i
        rawPlayerNames.push(GetPlayerName(Player(i)))
    })
}

//gives the name of the entered command  ////the name of the entered command is <command_name>
export const CmdName = (str: string): string => {
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

export const IsCmd = (str: string): boolean => {
    return CmdName(str) !== ''
}

//gives the parameter number 'paramNumber' of the entered command : <paramX>
export const CmdParam = (str: string, paramNumber: number): string => {
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

export const NbParam = (str: string): number => {
    let i = 1
    while (CmdParam(str, i) !== '') {
        i = i + 1
    }
    return i - 1
}

export const NoParam = (str: string): boolean => {
    return CmdParam(str, 0) === ''
}

export const IsColorString = (colorString: string): boolean => {
    return ColorString2Id(colorString) >= 0
}

export const IsPlayerColorString = (colorString: string): boolean => {
    return ColorString2Id(colorString) >= 0 && ColorString2Id(colorString) <= NB_PLAYERS_MAX
}

export const isPlayerId = (arg: string) => {
    try {
        return !!resolvePlayerId(arg)
    } catch {
        return false
    }
}

const blzColors2ids = new Map<playercolor, number>()

for (let i = 0; i < NB_PLAYERS_MAX_REFORGED; i++) {
    blzColors2ids.set(ConvertPlayerColor(i), i)
}

export const BlzColor2Id = (color: playercolor) => {
    return blzColors2ids.get(color)
}

export function colorId2playerId(colorId: number) {
    for (let i = 0; i < NB_PLAYERS_MAX; i++) {
        if (BlzColor2Id(GetPlayerColor(Player(i))) == colorId) {
            return i
        }
    }

    return -1
}

export function playerId2colorId(playerId: number) {
    return BlzColor2Id(GetPlayerColor(Player(playerId))) || -1
}

export const resolvePlayerId = (arg: string) => {
    const larg = arg.toLowerCase()
    let targetPlayer = -1

    if (larg === 's' || larg === 'sel' || larg === 'select' || larg === 'selected') {
        const a = (getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()))?.getSelectedPlayerId() || 0) + 1

        if (a > 0 && a <= NB_ESCAPERS) {
            targetPlayer = a - 1
        }
    } else if (IsPlayerColorString(larg)) {
        targetPlayer = colorId2playerId(ColorString2Id(larg))
    } else if (S2I(larg) !== 0) {
        const a = S2I(larg)

        if (a > 0 && a <= NB_ESCAPERS) {
            targetPlayer = colorId2playerId(a - 1)
        }
    } else if (cachedPlayerNames[removeHash(larg)]) {
        return cachedPlayerNames[removeHash(larg)]
    } else if (removeHash(larg).length > 3) {
        const m = MemoryHandler.getEmptyArray<number>()

        for (const [playerName, playerId] of pairs(cachedPlayerNames)) {
            if (playerName.toString().includes(removeHash(larg))) {
                m.push(playerId)
            }
        }

        if (m.length === 1) {
            const playerId = m[0]
            MemoryHandler.destroyArray(m)
            return playerId
        }

        MemoryHandler.destroyArray(m)
    }

    if (targetPlayer === -1) {
        throw `Invalid player: '${arg}'`
    }

    return targetPlayer
}

export const resolvePlayerIdsArray = (arg: string) => {
    const larg = arg.toLowerCase()
    const escapers = MemoryHandler.getEmptyArray<Escaper>()

    if (larg === 'a' || larg === 'all') {
        for (let i = 0; i < NB_ESCAPERS; i++) {
            const escaper = getUdgEscapers().get(i)

            if (escaper) {
                arrayPush(escapers, escaper)
            }
        }
    } else if (larg === 'ai' || larg === 'computer' || larg === 'computers') {
        for (let i = 0; i < NB_ESCAPERS; i++) {
            const escaper = getUdgEscapers().get(i)

            if (
                escaper &&
                GetPlayerSlotState(Player(i)) === PLAYER_SLOT_STATE_PLAYING &&
                GetPlayerController(Player(i)) === MAP_CONTROL_COMPUTER
            ) {
                arrayPush(escapers, escaper)
            }
        }
    } else if (larg === 'gamer' || larg === 'gamers' || larg === 'player' || larg === 'players') {
        for (let i = 0; i < NB_ESCAPERS; i++) {
            const escaper = getUdgEscapers().get(i)

            if (
                escaper &&
                GetPlayerSlotState(Player(i)) === PLAYER_SLOT_STATE_PLAYING &&
                GetPlayerController(Player(i)) === MAP_CONTROL_USER
            ) {
                arrayPush(escapers, escaper)
            }
        }
    } else if (isPlayerId(arg)) {
        const escaper = getUdgEscapers().get(resolvePlayerId(arg))

        if (escaper) {
            arrayPush(escapers, escaper)
        }
    } else {
        throw `Invalid player: '${arg}'`
    }

    return escapers
}

export const resolvePlayerIds = (arg: string, cb: (targetPlayer: Escaper) => void) => {
    const escapers = resolvePlayerIdsArray(arg)

    for (const escaper of escapers) {
        cb(escaper)
    }

    escapers.__destroy()
}
