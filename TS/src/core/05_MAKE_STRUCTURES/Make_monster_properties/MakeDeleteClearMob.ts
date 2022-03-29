import { Make } from '../Make/Make'

export class MakeDeleteClearMob extends Make {
    // TODO; Used to be static

    create = (maker: unit): MakeDeleteClearMob => {
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

    destroy = () => {
        DestroyTrigger(this.t)
        this.t = null
        this.maker = null
    }

    clickMade = (monsterOrCasterId: number) => {
        let escaper = EscaperFunctions.Hero2Escaper(this.maker)
        let clearMob = ClearTriggerMobId2ClearMob(monsterOrCasterId)
        if (clearMob !== 0) {
            clearMob.destroy()
            Text.mkP(this.makerOwner, 'clear mob removed')
        } else {
            Text.erP(this.makerOwner, 'this monster is not a trigger mob of a clear mob')
        }
    }

    cancelLastAction = (): boolean => {
        return false
    }

    redoLastAction = (): boolean => {
        return false
    }
}
