import { Text } from 'core/01_libraries/Text'
import { Monster } from 'core/04_STRUCTURES/Monster/Monster'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { MakeMonsterPropertyChangeAction } from '../MakeLastActions/MakeMonsterPropertyChangeAction'

type IValidCb = (monster: Monster) => boolean
type IGetCb<T> = (monster: Monster) => T
type ISetCb<T> = (monster: Monster, propertyValue: T) => void

export class MakeMonsterPropertyChange<T> extends Make {
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
            const monster = this.escaper.getMakingLevel().monsters.getMonsterNear(this.orderX, this.orderY)

            if (!monster) {
                Text.erP(this.makerOwner, 'no monster clicked for your making level')
                return
            }

            if (!this.validCb(monster)) {
                Text.erP(this.makerOwner, 'invalid monster clicked for your making level')
                return
            }

            const oldPropertyValue = this.getCb(monster)
            this.setCb(monster, this.propertyValue)
            Text.P(this.makerOwner, `Changed '${this.propertyName}' to '${this.propertyValue}'`)
            this.escaper.destroyMake()

            this.escaper.newAction(
                new MakeMonsterPropertyChangeAction(
                    this.escaper.getMakingLevel(),
                    monster,
                    this.propertyName,
                    this.propertyValue,
                    this.setCb,
                    oldPropertyValue
                )
            )
        }
    }
}
