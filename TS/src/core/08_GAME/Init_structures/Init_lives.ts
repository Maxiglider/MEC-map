import { Lives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { createEvent } from 'Utils/mapUtils'
import { ILives } from '../../04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'

let udg_lives: ILives | 0 = 0

export const InitTrig_Init_lives = () => {
    createEvent({
        events: [t => TriggerRegisterTimerEvent(t, 0.0001, false)],
        actions: [() => (udg_lives = Lives())],
    })
}
