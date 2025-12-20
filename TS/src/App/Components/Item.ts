import { IItem } from 'App/Interface'
import { IAbsPos } from '../Utils'

export interface ItemFrames {
    container: framehandle
    backdrop: framehandle
    text: framehandle
    trigger: trigger | null
}

export function createItem({
    v,
    absPosition,
    size,
    visible,
    onClick,
}: {
    v: IItem
    absPosition: IAbsPos
    size: { width: number; height: number }
    visible: boolean
    onClick?: () => void
}): ItemFrames {
    const parent = BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)!

    // Create container frame
    const container = BlzCreateFrameByType('FRAME', '', parent, '', 0)!
    BlzFrameSetAbsPoint(container, FRAMEPOINT_TOPLEFT, absPosition.x, absPosition.y)
    BlzFrameSetSize(container, size.width, size.height)
    BlzFrameSetVisible(container, visible)

    // Create backdrop frame using the template
    const backdrop = BlzCreateFrame(`TerrainPreview_${v.scale}`, container, 0, 0)!
    BlzFrameSetAbsPoint(backdrop, FRAMEPOINT_TOPLEFT, absPosition.x, absPosition.y)
    BlzFrameSetSize(backdrop, size.width, size.height)
    BlzFrameSetVisible(backdrop, visible)

    // Apply texture if it exists
    if (v.texFile) {
        const textureFrame = BlzGetFrameByName(`TerrainPreviewValue_${v.scale}`, 0)
        if (textureFrame) {
            BlzFrameSetTexture(textureFrame, v.texFile, 0, false)
        }
    }

    // Create text frame
    const text = BlzCreateFrameByType('TEXT', '', parent, '', 0)!
    BlzFrameSetAbsPoint(text, FRAMEPOINT_TOPLEFT, absPosition.x, absPosition.y)
    BlzFrameSetSize(text, size.width, size.height)
    BlzFrameSetText(text, v.title)
    BlzFrameSetVisible(text, visible)
    BlzFrameSetEnable(text, onClick !== undefined)

    // Set up click handler if provided
    let clickTrigger: trigger | null = null
    if (onClick) {
        clickTrigger = CreateTrigger()!
        BlzTriggerRegisterFrameEvent(clickTrigger, text, FRAMEEVENT_CONTROL_CLICK)
        TriggerAddAction(clickTrigger, () => onClick())
    }

    return {
        container,
        backdrop,
        text,
        trigger: clickTrigger,
    }
}
