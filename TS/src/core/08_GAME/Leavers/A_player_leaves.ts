import { NB_PLAYERS_MAX } from 'core/01_libraries/Constants'
import { udg_colorCode } from 'core/01_libraries/Init_colorCodes'
import { createEvent, forRange } from 'Utils/mapUtils'
import { AfkMode } from '../Afk_mode/Afk_mode'
import { udg_escapers } from '../../../../globals'

export const InitTrig_A_player_leaves = () => {
    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerEventLeave(t, Player(i)))],
        actions: [
            () => {
                let n = GetPlayerId(GetTriggerPlayer())
                udg_escapers.destroyEscaper(n)
                AfkMode.StopAfk(n)
                AfkMode.StopAfk(n + NB_PLAYERS_MAX)
                DisplayTextToForce(
                    GetPlayersAll(),
                    udg_colorCode[n] +
                        'This is too difficult for ' +
                        GetPlayerName(GetTriggerPlayer()) +
                        ', (s)he has left the game.'
                )
                StartSound(gg_snd_noob)
                //NbPlayersMinimumThree_nbPlayers = NbPlayersMinimumThree_nbPlayers - 1
            },
        ],
    })
}
