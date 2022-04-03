import { IsEscaperInGame } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Level } from '../Level/Level'
import { Escaper } from './Escaper'


export class EscaperArray {
    private escapers: Escaper[]
    
    constructor() {
        this.escapers = []
        
        for(let escaperId = 0; escaperId < NB_ESCAPERS; escaperId++) {
            if (IsEscaperInGame(escaperId)) {
                this.escapers[escaperId] = new Escaper(escaperId)
            }
        }
    }

    newAt = (id: number) => {
        if (id < 0 || id >= NB_ESCAPERS) {
            return
        }
        
        if (this.escapers[id]) {
            return
        }

        this.escapers[id] = new Escaper(id)
    }

    count = () => {
        return this.escapers.filter(escaper => escaper !== undefined).length
    }

    get = (id: number) => {
        return this.escapers[id]
    }

    removeEscaper = (id: number) => {
        delete this.escapers[id]
    }

    destroyEscaper = (id: number) => {
        if (this.escapers[id]) {
            this.escapers[id].destroy()
        }

        delete this.escapers[id]
    }

    deleteSpecificActionsForLevel = (level: Level) => {
        this.escapers.map(escaper => {
            escaper && escaper.deleteSpecificActionsForLevel(level)
        })
    }

    destroyMakesIfForSpecificLevel_currentLevel = () => {
        //destroy le make des this.escapers si c'est un make pour spécifique level et que l'escaper make pour le "current_level"
        this.escapers.map(escaper => {
            escaper && escaper.isMakingCurrentLevel() && escaper.destroyMakeIfForSpecificLevel()
        })
    }
}
