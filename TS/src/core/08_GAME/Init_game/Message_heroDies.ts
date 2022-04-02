import { Text } from 'core/01_libraries/Text'
import { forRange } from 'Utils/mapUtils'

const initMessageHeroDies = () => {
    const MESSAGE_DURATION = 10
    const TIME_BETWEEN_DEATH_AND_MESSAGE = 5
    let timerSonJoue = CreateTimer()
    let isSoundPlaying = false
    let DUREE_SON = 3

    const GetRandomSoundHeroDies = (): sound => {
        let n = GetRandomInt(0, 3)
        if (n === 0) {
            return gg_snd_heroDies0
        } else if (n === 1) {
            return gg_snd_heroDies1
        } else if (n === 2) {
            return gg_snd_heroDies2
        } else {
            return gg_snd_heroDies3
        }
    }

    const GetRandomSoundAllyHeroDies = (): sound => {
        let n = GetRandomInt(0, 3)
        if (n === 0) {
            return gg_snd_allyHeroDies0
        } else if (n === 1) {
            return gg_snd_allyHeroDies1
        } else if (n === 2) {
            return gg_snd_allyHeroDies2
        } else {
            return gg_snd_allyHeroDies3
        }
    }

    const SoundEnd = () => {
        isSoundPlaying = false
    }

    const PlaySoundHeroDies = (fallenPlayer: player) => {
        if (!isSoundPlaying) {
            if (GetLocalPlayer() === fallenPlayer) {
                StartSound(GetRandomSoundHeroDies())
            } else {
                StartSound(GetRandomSoundAllyHeroDies())
            }
            isSoundPlaying = true
            TimerStart(timerSonJoue, DUREE_SON, false, SoundEnd)
        }
    }

    const DisplayDeathMessagePlayer = (p: player) => {
        let n = GetPlayerId(p)

        forRange(12, i => {
            if (n === i) {
                TimerStart(CreateTimer(), TIME_BETWEEN_DEATH_AND_MESSAGE, false, () => {
                    PlaySoundHeroDies(Player(i))
                    Text.A_timed(MESSAGE_DURATION, udg_colorCode[i] + GetPlayerName(Player(i)) + '|r has fallen.')
                    DestroyTimer(GetExpiredTimer())
                })
            }
        })
    }

    return { DisplayDeathMessagePlayer }
}

export const MessageHeroDies = initMessageHeroDies()
