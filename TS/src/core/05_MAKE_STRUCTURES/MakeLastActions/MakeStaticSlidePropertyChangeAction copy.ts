import { Text } from 'core/01_libraries/Text'
import { StaticSlide } from 'core/04_STRUCTURES/Level/StaticSlide'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { MakeAction } from './MakeAction'

type ISetCb<T> = (staticSlide: StaticSlide, propertyValue: T) => void

export class MakeStaticSlidePropertyChangeAction<T> extends MakeAction {
    private staticSlide: StaticSlide

    private propertyName: string
    private propertyValue: T

    private setCb: ISetCb<T>

    private oldPropertyValue: T

    constructor(
        level: Level,
        staticSlide: StaticSlide,
        propertyName: string,
        propertyValue: T,
        setCb: ISetCb<T>,
        oldPropertyValue: T
    ) {
        super(level)
        this.staticSlide = staticSlide

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

        this.setCb(this.staticSlide, this.oldPropertyValue)
        this.owner && Text.P(this.owner.getPlayer(), `Undo '${this.propertyName}' to '${this.oldPropertyValue}'`)
        return true
    }

    redo = () => {
        if (this.isActionMadeB) {
            return false
        }

        this.isActionMadeB = true

        this.setCb(this.staticSlide, this.propertyValue)
        this.owner && Text.P(this.owner.getPlayer(), `Redo '${this.propertyName}' to '${this.propertyValue}'`)
        return true
    }
}
