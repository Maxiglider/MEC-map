import { BasicFunctions } from 'core/01_libraries/Basic_functions'

const initTeleport = () => {
    // TODO; Used to be private
    let teleTriggers: Array<trigger> = []
    // TODO; Used to be private
    let onceOnly: Array<boolean> = []

    const Teleport_Actions = (): void => {
        let hero: unit | null = GetTriggerUnit()

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(hero)

        SetUnitX(hero, GetOrderPointX())
        SetUnitY(hero, GetOrderPointY())

        if (onceOnly[GetUnitUserData(hero)]) {
            DestroyTrigger(GetTriggeringTrigger())
        }

        hero = null
    }

    const ActivateTeleport = (hero: unit, onceOnlyB: boolean): void => {
        let escaperId = GetUnitUserData(hero)
        DestroyTrigger(teleTriggers[escaperId])
        teleTriggers[escaperId] = CreateTrigger()
        TriggerAddAction(teleTriggers[escaperId], Teleport_Actions)
        TriggerRegisterUnitEvent(teleTriggers[escaperId], hero, EVENT_UNIT_ISSUED_POINT_ORDER)
        onceOnly[escaperId] = onceOnlyB
    }

    const DisableTeleport = (hero: unit): void => {
        let escaperId = GetUnitUserData(hero)
        DestroyTrigger(teleTriggers[escaperId])
    }

    return { ActivateTeleport, DisableTeleport }
}

export const Teleport = initTeleport()
