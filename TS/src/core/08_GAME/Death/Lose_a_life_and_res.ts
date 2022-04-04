import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { createEvent } from 'Utils/mapUtils'
import { ChangeAllTerrains } from '../../07_TRIGGERS/Triggers_to_modify_terrains/Change_all_terrains'
import { getUdgEscapers } from '../../../../globals'

import { udg_lives } from '../Init_structures/Init_lives'
import { getUdgLevels } from "../../../../globals"


let udg_gameIsLost = false
export let gg_trg_Lose_a_life_and_res: trigger

export const InitTrig_Lose_a_life_and_res = () => {
    gg_trg_Lose_a_life_and_res = createEvent({
        events: [],
        actions: [
            () => {
                let i: number
                udg_lives.loseALife()
                if (udg_lives.get() < 0) {
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
