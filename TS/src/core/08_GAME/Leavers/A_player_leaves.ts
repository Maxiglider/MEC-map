import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { createEvent, forRange } from 'Utils/mapUtils'
import { udg_escapers } from '../Init_structures/Init_escapers'

export const InitTrig_A_player_leaves = () => {
    createEvent({
        events: [t => forRange(12, i => TriggerRegisterPlayerEventLeave(t, Player(i)))],
        actions: [
            () => {
                let n = GetPlayerId(GetTriggerPlayer())
                udg_escapers.remove(n)
                StopAfk(n)
                StopAfk(n + NB_PLAYERS_MAX)
                DisplayTextToForce(
                    GetPlayersAll(),
                    ColorCodes.udg_colorCode[n] +
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
