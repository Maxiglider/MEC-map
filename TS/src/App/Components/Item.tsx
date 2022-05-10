import { IItem } from 'App/Interface'
import * as React from 'w3ts-jsx/dist/src/index'
import { IAbsPos } from '../Utils'

export const Item = ({
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
}) => (
    <container visible={visible}>
        <backdrop
            name={`TerrainPreview_${v.scale}`}
            isSimple={true}
            absPosition={absPosition}
            size={size}
            visible={visible}
            onLoad={() =>
                BlzFrameSetTexture(BlzGetFrameByName(`TerrainPreviewValue_${v.scale}`, 0), v.texFile, 0, false)
            }
        />

        <text
            text={v.title}
            absPosition={absPosition}
            onClick={onClick}
            size={size}
            parentFrame={BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)}
            visible={visible}
        />
    </container>
)
