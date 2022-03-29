import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'

export class MakeTerrainHeight extends Make {
    private radius: number
    private height: number

    // TODO; Used to be static
    create = (maker: unit, radius: number, height: number): MakeTerrainHeight => {
        let m: MakeTerrainHeight
        if (maker === null) {
            return 0
        }
        m = MakeTerrainHeight.allocate()
        m.maker = maker
        m.radius = radius
        m.height = height
        m.kind = 'terrainHeight'
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    }

    getRadius = (): number => {
        return this.radius
    }

    getHeight = (): number => {
        return this.height
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
