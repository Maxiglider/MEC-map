import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { Text } from 'core/01_libraries/Text'
import { forRange } from 'Utils/mapUtils'
import { getUdgEscapers } from '../../../../globals'
import {playerId2colorId} from "../../06_COMMANDS/COMMANDS_vJass/Command_functions";

const initMessageHeroDies = () => {
    const MESSAGE_DURATION = 6
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
        const n = GetPlayerId(p)

        TimerStart(CreateTimer(), TIME_BETWEEN_DEATH_AND_MESSAGE, false, () => {
            PlaySoundHeroDies(Player(n))

            forRange(NB_ESCAPERS, i => {
                if (!getUdgEscapers().get(i)?.isIgnoringDeathMessages()) {
                    Text.P_timed(
                        Player(i),
                        MESSAGE_DURATION,
                        udg_colorCode[playerId2colorId(n)] + getUdgEscapers().get(n)?.getDisplayName() + '|r has fallen.'
                    )
                }
            })

            DestroyTimer(GetExpiredTimer())
        })
    }

    return { DisplayDeathMessagePlayer }
}

export const MessageHeroDies = initMessageHeroDies()
