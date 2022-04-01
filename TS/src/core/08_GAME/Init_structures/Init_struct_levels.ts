import { LevelArray } from 'core/04_STRUCTURES/Level/LevelArray'

export let udg_levels: LevelArray

export const InitTrig_Init_struct_levels = () => {
    if (!udg_levels) {
        udg_levels = new LevelArray()
    }
}
