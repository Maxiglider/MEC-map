import { Text } from 'core/01_libraries/Text'
import { StaticSlide } from 'core/04_STRUCTURES/Level/StaticSlide'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { MakeStaticSlidePropertyChangeAction } from '../MakeLastActions/MakeStaticSlidePropertyChangeAction copy'

type IValidCb = (staticSlide: StaticSlide) => boolean
type IGetCb<T> = (staticSlide: StaticSlide) => T
type ISetCb<T> = (staticSlide: StaticSlide, propertyValue: T) => void

export class MakeStaticSlidePropertyChange<T> extends Make {
    private propertyName: string
    private propertyValue: T

    private validCb: IValidCb
    private getCb: IGetCb<T>
    private setCb: ISetCb<T>

    constructor(
        maker: unit,
        propertyName: string,
        propertyValue: T,
        validCb: IValidCb,
        getCb: IGetCb<T>,
        setCb: ISetCb<T>
    ) {
        super(maker, 'makePropertyChange')

        this.propertyName = propertyName
        this.propertyValue = propertyValue

        this.validCb = validCb
        this.getCb = getCb
        this.setCb = setCb
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const staticSlide = this.escaper
                .getMakingLevel()
                .staticSlides.getStaticSlideFromPoint(this.orderX, this.orderY)

            if (!staticSlide) {
                Text.erP(this.makerOwner, 'no staticSlide clicked for your making level')
                return
            }

            if (!this.validCb(staticSlide)) {
                Text.erP(this.makerOwner, 'invalid staticSlide clicked for your making level')
                return
            }

            const oldPropertyValue = this.getCb(staticSlide)
            this.setCb(staticSlide, this.propertyValue)
            Text.P(this.makerOwner, `Changed '${this.propertyName}' to '${this.propertyValue}'`)
            this.escaper.destroyMake()

            this.escaper.newAction(
                new MakeStaticSlidePropertyChangeAction(
                    this.escaper.getMakingLevel(),
                    staticSlide,
                    this.propertyName,
                    this.propertyValue,
                    this.setCb,
                    oldPropertyValue
                )
            )
        }
    }
}
