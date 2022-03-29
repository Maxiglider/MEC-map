import { Make } from '../Make/Make'

export class MakeMonsterNoMove extends Make {
    private mt: MonsterType
    private facingAngle: number

    getMonsterType = (): MonsterType => {
        return this.mt
    }

    getFacingAngle = (): number => {
        return this.facingAngle
    }

    // TODO; Used to be static
    create = (maker: unit, mt: MonsterType, facingAngle: number): MakeMonsterNoMove => {
        let m: MakeMonsterNoMove
        if (maker === null || mt === 0) {
            return 0
        }
        m = MakeMonsterNoMove.allocate()
        m.maker = maker
        m.kind = 'monsterCreateNoMove'
        m.mt = mt
        m.facingAngle = facingAngle
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    }

    destroy = () => {
        DestroyTrigger(this.t)
        this.t = null
        this.maker = null
    }

    cancelLastAction = (): boolean => {
        return false
    }

    redoLastAction = (): boolean => {
        return false
    }
}
