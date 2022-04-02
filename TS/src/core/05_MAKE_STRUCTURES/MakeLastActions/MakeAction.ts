import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import { Level } from '../../04_STRUCTURES/Level/Level'

export abstract class MakeAction {
    isActionMadeB: boolean = true
    owner: Escaper = null
    private level: Level

    abstract cancel()
    abstract redo(): boolean
    abstract destroy()

    constructor(level: Level) {
        this.level = level
    }

    getLevel() {
        return this.level
    }
}
