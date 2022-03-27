const initMakeDeleteClearMob = () => {
    // needs Make, ClearMob

    //struct MakeDeleteClearMob extends Make

    // TODO; Used to be static

    const create = (maker: unit): MakeDeleteClearMob => {
        let m: MakeDeleteClearMob
        if (maker === null) {
            return 0
        }
        m = MakeDeleteClearMob.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'deleteClearMob'
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        return m
    }

    const onDestroy = (): void => {
        DestroyTrigger(this.t)
        this.t = null
        this.maker = null
    }

    const clickMade = (monsterOrCasterId: number): void => {
        let escaper = EscaperFunctions.Hero2Escaper(this.maker)
        let clearMob = ClearTriggerMobId2ClearMob(monsterOrCasterId)
        if (clearMob !== 0) {
            clearMob.destroy()
            Text.mkP(this.makerOwner, 'clear mob removed')
        } else {
            Text.erP(this.makerOwner, 'this monster is not a trigger mob of a clear mob')
        }
    }

    const cancelLastAction = (): boolean => {
        return false
    }

    const redoLastAction = (): boolean => {
        return false
    }

    //endstruct
}
