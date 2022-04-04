import { NB_LIVES_AT_BEGINNING } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { getUdgLevels } from "../../../../globals"


const LIVES_PLAYER = Player(6) //GREEN

export type ILives = ReturnType<typeof Lives>

export const Lives = () => {
    let nb = getUdgLevels().get(0)?.getNbLives() || NB_LIVES_AT_BEGINNING
    let lb: leaderboard

    const init = () => {
        lb = CreateLeaderboardBJ(GetPlayersAll(), '')
        LeaderboardAddItemBJ(Player(0), lb, 'Game time', 0)
        LeaderboardSetPlayerItemStyleBJ(Player(0), lb, true, false, false)
        LeaderboardAddItemBJ(LIVES_PLAYER, lb, 'Lives :', nb)
        display(true)
    }

    //leaderboard methods
    const display = (show: boolean) => {
        LeaderboardDisplay(lb, show)
    }

    const refresh = () => {
        LeaderboardSetPlayerItemValueBJ(LIVES_PLAYER, lb, nb)
    }

    const getLeaderboard = () => {
        return lb
    }

    const destroy = () => {
        DestroyLeaderboard(lb)
        ;(lb as any) = null
    }

    //lives methods
    const get = () => {
        return nb
    }

    const setNb = (nbLives: number) => {
        let wordLives: string
        if (nbLives < 0) {
            return false
        }
        nb = nbLives
        refresh()

        if (nbLives > 1) {
            wordLives = ' lives.'
        } else {
            wordLives = ' life.'
        }
        Text.A(udg_colorCode[GetPlayerId(LIVES_PLAYER)] + 'You have now ' + I2S(nbLives) + wordLives)
        return true
    }

    const add = (n: number) => {
        let wordLives: string

        if (n > 1) {
            wordLives = ' lives !'
        } else {
            wordLives = ' life.'
        }
        nb = nb + n
        Text.A(udg_colorCode[1] + 'You have earned ' + I2S(n) + wordLives)
        refresh()
    }

    const loseALife = () => {
        nb = nb - 1
        if (nb >= 0) {
            refresh()
        }
    }

    init()

    return { display, refresh, getLeaderboard, destroy, get, setNb, add, loseALife }
}
