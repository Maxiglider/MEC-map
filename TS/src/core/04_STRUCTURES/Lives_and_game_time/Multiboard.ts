import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { ServiceManager } from 'Services'
import { ArrayHandler } from 'Utils/ArrayHandler'
import { createTimer, forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'
import { rawPlayerNames } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { Escaper } from '../Escaper/Escaper'
import { GameTime } from './Time_of_game_trigger'

// Column and row start at index 1

const getLongestNameWidth = () => {
    let nameWidth = 5

    for (const playerName of rawPlayerNames) {
        if (playerName.length > nameWidth) {
            nameWidth = playerName.length
        }
    }

    return nameWidth / 2 + 3
}

export type IMultiboard = ReturnType<typeof initMultiboard>

export const initMultiboard = () => {
    let board: multiboard | null

    const playerScores: {
        [x: number]: {
            score: number
            saves: number
            deaths: number
        }
    } = {}

    let amountOfEscapers = 0

    forRange(NB_ESCAPERS, i => {
        playerScores[i] = { score: 0, saves: 0, deaths: 0 }
    })

    const initMultiboard = () => {
        const cols = 4
        const rows = 3 + getUdgEscapers().countMain()

        const nameWidth = getLongestNameWidth()

        board = CreateMultiboardBJ(cols, rows, 'Scoreboard')

        for (let col = 1; col <= cols; col++) {
            for (let row = 1; row <= rows; row++) {
                MultiboardSetItemStyleBJ(board, col, row, true, false)

                if (col === 1) {
                    if (row <= 2) {
                        // Header
                        MultiboardSetItemWidthBJ(board, col, row, 15)
                    } else {
                        // Players
                        MultiboardSetItemWidthBJ(board, col, row, nameWidth)
                    }
                } else {
                    MultiboardSetItemWidthBJ(board, col, row, 4)
                }
            }
        }

        MultiboardSetItemValueBJ(board, 1, 3, 'Player Name')
        MultiboardSetItemValueBJ(board, 2, 3, 'Score')
        MultiboardSetItemValueBJ(board, 3, 3, 'Saves')
        MultiboardSetItemValueBJ(board, 4, 3, 'Deaths')

        // Toggle visiblity to update multiboard width
        getUdgEscapers().forMainEscapers(escaper => setVisibility(escaper, true))

        updateMultiboard()
    }

    const reinitMultiboard = () => {
        board && DestroyMultiboard(board)
        initMultiboard()
    }

    const updateLives = (lives: number) => {
        if (!board) return

        MultiboardSetItemValueBJ(board, 1, 1, `|Cfffed312Lives: ${lives}`)
    }

    const updateGametime = (reinitCheck: boolean) => {
        if (!board) return

        if (reinitCheck) {
            const currentCount = getUdgEscapers().countMain()

            if (currentCount !== amountOfEscapers) {
                reinitMultiboard()
                amountOfEscapers = currentCount
            }
        }

        MultiboardSetItemValueBJ(board, 1, 2, `|Cfffed312Game time: ${GameTime.getGameTime()}`)
    }

    const playerSort = (a: Escaper, b: Escaper) => {
        return playerScores[GetPlayerId(a.getPlayer())].score > playerScores[GetPlayerId(b.getPlayer())].score
    }

    const updatePlayers = () => {
        if (!board) return

        let rowIndex = 0

        const sortedArray = ArrayHandler.getNewArray<Escaper>()

        for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
            sortedArray.push(escaper)
        }

        table.sort(sortedArray, playerSort)

        for (const escaper of sortedArray) {
            if (escaper.isEscaperSecondary()) {
                continue
            }

            const playerId = escaper.getEscaperId()
            const playerName = GetPlayerName(escaper.getPlayer())

            MultiboardSetItemValueBJ(board, 1, 4 + rowIndex, udg_colorCode[playerId] + playerName)
            MultiboardSetItemValueBJ(board, 2, 4 + rowIndex, udg_colorCode[playerId] + playerScores[playerId].score)
            MultiboardSetItemValueBJ(board, 3, 4 + rowIndex, udg_colorCode[playerId] + playerScores[playerId].saves)
            MultiboardSetItemValueBJ(board, 4, 4 + rowIndex, udg_colorCode[playerId] + playerScores[playerId].deaths)

            rowIndex++
        }

        ArrayHandler.clearArray(sortedArray)
    }

    const updateMultiboard = () => {
        if (!board) return

        updateGametime(false)
        updateLives(ServiceManager.getService('Lives').get())

        updatePlayers()
    }

    const setVisibility = (escaper: Escaper, visible: boolean) => {
        if (!board) return

        if (GetLocalPlayer() === escaper.getPlayer()) {
            MultiboardMinimizeBJ(escaper.hideLeaderboard || !visible, board)
        }
    }

    const increasePlayerScore = (playerId: number, score: 'saves' | 'deaths') => {
        playerScores[playerId][score]++
        playerScores[playerId].score = playerScores[playerId].saves - playerScores[playerId].deaths

        updatePlayers()
    }

    // Multiboard won't show if its loaded too early
    createTimer(2, false, () => {
        initMultiboard()
        amountOfEscapers = getUdgEscapers().countMain()
        createTimer(1, true, () => updateGametime(true))
    })

    return { setVisibility, increasePlayerScore, updateLives }
}
