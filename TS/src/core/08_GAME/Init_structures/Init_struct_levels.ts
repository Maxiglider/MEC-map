export let udg_levels: LevelArray

export const InitTrig_Init_struct_levels = () => {
    if (!udg_levels) {
        udg_levels = new LevelArray()
    }
}
