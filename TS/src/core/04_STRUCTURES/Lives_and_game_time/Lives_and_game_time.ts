import { NB_LIVES_AT_BEGINNING } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { createTimer } from 'Utils/mapUtils'
import { getUdgLevels } from '../../../../globals'
import { Multiboard } from './Multiboard'

const LIVES_PLAYER = Player(6) //GREEN

const initLives = () => {
    let nb = NB_LIVES_AT_BEGINNING

    const initLives = () => {
        createTimer(3, false, () => {
            nb = getUdgLevels().get(0)?.getNbLives()
            Multiboard.updateLives(nb)
        })
    }

    //lives methods
    const get = () => nb

    const setNb = (nbLives: number) => {
        let wordLives: string
        if (nbLives < 0) {
            return false
        }
        nb = nbLives
        Multiboard.updateLives(nb)

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
        Multiboard.updateLives(nb)
    }

    const loseALife = () => {
        nb = nb - 1
        Multiboard.updateLives(nb)
    }

    return { get, setNb, add, loseALife, initLives }
}

export const Lives = initLives()
