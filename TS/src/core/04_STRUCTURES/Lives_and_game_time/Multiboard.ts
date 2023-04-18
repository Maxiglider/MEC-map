import { ServiceManager } from 'Services'
import { ArrayHandler } from 'Utils/ArrayHandler'
import { literalArray } from 'Utils/ArrayUtils'
import { createTimer, forRange } from 'Utils/mapUtils'
import { ucfirst } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS, PURPLE, RED } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { playerId2colorId, rawPlayerNames } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { Escaper } from '../Escaper/Escaper'
import { LIVES_PLAYER } from './Lives_and_game_time'
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

type IBoardMode = 'multiboard' | 'leaderboard'

type IStatsMode = typeof statsModes[0]
const statsModes = literalArray(['global', 'current'])

export type IMultiboard = ReturnType<typeof initMultiboard>

export const initMultiboard = () => {
    let mb: multiboard | null
    let lb: leaderboard | null

    const playerScores: {
        [x: number]: {
            stats: {
                [K in IStatsMode]: {
                    score: number
                    saves: number
                    deaths: number
                    points: number
                }
            }
            mode: IBoardMode
            statsMode: IStatsMode
            visible: boolean
        }
    } = {}

    let amountOfEscapers = 0
    let pointsEnabled = false

    forRange(NB_ESCAPERS, i => {
        playerScores[i] = {
            stats: {
                global: { score: 0, saves: 0, deaths: 0, points: 0 },
                current: { score: 0, saves: 0, deaths: 0, points: 0 },
            },
            mode: 'multiboard',
            statsMode: 'global',
            visible: true,
        }
    })

    const resetRoundScores = () => {
        forRange(NB_ESCAPERS, i => {
            playerScores[i].stats.current.score = 0
            playerScores[i].stats.current.saves = 0
            playerScores[i].stats.current.deaths = 0
            playerScores[i].stats.current.points = 0
        })

        GameTime.current.resetGameTime()

        reinitBoards()
        amountOfEscapers = getUdgEscapers().countMain()
    }

    const initMultiboard = () => {
        const cols = 4 + (pointsEnabled ? 1 : 0)
        const rows = 3 + getUdgEscapers().countMain()

        const nameWidth = getLongestNameWidth()

        mb = CreateMultiboardBJ(cols, rows, `Scoreboard - Global`)

        for (let col = 1; col <= cols; col++) {
            for (let row = 1; row <= rows; row++) {
                MultiboardSetItemStyleBJ(mb, col, row, true, false)

                if (col === 1) {
                    if (row <= 2) {
                        // Header
                        MultiboardSetItemWidthBJ(mb, col, row, 15)
                    } else {
                        // Players
                        MultiboardSetItemWidthBJ(mb, col, row, nameWidth)
                    }
                } else {
                    MultiboardSetItemWidthBJ(mb, col, row, 4)
                }
            }
        }

        MultiboardSetItemValueBJ(mb, 1, 3, 'Player Name')
        MultiboardSetItemValueBJ(mb, 2, 3, 'Score')
        MultiboardSetItemValueBJ(mb, 3, 3, 'Saves')
        MultiboardSetItemValueBJ(mb, 4, 3, 'Deaths')
        pointsEnabled && MultiboardSetItemValueBJ(mb, 5, 3, 'Points')
    }

    const initLeaderboard = () => {
        // Disabled leaderboard for full -ui support; causes desyncs when used together since they're bound to the same frame and they're both overwriting eachother
        //
        // lb = CreateLeaderboardBJ(GetPlayersAll(), '')
        // LeaderboardAddItemBJ(Player(0), lb, 'Game time', 0)
        // LeaderboardSetPlayerItemStyleBJ(Player(0), lb, true, false, false)
        // LeaderboardAddItemBJ(LIVES_PLAYER, lb, 'Lives', 0)
    }

    const getOrCreateLeaderboard = () => {
        if (lb) return lb

        initLeaderboard()
        return lb!
    }

    const destroyBoards = () => {
        if (mb) {
            DestroyMultiboard(mb)
            mb = null
        }

        if (lb) {
            DestroyLeaderboard(lb)
            lb = null
        }
    }

    const reinitBoards = () => {
        // Hide boards to reset position
        getUdgEscapers().forMainEscapers(escaper => updateVisibility(escaper, false))

        destroyBoards()

        initMultiboard()
        initLeaderboard()

        // Toggle visibility to update board width
        getUdgEscapers().forMainEscapers(escaper => updateVisibility(escaper, true))

        // Restore player visibility state
        getUdgEscapers().forMainEscapers(escaper => {
            updateVisibility(escaper, playerScores[GetPlayerId(escaper.getPlayer())].visible)
        })

        updateBoards()
    }

    const updateLives = (lives: number) => {
        mb && MultiboardSetItemValueBJ(mb, 1, 1, `${udg_colorCode[6]}Lives: ${lives}`)
        lb && LeaderboardSetPlayerItemValueBJ(LIVES_PLAYER, lb, lives)
    }

    const updateGametime = (reinitCheck: boolean) => {
        if (reinitCheck) {
            const currentCount = getUdgEscapers().countMain()

            if (currentCount !== amountOfEscapers) {
                reinitBoards()
                amountOfEscapers = currentCount
            }
        }

        const globalGameTimeStr = GameTime.global.getGameTime()
        const currentGameTimeStr = GameTime.current.getGameTime()

        for (let i = 0; i < NB_ESCAPERS; i++) {
            if (GetLocalPlayer() === Player(i)) {
                const statsMode = playerScores[i].statsMode

                if (statsMode === 'current') {
                    mb && MultiboardSetItemValueBJ(mb, 1, 2, `|Cfffed312Game time: ${currentGameTimeStr}`)
                    lb && LeaderboardSetPlayerItemLabelBJ(Player(0), lb, `|Cfffed312Game time: ${currentGameTimeStr}`)
                } else if (statsMode === 'global') {
                    mb && MultiboardSetItemValueBJ(mb, 1, 2, `|Cfffed312Game time: ${globalGameTimeStr}`)
                    lb && LeaderboardSetPlayerItemLabelBJ(Player(0), lb, `|Cfffed312Game time: ${globalGameTimeStr}`)
                }
            }
        }
    }

    const playerSortGlobal = (a: Escaper, b: Escaper) => {
        const scoreA = playerScores[GetPlayerId(a.getPlayer())].stats.global.score
        const scoreB = playerScores[GetPlayerId(b.getPlayer())].stats.global.score

        if (scoreA === scoreB) {
            return GetPlayerId(a.getPlayer()) < GetPlayerId(b.getPlayer())
        } else {
            return scoreA > scoreB
        }
    }

    const playerSortCurrent = (a: Escaper, b: Escaper) => {
        const scoreA = playerScores[GetPlayerId(a.getPlayer())].stats.current.score
        const scoreB = playerScores[GetPlayerId(b.getPlayer())].stats.current.score

        if (scoreA === scoreB) {
            return GetPlayerId(a.getPlayer()) < GetPlayerId(b.getPlayer())
        } else {
            return scoreA > scoreB
        }
    }

    const updatePlayers = () => {
        if (!mb) return

        let rowIndex = 0

        const sortedArray = ArrayHandler.getNewArray<Escaper>()

        for (const [_, escaper] of pairs(getUdgEscapers().getAll())) {
            sortedArray.push(escaper)
        }

        for (let i = 0; i < NB_ESCAPERS; i++) {
            if (GetLocalPlayer() === Player(i)) {
                const statsMode = playerScores[i].statsMode

                if (statsMode === 'current') {
                    table.sort(sortedArray, playerSortCurrent)
                } else if (statsMode === 'global') {
                    table.sort(sortedArray, playerSortGlobal)
                }

                for (const escaper of sortedArray) {
                    if (escaper.isEscaperSecondary()) {
                        continue
                    }

                    const playerId = escaper.getEscaperId()
                    const playerName = escaper.getDisplayName()

                    const colorCode = udg_colorCode[playerId2colorId(playerId)]
                    const playerScore = playerScores[playerId].stats[statsMode]

                    MultiboardSetItemValueBJ(mb, 1, 4 + rowIndex, colorCode + playerName)
                    MultiboardSetItemValueBJ(mb, 2, 4 + rowIndex, colorCode + playerScore.score)
                    MultiboardSetItemValueBJ(mb, 3, 4 + rowIndex, colorCode + playerScore.saves)
                    MultiboardSetItemValueBJ(mb, 4, 4 + rowIndex, colorCode + playerScore.deaths)
                    pointsEnabled && MultiboardSetItemValueBJ(mb, 5, 4 + rowIndex, colorCode + playerScore.points)

                    rowIndex++
                }
            }
        }

        ArrayHandler.clearArray(sortedArray)
    }

    const updateBoards = () => {
        updateGametime(false)
        updateLives(ServiceManager.getService('Lives').get())

        updatePlayers()
    }

    const setVisibility = (escaper: Escaper, visible: boolean) => {
        playerScores[GetPlayerId(escaper.getPlayer())].visible = visible
        updateVisibility(escaper, visible)
    }

    const updateVisibility = (escaper: Escaper, visible: boolean) => {
        const playerMode = playerScores[GetPlayerId(escaper.getPlayer())]

        if (GetLocalPlayer() === escaper.getPlayer()) {
            mb &&
                MultiboardSetTitleText(
                    mb,
                    `Scoreboard - ${ucfirst(playerMode.statsMode)}` +
                        (getUdgLevels().isNoobEdit() ? ' - ' + udg_colorCode[RED] + 'Noobedit' + '|r' : '') +
                        (getUdgLevels().isSpeedEdit() ? ' - ' + udg_colorCode[PURPLE] + 'SPEED' + '|r' : '')
                )

            mb && MultiboardDisplay(mb, !escaper.hideLeaderboard && playerMode.mode === 'multiboard' && visible)
            lb && LeaderboardDisplay(lb, !escaper.hideLeaderboard && playerMode.mode === 'leaderboard' && visible)
        }
    }

    const setMode = (escaper: Escaper, mode: IBoardMode) => {
        playerScores[GetPlayerId(escaper.getPlayer())].mode = mode

        setVisibility(escaper, true)
    }

    const setStatsMode = (escaper: Escaper, statsMode: IStatsMode) => {
        playerScores[GetPlayerId(escaper.getPlayer())].statsMode = statsMode

        updatePlayers()

        setVisibility(escaper, true)
    }

    const increasePlayerScore = (playerId: number, score: 'saves' | 'deaths') => {
        for (const statsMode of statsModes) {
            playerScores[playerId].stats[statsMode][score]++
            playerScores[playerId].stats[statsMode].score =
                playerScores[playerId].stats[statsMode].saves - playerScores[playerId].stats[statsMode].deaths
        }

        updatePlayers()
    }

    const setPointsEnabled = (enabled: boolean) => {
        pointsEnabled = enabled

        updatePlayers()
    }

    const adjustPlayerPoints = (playerId: number, points: number) => {
        for (const statsMode of statsModes) {
            playerScores[playerId].stats[statsMode].points += points
        }

        updatePlayers()
    }

    const setPlayerPoints = (playerId: number, points: number) => {
        for (const statsMode of statsModes) {
            playerScores[playerId].stats[statsMode].points = points
        }

        updatePlayers()
    }

    createTimer(1, true, () => {
        GameTime.global.updateGameTime()
        GameTime.current.updateGameTime()

        updateGametime(true)
    })

    return {
        setVisibility,
        setMode,
        setStatsMode,
        increasePlayerScore,
        updateLives,
        resetRoundScores,
        getOrCreateLeaderboard,
        reinitBoards,
        setPointsEnabled,
        adjustPlayerPoints,
        setPlayerPoints,
    }
}
