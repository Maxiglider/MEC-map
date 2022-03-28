const initMakeDoNothing = () => {
    // needs Make

    //struct MakeDoNothing extends Make

    // TODO; Used to be static

    const create = (maker: unit): MakeDoNothing => {
        let m: MakeGetTerrainType
        if (maker === null) {
            return 0
        }
        m = MakeDoNothing.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'doNothing'
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    }

    const onDestroy = () => {
        DestroyTrigger(this.t)
        this.t = null
        this.maker = null
    }

    const cancelLastAction = (): boolean => {
        return false
    }

    const redoLastAction = (): boolean => {
        return false
    }

    //endstruct
}
