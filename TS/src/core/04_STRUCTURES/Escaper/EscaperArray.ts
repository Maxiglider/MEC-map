import { IsEscaperInGame } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Level } from '../Level/Level'
import { Escaper } from './Escaper'

export type IEscaperArray = ReturnType<typeof EscaperArray>

export const EscaperArray = () => {
    const escapers: (Escaper | null)[] = []

    let escaperId = 0

    while (!(escaperId >= NB_ESCAPERS)) {
        if (IsEscaperInGame(escaperId)) {
            escapers[escaperId] = new Escaper(escaperId)
        } else {
            escapers[escaperId] = null
        }
        escaperId = escaperId + 1
    }

    const newAt = (id: number) => {
        if (id < 0 || id >= NB_ESCAPERS) {
            return
        }
        if (escapers[id] != null) {
            return
        }
        escapers[id] = new Escaper(id)
    }

    const count = () => {
        let n = 0
        let i = 0

        while (!(i >= NB_ESCAPERS)) {
            if (escapers[i] != null) {
                n = n + 1
            }
            i = i + 1
        }

        return n
    }

    const get = (id: number) => {
        return escapers[id]
    }

    const nullify = (id: number) => {
        escapers[id] = null
    }

    const remove = (id: number) => {
        if (escapers[id]) {
            escapers[id]!.destroy()
        }

        escapers[id] = null
    }

    const deleteSpecificActionsForLevel = (level: Level) => {
        let i = 0

        while (!(i >= NB_ESCAPERS)) {
            if (escapers[i] != null) {
                escapers[i]!.deleteSpecificActionsForLevel(level)
            }
            i = i + 1
        }
    }

    const destroyMakesIfForSpecificLevel_currentLevel = () => {
        //destroy le make des escapers si c'est un make pour spécifique level et que l'escaper make pour le "current_level"
        let doDestroy: boolean
        let i = 0

        while (!(i >= NB_ESCAPERS)) {
            if (escapers[i] != null && escapers[i]!.isMakingCurrentLevel()) {
                escapers[i]!.destroyMakeIfForSpecificLevel()
            }
            i = i + 1
        }
    }

    return {
        newAt,
        count,
        get,
        nullify,
        remove,
        deleteSpecificActionsForLevel,
        destroyMakesIfForSpecificLevel_currentLevel,
    }
}
