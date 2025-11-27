import * as React from 'w3ts-jsx/dist/src/index'
import { Interface, InterfaceProps } from './Interface'

export type IRenderInterface = ReturnType<typeof renderInterface>

export const renderInterface = (props: InterfaceProps) => {
    let forceUpdate: (() => void) | null = null
    let historyVisible: { [playerId: number]: boolean } = {}
    let clearUnpinnedCallback: ((playerId: number) => void) | null = null

    return {
        init: () => {
            BlzLoadTOCFile('war3mapImported\\TerrainPreview_1x1.toc')
            BlzLoadTOCFile('war3mapImported\\TerrainPreview_2x1.toc')

            React.render(<Interface {...props} />, BlzGetFrameByName('ConsoleUIBackdrop', 0))
        },
        setForceUpdate: (cb: (() => void) | null) => (forceUpdate = cb),
        forceUpdate: () => forceUpdate?.(),
        getHistoryVisible: (playerId: number) => historyVisible[playerId] || false,
        setHistoryVisible: (playerId: number, visible: boolean) => {
            historyVisible[playerId] = visible
            forceUpdate?.()
        },
        setClearUnpinnedCallback: (cb: ((playerId: number) => void) | null) => {
            clearUnpinnedCallback = cb
        },
        clearUnpinnedHistory: (playerId: number) => {
            clearUnpinnedCallback?.(playerId)
        },
    }
}
