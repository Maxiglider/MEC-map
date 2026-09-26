/**
 * The green box a held left click draws to select units. The slide speed control takes the left click held to brake,
 * so the box is taken away while it does (see SlideSpeedControl), and given back once the hero stops sliding async.
 *
 * Only what the player of this machine sees and can select: no handle is made, so it may differ from one machine to
 * another. Imports nothing, so that anything may call it without closing a require cycle.
 */
const state = { isEnabled: true }

export const isLocalDragSelectEnabled = () => state.isEnabled

/** For the player of this machine. Does nothing when already so */
export const setLocalDragSelectEnabled = (isEnabled: boolean) => {
    if (isEnabled === state.isEnabled) {
        return
    }

    state.isEnabled = isEnabled
    EnableDragSelect(isEnabled, isEnabled)
}
