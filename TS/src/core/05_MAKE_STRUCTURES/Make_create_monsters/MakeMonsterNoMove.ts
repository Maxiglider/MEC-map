import { MakeMonsterAction } from '../MakeLastActions/MakeMonsterAction'
import { MonsterNoMove } from '../../04_STRUCTURES/Monster/MonsterNoMove'
import { MonsterType } from '../../04_STRUCTURES/Monster/MonsterType'
import { Make } from '../Make/Make'

export class MakeMonsterNoMove extends Make {
    private mt: MonsterType
    private facingAngle: number

    constructor(maker: unit, mt: MonsterType, facingAngle: number) {
        super(maker, 'monsterCreateNoMove')

        this.mt = mt
        this.facingAngle = facingAngle
    }

    getMonsterType = (): MonsterType => {
        return this.mt
    }

    getFacingAngle = (): number => {
        return this.facingAngle
    }

    doActions = () => {
        if (super.doBaseActions()) {
            const monster = new MonsterNoMove(this.getMonsterType(), this.orderX, this.orderY, this.getFacingAngle())
            this.escaper.getMakingLevel().monsters.new(monster, true)
            this.escaper.newAction(new MakeMonsterAction(this.escaper.getMakingLevel(), monster))
        }
    }

    cancelLastAction = (): boolean => {
        //implement cancel/redo
        return false
    }

    redoLastAction = (): boolean => {
        return false
    }
}
