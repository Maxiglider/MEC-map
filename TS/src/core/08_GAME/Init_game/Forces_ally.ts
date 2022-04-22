import { forRange } from 'Utils/mapUtils'
import {NB_PLAYERS_MAX_REFORGED} from "../../01_libraries/Constants";

export const InitTrig_Forces_ally = () => {
    forRange(NB_PLAYERS_MAX_REFORGED, i => {
        forRange(NB_PLAYERS_MAX_REFORGED, j => {
            if(i != j) {
                SetPlayerAllianceStateBJ(Player(i), Player(j), bj_ALLIANCE_ALLIED_VISION)
            }
        })
    })
}

