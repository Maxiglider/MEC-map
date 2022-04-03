import {NB_ESCAPERS} from 'core/01_libraries/Constants'
import {udg_levels} from 'core/08_GAME/Init_structures/Init_struct_levels'
import {Level} from './Level'
import {udg_escapers} from "../../../../globals";

export const IsLevelBeingMade = (level: Level): boolean => {
    for (let i = 0; i < NB_ESCAPERS; i++) {
        const escaper = udg_escapers.get(i)
        if (escaper) {
            if (escaper.getMakingLevel() == level) {
                return true
            }
        }
    }
    return udg_levels.getCurrentLevel() == level
}
