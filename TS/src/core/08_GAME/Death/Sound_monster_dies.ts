import { createEvent } from 'Utils/mapUtils'

export const InitTrig_Sound_monster_dies = () => {
    createEvent({
        events: [t => TriggerRegisterAnyUnitEventBJ(t, EVENT_PLAYER_UNIT_DEATH)],
        conditions: [
            () => {
                if (!(GetOwningPlayer(GetTriggerUnit()) === Player(PLAYER_NEUTRAL_AGGRESSIVE))) {
                    return false
                }
                return true
            },
        ],
        actions: [() => PlaySoundBJ(gg_snd_goodJob)],
    })
}
