import { Text } from 'core/01_libraries/Text'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { Monster } from '../../04_STRUCTURES/Monster/Monster'
import { MakeAction } from './MakeAction'

type ISetCb<T> = (monster: Monster, propertyValue: T) => void

export class MakeMonsterPropertyChangeAction<T> extends MakeAction {
    private monster: Monster

    private propertyName: string
    private propertyValue: T

    private setCb: ISetCb<T>

    private oldPropertyValue: T

    constructor(
        level: Level,
        monster: Monster,
        propertyName: string,
        propertyValue: T,
        setCb: ISetCb<T>,
        oldPropertyValue: T
    ) {
        super(level)
        this.monster = monster

        this.propertyName = propertyName
        this.propertyValue = propertyValue

        this.setCb = setCb

        this.oldPropertyValue = oldPropertyValue
    }

    destroy = () => {}

    cancel = () => {
        if (!this.isActionMadeB) {
            return false
        }

        this.isActionMadeB = false

        this.setCb(this.monster, this.oldPropertyValue)
        this.owner && Text.P(this.owner.getPlayer(), `Undo '${this.propertyName}' to '${this.oldPropertyValue}'`)
        return true
    }

    redo = () => {
        if (this.isActionMadeB) {
            return false
        }

        this.isActionMadeB = true

        this.setCb(this.monster, this.propertyValue)
        this.owner && Text.P(this.owner.getPlayer(), `Redo '${this.propertyName}' to '${this.propertyValue}'`)
        return true
    }
}
