import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { Level } from './Level'

const initLevelFunctions = () => {
    const IsLevelBeingMade = (level: Level): boolean => {
        let i = 0
        while (true) {
            if (i >= NB_ESCAPERS) break
            if (udg_escapers.get(i) !== null) {
                if (udg_escapers.get(i).getMakingLevel() == level) {
                    return true
                }
            }
            i = i + 1
        }
        return udg_levels.getCurrentLevel() == level
    }

    return { IsLevelBeingMade }
}

export const LevelFunctions = initLevelFunctions()
