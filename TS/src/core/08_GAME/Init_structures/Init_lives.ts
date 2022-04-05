import { Lives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { createTimer } from 'Utils/mapUtils'
import { ILives } from '../../04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'

const state: { udgLives: ILives } = {
    udgLives: null as any,
}

export const getUdgLives = () => state.udgLives

export const InitTrig_Init_lives = () => {
    createTimer(0.0001, false, () => (state.udgLives = Lives()))
}
