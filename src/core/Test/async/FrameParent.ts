import { Natives } from '../../wc3_natives_unsecured/Natives'

/**
 * Frames parented to the game UI cannot leave the 4:3 center of the screen: they get malformed
 * past that border, which is why the click catcher never covered the side bands of a wide screen,
 * and why the mouse lattice could not track the cursor there either.
 *
 * Parenting them to "ConsoleUIBackdrop" lifts that limitation. The price is a lower layer, below
 * the simple frames, which costs nothing here as none is used any more.
 *
 * Source: "The Big UI-Frame Tutorial" by Tasyen, section "4:3 Limitation".
 */
export const getFullScreenFrameParent = () => {
    return BlzGetFrameByName('ConsoleUIBackdrop', 0) ?? Natives.UBlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)
}

/** Screen width in frame coordinates: 0.8 on a 4:3 screen, more on a wider one */
export const getScreenWidth = () => {
    const height = BlzGetLocalClientHeight()

    // the game returns 0 while minimized, and dividing by it would kill the thread
    if (height === 0) {
        return 0.8
    }

    return (BlzGetLocalClientWidth() / height) * 0.6
}
