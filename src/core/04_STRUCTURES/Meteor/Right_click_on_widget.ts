import { IsIssuedOrder } from 'core/01_libraries/Basic_functions'
import { createEvent } from 'Utils/mapUtils'
import { Natives } from '../../wc3_natives_unsecured/Natives'
import { Hero2Escaper, IsHero } from '../Escaper/Escaper_functions'
import { isDoor } from '../KeyAndDoor/KeyAndDoor'
import { MeteorFunctions } from './Meteor_functions'

export const InitTrig_Right_click_on_widget = () => {
    // a right-click on a door, from a hero walking and not in a make mode (which may want the door itself): a
    // right-click on the ground there instead, rather than going and "using" the door. Sliding heroes are turned by
    // To_turn_on_slide, which takes a door as the ground too.
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)],
        conditions: [
            () => {
                const hero = Natives.UGetTriggerUnit()
                const escaper = Hero2Escaper(hero)
                const door = GetOrderTargetDestructable()
                return (
                    IsHero(hero) &&
                    IsIssuedOrder('smart') &&
                    !!escaper &&
                    !escaper.isSliding() &&
                    !escaper.getMake() &&
                    !!door &&
                    isDoor(door)
                )
            },
        ],
        actions: [
            () => {
                const hero = Natives.UGetTriggerUnit()
                const door = Natives.UGetOrderTarget()
                const x = GetWidgetX(door)
                const y = GetWidgetY(door)
                // after this order is through: an order given from its own event is dropped
                const t = CreateTimer()
                TimerStart(t, 0, false, () => {
                    DestroyTimer(t)
                    IssuePointOrder(hero, 'smart', x, y)
                })
            },
        ],
    })

    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_ISSUED_TARGET_ORDER)],
        conditions: [() => IsHero(Natives.UGetTriggerUnit()) && IsIssuedOrder('smart')],
        actions: [
            () => {
                const targetUnit = GetOrderTargetUnit()
                if (targetUnit) {
                    // an other case can be targetting an item (example: a meteor on the ground)
                    MeteorFunctions.ExecuteRightClicOnUnit(Natives.UGetTriggerUnit(), targetUnit)
                }
            },
        ],
    })
}
