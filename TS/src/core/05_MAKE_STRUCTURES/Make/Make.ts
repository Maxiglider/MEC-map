import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Hero2Escaper } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { createEvent } from '../../../Utils/mapUtils'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import {getUdgEscapers} from "../../../../globals";

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
    maker: unit | undefined
    escaper: Escaper
    orderX: number = 0
    orderY: number = 0
    forSpecificLevel: boolean

    constructor(maker: unit | undefined, kind: string, forSpecificLevel = true, player: player | null = null) {
        this.maker = maker
        this.kind = kind

        let escaper: Escaper | null = null
        if(maker) {
            escaper = Hero2Escaper(maker)
            this.makerOwner = GetOwningPlayer(maker)
        }else if(player){
            this.makerOwner = player
            escaper = getUdgEscapers().get(GetPlayerId(player))
            if(escaper && escaper.getHero()){
                this.maker = escaper.getHero()
            }
        }else{
            throw 'Wrong Make init'
        }

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
        const targetWidget = GetOrderTarget()
        if (targetWidget) {
            this.orderX = GetWidgetX(targetWidget)
            this.orderY = GetWidgetX(targetWidget)
        } else {
            if (!IsIssuedOrder('smart')) {
                return false
            }

            this.orderX = GetOrderPointX()
            this.orderY = GetOrderPointY()
        }

        if (this.escaper.roundToGrid) {
            this.orderX = Math.round(this.orderX / this.escaper.roundToGrid) * this.escaper.roundToGrid
            this.orderY = Math.round(this.orderY / this.escaper.roundToGrid) * this.escaper.roundToGrid
        }

        this.maker && StopUnit(this.maker)
        return true
    }

    abstract doActions(this: void): void

    enableTrigger = () => {
        if (this.t) DestroyTrigger(this.t)

        if(this.maker) {
            this.t = createEvent({
                events: [
                    t => this.maker && TriggerRegisterUnitEvent(t, this.maker, EVENT_UNIT_ISSUED_POINT_ORDER),
                    t => this.maker && TriggerRegisterUnitEvent(t, this.maker, EVENT_UNIT_ISSUED_TARGET_ORDER),
                ],
                actions: [TriggerActions],
            })
        }
    }

    cancelLastAction = () => {
        return false
    }

    redoLastAction = () => {
        return false
    }
}
