import { MakeMonsterNoMove } from './MakeMonsterNoMove'
import { BookOfLife } from '../../04_STRUCTURES/Monster/BookOfLife'
import { MakeDeleteMonstersAction } from '../MakeLastActions/MakeDeleteMonstersAction'
import { MakeMonsterAction } from '../MakeLastActions/MakeMonsterAction'

export class MakeBookOfLife extends MakeMonsterNoMove {
    constructor(maker: unit, facingAngle: number) {
        super(maker, BookOfLife.getMonsterType(), facingAngle, 'bookOfLifeCreate')
    }

    doActions = () => {
        if (super.doBaseActions()) {
            if (this.getMonsterType().getCreateTerrainLabel()) {
                const targetMob = this.escaper
                    .getMakingLevel()
                    .monsters.getMonsterNoMoveNearTile(this.orderX, this.orderY)

                if (targetMob) {
                    if (targetMob.getMonsterType()?.getCreateTerrainLabel()) {
                        targetMob.delete()
                        targetMob.removeUnit() // delete checks if unit exists, mct units dont have a unit
                        this.escaper.newAction(new MakeDeleteMonstersAction(this.escaper.getMakingLevel(), [targetMob]))
                    }
                }
            }

            const bookOfLife = new BookOfLife(this.orderX, this.orderY, this.getFacingAngle())
            this.escaper.getMakingLevel().monsters.new(bookOfLife, true)
            this.escaper.newAction(new MakeMonsterAction(this.escaper.getMakingLevel(), bookOfLife))
        }
    }
}
