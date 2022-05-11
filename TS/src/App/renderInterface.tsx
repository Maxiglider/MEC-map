import * as React from 'w3ts-jsx/dist/src/index'
import { Interface, InterfaceProps } from './Interface'

export type IRenderInterface = ReturnType<typeof renderInterface>

export const renderInterface = (props: InterfaceProps) => {
    let forceUpdate: (() => void) | null = null

    return {
        init: () => {
            BlzLoadTOCFile('war3mapImported\\TerrainPreview_1x1.toc')
            BlzLoadTOCFile('war3mapImported\\TerrainPreview_2x1.toc')

            React.render(<Interface {...props} />, BlzGetFrameByName('ConsoleUIBackdrop', 0))
        },
        setForceUpdate: (cb: (() => void) | null) => (forceUpdate = cb),
        forceUpdate: () => forceUpdate?.(),
    }
}
