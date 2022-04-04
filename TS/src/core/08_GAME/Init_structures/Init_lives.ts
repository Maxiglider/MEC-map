import { Lives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { createTimer } from 'Utils/mapUtils'
import { ILives } from '../../04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'

export let udg_lives: ILives

export const InitTrig_Init_lives = () => {
    createTimer(0.0001, false, () => (udg_lives = Lives()))
}
