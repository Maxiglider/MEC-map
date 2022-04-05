import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { errorHandler } from '../../../Utils/mapUtils'

let teleTriggers: trigger[] = []
let onceOnly: boolean[] = []

const Teleport_Actions = () => {
    let hero: unit | null = GetTriggerUnit()

    if (!IsIssuedOrder('smart')) {
        return
    }
    StopUnit(hero)

    SetUnitX(hero, GetOrderPointX())
    SetUnitY(hero, GetOrderPointY())

    if (onceOnly[GetUnitUserData(hero)]) {
        DestroyTrigger(GetTriggeringTrigger())
    }

    hero = null
}

export const ActivateTeleport = (hero: unit, onceOnlyB: boolean) => {
    let escaperId = GetUnitUserData(hero)
    DestroyTrigger(teleTriggers[escaperId])
    teleTriggers[escaperId] = CreateTrigger()
    TriggerAddAction(teleTriggers[escaperId], errorHandler(Teleport_Actions))
    TriggerRegisterUnitEvent(teleTriggers[escaperId], hero, EVENT_UNIT_ISSUED_POINT_ORDER)
    onceOnly[escaperId] = onceOnlyB
}

export const DisableTeleport = (hero: unit) => {
    let escaperId = GetUnitUserData(hero)
    DestroyTrigger(teleTriggers[escaperId])
}
