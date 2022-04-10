import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { createEvent } from 'Utils/mapUtils'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { getUdgLives } from '../Init_structures/Init_lives'

let udg_gameIsLost = false
export const gg_trg_Lose_a_life_and_res: { trigger: trigger } = {} as any

export const InitTrig_Lose_a_life_and_res = () => {
    gg_trg_Lose_a_life_and_res.trigger = createEvent({
        events: [],
        actions: [
            () => {
                let i: number
                getUdgLives().loseALife()
                if (getUdgLives().get() < 0) {
                    if (!udg_gameIsLost) {
                        udg_gameIsLost = true
                        DisplayTextToForce(GetPlayersAll(), 'You have no more lives !')
                        TriggerSleepAction(2)
                        DisplayTextToForce(GetPlayersAll(), 'The game will restart in 10 seconds.')
                        TriggerSleepAction(10.0)
                        getUdgLevels().restartTheGame()
                        udg_gameIsLost = false
                    }
                } else {
                    if (ChangeAllTerrains.udg_changeAllTerrainsAtRevive) {
                        TriggerSleepAction(6.0)
                        ChangeAllTerrains.ChangeAllTerrains('normal')
                        TriggerSleepAction(2.0)
                    } else {
                        TriggerSleepAction(8.0)
                    }
                    i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break
                        getUdgEscapers().get(i)?.reviveAtStart()
                        i = i + 1
                    }
                    Text.A('|cff5c2e2eYou have lost a life !')
                    //AnticheatTeleport_justRevived = true
                }
            },
        ],
    })
}
