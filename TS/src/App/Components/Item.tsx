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
}) => {
    const ref = React.useRef<framehandle | null>(null)

    const r = (
        <container visible={visible} ref={ref}>
            <backdrop
                name={'TerrainPreview'}
                isSimple={true}
                texture={{ texFile: v.texFile }}
                absPosition={absPosition}
                size={size}
            />

            <text
                text={v.title}
                absPosition={absPosition}
                onClick={onClick}
                size={size}
                parentFrame={BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)}
            />
        </container>
    )

    BlzFrameSetTexture(BlzGetFrameByName('TerrainPreviewValue', 0), v.texFile, 0, false)

    return r
}
