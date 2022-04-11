import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Hero2Escaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from '../../../Utils/mapUtils'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'

export const MAKE_LAST_CLIC_UNIT_ID = FourCC('e001') //à remplacer par l'id de l'unité choisie (need couleur variable)
export const MAKE_CANT_CANCEL_MORE = 'Nothing else to cancel !'
export const MAKE_CANT_REDO_MORE = 'Nothing else to redo !'

const TriggerActions = () => {
    Hero2Escaper(GetTriggerUnit())?.getMake()?.doActions()
}

export abstract class Make {
    makerOwner: player
    kind: string //monsterMaking, monsterDeleting...
    t: trigger | null
    maker: unit
    escaper: Escaper
    orderX: number = 0
    orderY: number = 0
    forSpecificLevel: boolean

    constructor(maker: unit, kind: string, forSpecificLevel = true) {
        this.maker = maker
        this.makerOwner = GetOwningPlayer(maker)
        this.kind = kind

        const escaper = Hero2Escaper(maker)
        if (!escaper) {
            throw 'Make : escaper not found'
        }

        this.escaper = escaper

        this.t = null
        this.enableTrigger()

        this.forSpecificLevel = forSpecificLevel
    }

    destroy() {
        if (this.t) {
            DestroyTrigger(this.t)
        }
    }

    doBaseActions() {
        if (!IsIssuedOrder('smart')) {
            return false
        }

        this.orderX = GetOrderPointX()
        this.orderY = GetOrderPointY()

        StopUnit(this.maker)
        return true
    }

    abstract doActions(this: void): void

    enableTrigger = () => {
        if (this.t) DestroyTrigger(this.t)

        this.t = createEvent({
            events: [t => TriggerRegisterUnitEvent(t, this.maker, EVENT_UNIT_ISSUED_POINT_ORDER)],
            actions: [TriggerActions],
        })
    }

    cancelLastAction = () => {
        return false
    }

    redoLastAction = () => {
        return false
    }
}
