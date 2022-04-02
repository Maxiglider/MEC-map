import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeGetTerrainType extends Make {
    // TODO; Used to be static
    create = (maker: unit): MakeGetTerrainType => {
        let m: MakeGetTerrainType
        if (maker === null) {
            return 0
        }
        m = MakeGetTerrainType.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'getTerrainType'
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
