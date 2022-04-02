import { createEvent } from 'Utils/mapUtils'
import { METEOR_CHEAT, METEOR_NORMAL } from './Meteor'

export const InitTrig_Effect_meteor_on_pick_down = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DROP_ITEM)],
        actions: [
            () => {
                if (
                    !(
                        IsHero(GetTriggerUnit()) &&
                        (GetItemTypeId(GetManipulatedItem()) === METEOR_NORMAL ||
                            GetItemTypeId(GetManipulatedItem()) === METEOR_CHEAT)
                    )
                ) {
                    return
                }

                Hero2Escaper(GetTriggerUnit()).removeEffectMeteor()
            },
        ],
    })
}
