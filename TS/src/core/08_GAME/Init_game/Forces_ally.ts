import { forRange } from 'Utils/mapUtils'
import {NB_PLAYERS_MAX} from "../../01_libraries/Constants";

export const InitTrig_Forces_ally = () => {
    forRange(NB_PLAYERS_MAX, i => {
        forRange(NB_PLAYERS_MAX, j => {
            if(i != j) {
                SetPlayerAllianceStateBJ(Player(i), Player(j), bj_ALLIANCE_ALLIED_VISION)
            }
        })
    })
}

