import {NB_ESCAPERS} from 'core/01_libraries/Constants'
import {getUdgEscapers, getUdgLevels} from "../../../../globals";
import {Level} from './Level'

const udg_escapers = getUdgEscapers()
const udg_levels = getUdgLevels()

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
