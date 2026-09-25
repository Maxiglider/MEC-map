/**
 * MEC hides the heroes' selection circle for the whole game. Giving the players their hands back puts it back: the
 * end of a cinematic (CinematicModeBJ(false) calls EnableUserControl(true)) and the end of a fade (FinishCinematicFadeBJ
 * calls EnableUserUI(true)). So those natives are wrapped, and hide it again each time they give the hands back,
 * whoever calls them: the functions of blizzard.lua look the natives up by their global name at each call, and a map's
 * own triggers do the same. A call taking the hands away is left as it is.
 */
export const initNoSelectionCircle = () => {
    EnableSelect(true, false)

    const G = _G as any
    for (const name of ['EnableUserControl', 'EnableUserUI']) {
        const native: (this: void, b: boolean) => void = G[name]
        G[name] = (b: boolean) => {
            native(b)
            if (b) {
                EnableSelect(true, false)
            }
        }
    }
}
