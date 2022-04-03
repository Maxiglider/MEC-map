import { createEvent } from 'Utils/mapUtils'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import { METEOR_NORMAL } from './Meteor'

export const InitTrig_Effect_meteor_on_pick_up = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_PICKUP_ITEM)],
        conditions: [() => GetItemTypeId(UnitItemInSlotBJ(GetTriggerUnit(), 1)) === METEOR_NORMAL],
        actions: [() => Hero2Escaper(GetTriggerUnit())?.addEffectMeteor()],
    })
}
