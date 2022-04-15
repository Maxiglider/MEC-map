import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { createTimer, forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'
import { rawPlayerNames } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
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

const initMultiboard = () => {
    let board: multiboard | null

    const playerScores: {
        [x: number]: {
            score: number
            saves: number
            deaths: number
            rowIndex: number
        }
    } = {}

    let amountOfEscapers = 0

    forRange(NB_ESCAPERS, i => {
        playerScores[i] = { score: 0, saves: 0, deaths: 0, rowIndex: -1 }
    })

    const initMultiboard = (reinit: boolean) => {
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

        // TODO; Store visible state on escaper and check if its open to retrigger this, we have to retrigger eitherway or the width doesn't update
        MultiboardMinimizeBJ(false, board)
        updateMultiboard()
    }

    const reinitMultiboard = () => {
        board && DestroyMultiboard(board)
        initMultiboard(true)
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

    const updatePlayerStats = (playerId: number) => {
        if (!board) return

        MultiboardSetItemValueBJ(
            board,
            2,
            playerScores[playerId].rowIndex,
            udg_colorCode[playerId] + playerScores[playerId].score
        )

        MultiboardSetItemValueBJ(
            board,
            3,
            playerScores[playerId].rowIndex,
            udg_colorCode[playerId] + playerScores[playerId].saves
        )

        MultiboardSetItemValueBJ(
            board,
            4,
            playerScores[playerId].rowIndex,
            udg_colorCode[playerId] + playerScores[playerId].deaths
        )
    }

    const updateMultiboard = () => {
        if (!board) return

        updateGametime(false)
        // Not updating Lives cuz circular dependency

        let rowIndex = 0
        for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
            if (escaper.isEscaperSecondary()) {
                continue
            }

            const playerId = escaper.getEscaperId()

            playerScores[playerId].rowIndex = 4 + rowIndex

            MultiboardSetItemValueBJ(
                board,
                1,
                playerScores[playerId].rowIndex,
                udg_colorCode[playerId] + GetPlayerName(escaper.getPlayer())
            )

            updatePlayerStats(playerId)
            rowIndex++
        }
    }

    const setVisibility = (visible: boolean) => {
        if (!board) return

        MultiboardMinimizeBJ(!visible, board)
    }

    const increasePlayerScore = (playerId: number, score: 'saves' | 'deaths') => {
        playerScores[playerId][score]++
        playerScores[playerId].score = playerScores[playerId].saves - playerScores[playerId].deaths

        updatePlayerStats(playerId)
    }

    // Multiboard won't show if its loaded too early
    createTimer(2, false, () => {
        initMultiboard(false)
        amountOfEscapers = getUdgEscapers().countMain()
        createTimer(1, true, () => updateGametime(true))
    })

    return { setVisibility, increasePlayerScore, updateLives }
}

export const Multiboard = initMultiboard()
