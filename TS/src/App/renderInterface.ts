import { Interface, InterfaceProps } from './Interface'

export type IRenderInterface = ReturnType<typeof renderInterface>

export const renderInterface = (props: InterfaceProps) => {
    let historyVisible: { [playerId: number]: boolean } = {}
    let manager: ReturnType<typeof Interface> | null = null
    let callbacks: {
        setPalettesVisible: (args: { visible: boolean; playerId: number }) => void
        resetPalettesUI: (playerId: number) => void
        addCommandToHistory: (command: string, playerId: number) => void
    } | null = null

    return {
        init: () => {
            // Load TOC files before initialization
            BlzLoadTOCFile('war3mapImported\\TerrainPreview_1x1.toc')
            BlzLoadTOCFile('war3mapImported\\TerrainPreview_2x1.toc')

            // Create and initialize the InterfaceManager
            manager = Interface(props)
            manager.init(cbs => {
                callbacks = cbs
                props.cb(cbs)
            })
        },
        setForceUpdate: (cb: (() => void) | null) => {
            // No-op for backward compatibility - the manager handles updates internally
        },
        forceUpdate: () => {
            manager?.forceUpdate()
        },
        getCallbacks: () => callbacks,
        getHistoryVisible: (playerId: number) => historyVisible[playerId] || false,
        setHistoryVisible: (playerId: number, visible: boolean) => {
            historyVisible[playerId] = visible
            
            if (GetPlayerId(GetLocalPlayer()) === playerId) {
                manager?.updateHistoryVisibility(visible)
            }
        },
        setClearUnpinnedCallback: (cb: ((playerId: number) => void) | null) => {
            // The callback is now set up internally in InterfaceManager.init()
            // This method is kept for backward compatibility but does nothing
        },
        clearUnpinnedHistory: (playerId: number) => {
            manager?.clearUnpinned(playerId);
        },
    }
}
