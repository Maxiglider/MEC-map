import { createTimer } from '../../Utils/mapUtils'

let minimap: framehandle
let minimapOriginalParent: framehandle
let parentFullscreen: framehandle
let minimapBackground: framehandle
let consoleUIBackdrop: framehandle
let consoleUI: framehandle
let portrait: framehandle

const minimapSize = 0.15

export const init_customUI = function () {
    createTimer(2, false, () => {
        minimap = BlzGetFrameByName('MiniMapFrame', 0)
        minimapOriginalParent = BlzFrameGetParent(minimap)

        /**
         * Frame parent to allow above 4:3
         */
        // ServiceManager.getService('Multiboard').getOrCreateLeaderboard()
        CreateLeaderboardBJ(bj_FORCE_ALL_PLAYERS, 'title')
        parentFullscreen = BlzGetFrameByName('Leaderboard', 0)
        BlzFrameSetSize(parentFullscreen, 0, 0)
        BlzFrameSetVisible(BlzGetFrameByName('LeaderboardBackdrop', 0), false)
        BlzFrameSetVisible(BlzGetFrameByName('LeaderboardTitle', 0), false)

        /**
         * Calculate left coordinate
         */
        const screenRatio = BlzGetLocalClientWidth() / BlzGetLocalClientHeight()
        const width = (0.8 * screenRatio) / (4 / 3)
        let left = 0.4 - width / 2

        /**
         * Place a minimapBackground for the minimap
         */
        const outOffScreeBackground = 0.2
        minimapBackground = BlzCreateFrame('QuestButtonDisabledBackdropTemplate', parentFullscreen, 0, 0)
        BlzFrameSetAbsPoint(
            minimapBackground,
            FRAMEPOINT_BOTTOMLEFT,
            left - outOffScreeBackground,
            -outOffScreeBackground
        )
        BlzFrameSetAbsPoint(minimapBackground, FRAMEPOINT_TOPRIGHT, left + minimapSize + 0.005, minimapSize + 0.005)
        BlzFrameSetVisible(minimapBackground, false)

        /**
         * Handles
         */
        consoleUIBackdrop = BlzGetFrameByName('ConsoleUIBackdrop', 0)
        consoleUI = BlzGetFrameByName('ConsoleUI', 0)
        portrait = BlzGetOriginFrame(ORIGIN_FRAME_PORTRAIT, 0)
    })
}

export const DisableInterface = function (showMinimap: boolean = true) {
    if (showMinimap) {
        BlzHideOriginFrames(false)
        BlzFrameSetVisible(portrait, false)
        placeMinimap()
    } else {
        BlzHideOriginFrames(true)
        resetMinimap()
    }

    BlzFrameSetVisible(consoleUIBackdrop, false)
    BlzFrameSetVisible(consoleUI, false)
}

export const EnableInterface = function () {
    BlzHideOriginFrames(false)
    BlzFrameSetVisible(consoleUIBackdrop, true)
    BlzFrameSetVisible(consoleUI, true)
    BlzFrameSetVisible(portrait, true)
    resetMinimap()
}

//minimap at bottom left corner
const placeMinimap = function () {
    /**
     * Calculate left coordinate
     */
    const screenRatio = BlzGetLocalClientWidth() / BlzGetLocalClientHeight()
    const width = (0.8 * screenRatio) / (4 / 3)
    let left = 0.4 - width / 2

    /**
     * Place the minimap  background
     */
    BlzFrameSetVisible(minimapBackground, true)

    /**
     * Place the minimap
     */
    BlzFrameSetParent(minimap, parentFullscreen)
    BlzFrameSetAbsPoint(minimap, FRAMEPOINT_BOTTOMLEFT, left, 0)
    BlzFrameSetAbsPoint(minimap, FRAMEPOINT_TOPRIGHT, left + minimapSize, minimapSize)
}

const resetMinimap = function () {
    BlzFrameSetParent(minimap, minimapOriginalParent)

    const offsetX = 0.0084
    const offsetY = 0.0072
    BlzFrameSetAbsPoint(minimap, FRAMEPOINT_BOTTOMLEFT, offsetX, offsetY)
    BlzFrameSetAbsPoint(minimap, FRAMEPOINT_TOPRIGHT, minimapSize + offsetX, minimapSize + offsetY)
    BlzFrameSetVisible(minimapBackground, false)
}
