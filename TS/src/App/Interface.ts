import { Ascii2String } from 'core/01_libraries/Ascii'
import { arrayPush } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { ServiceManager } from 'Services'
import { getUdgEscapers, getUdgTerrainTypes } from '../../globals'
import { terrainItems } from './Media/Terrains'

export type IItem = { texFile?: string; title: string; scale?: '1:1' | '2:1' }

export type InterfaceProps = {
    cb: (props: {
        setPalettesVisible: ({ visible, playerId }: { visible: boolean; playerId: number }) => void
        resetPalettesUI: (playerId: number) => void
        addCommandToHistory: (command: string, playerId: number) => void
    }) => void
}

type ICommandHistoryEntry = {
    command: string
    timestamp: number
    pinned: boolean
    id: number
    playerId: number
}

const MAX_HISTORY_SIZE = 20
const lazyTimerTimeout = 0.01

class InterfaceManager {
    private frames: Map<string, framehandle> = new Map()
    private triggers: trigger[] = []
    private palettesVisibleByPlayer: Map<number, boolean> = new Map()
    private posByPlayer: Map<number, { x: number; y: number }> = new Map()
    private historyByPlayer: Map<number, ICommandHistoryEntry[]> = new Map()
    private nextIdByPlayer: Map<number, number> = new Map()
    private terrainState = ''
    private usedTerrains: IItem[] = []
    private terrainItemFrames: Map<
        string,
        { container: framehandle; backdrop: framehandle; text: framehandle; trigger: trigger }
    > = new Map()
    private historyFrames: Map<
        number,
        {
            container: framehandle
            text: framehandle
            pinBtn: framehandle
            removeBtn: framehandle
            pinTrigger: trigger
            removeTrigger: trigger
            clickTrigger: trigger
        }
    > = new Map()

    private readonly defaultPalettesPos = { x: 0.007, y: 0.471 }
    private readonly historyPos = { x: 0.6, y: 0.5 }

    private lazyRebuildHistoryTimer = CreateTimer()
    private lazyForceUpdateTimer = CreateTimer()

    private forceUpdateCallback: (() => void) | null = null
    private callbacks: {
        setPalettesVisible: (args: { visible: boolean; playerId: number }) => void
        resetPalettesUI: (playerId: number) => void
        addCommandToHistory: (command: string, playerId: number) => void
    } | null = null

    public init(cb: InterfaceProps['cb']): void {
        const manager = this

        this.callbacks = {
            setPalettesVisible: ({ playerId, visible }) => {
                manager.setPalettesVisible(playerId, visible)
            },
            resetPalettesUI: playerId => {
                manager.resetPalettesUI(playerId)
            },
            addCommandToHistory: (command, playerId) => {
                manager.addCommandToHistory(command, playerId)
            },
        }

        cb(this.callbacks)

        // Create main UI structure
        this.createFrames()
        this.updateTerrainState()
    }

    private createFrames(): void {
        const parent = BlzGetFrameByName('ConsoleUIBackdrop', 0)!

        // Main root container
        const rootContainer = BlzCreateFrameByType('FRAME', 'InterfaceRoot', parent, '', 0)!
        this.frames.set('rootContainer', rootContainer)

        // Palettes container
        const palettesContainer = BlzCreateFrameByType('FRAME', 'InterfaceVisibleContainer', rootContainer, '', 0)!
        this.frames.set('palettesContainer', palettesContainer)
        BlzFrameSetVisible(palettesContainer, false)

        // Terrain items container
        const terrainContainer = BlzCreateFrameByType('FRAME', 'InterfaceTerrainContainer', palettesContainer, '', 0)!
        this.frames.set('terrainContainer', terrainContainer)

        // Terrain backdrop
        const terrainBackdrop = BlzCreateFrameByType(
            'BACKDROP',
            'InterfaceTerrainBackdrop',
            terrainContainer,
            'EscMenuBackdrop',
            0
        )!
        this.frames.set('terrainBackdrop', terrainBackdrop)

        // Command history container
        const historyRootContainer = BlzCreateFrameByType('FRAME', 'InterfaceHistoryRoot', rootContainer, '', 0)!
        this.frames.set('historyRootContainer', historyRootContainer)
        BlzFrameSetVisible(historyRootContainer, false)
    }

    private updateTerrainState(): void {
        const usedTerrains: IItem[] = []
        const udgTerrainTypes = getUdgTerrainTypes().getAll()

        for (let i = 0; i < getUdgTerrainTypes().getLastInstanceId(); i++) {
            const terrain = udgTerrainTypes[i]
            if (terrain !== undefined && terrain !== null) {
                arrayPush(
                    usedTerrains,
                    terrainItems.find(item => item.title === Ascii2String(terrain.terrainTypeId)) ||
                        ({ title: Ascii2String(terrain.terrainTypeId) } as IItem)
                )
            }
        }

        const newState = usedTerrains.map(t => t.title).join('_')
        if (this.terrainState !== newState) {
            this.terrainState = newState
            this.usedTerrains = usedTerrains
            this.rebuildTerrainItems()
        }
    }

    private rebuildTerrainItems(): void {
        // Clean up old terrain item frames
        for (const [key, frames] of this.terrainItemFrames) {
            if (frames.trigger !== null) {
                DestroyTrigger(frames.trigger)
            }
            BlzDestroyFrame(frames.text)
            BlzDestroyFrame(frames.backdrop)
            BlzDestroyFrame(frames.container)
        }
        this.terrainItemFrames.clear()

        // Calculate layout
        const maxNbCols = 16
        const margin = 0.0075
        const containerMargin = margin * 4
        const itemSize = 0.03

        const nbRows = Math.ceil(this.usedTerrains.length / maxNbCols)
        const nbCols = Math.min(maxNbCols, this.usedTerrains.length)

        const terrainContainer = this.frames.get('terrainContainer')!

        // Create terrain item frames
        for (let i = 0; i < this.usedTerrains.length; i++) {
            const item = this.usedTerrains[i]

            const itemKey = `terrain_${i}_${item.title}`

            // Create item container
            const itemContainer = BlzCreateFrameByType('FRAME', `TerrainItem_${i}`, terrainContainer, '', 0)!

            // Create backdrop
            const backdrop = BlzCreateSimpleFrame(
                `TerrainPreview_${item.scale}`,
                itemContainer,
                0
            )!
            BlzFrameSetSize(backdrop, itemSize, itemSize)

            // Set texture if available
            if (item.texFile) {
                BlzFrameSetTexture(BlzGetFrameByName(`TerrainPreviewValue_${item.scale}`, 0)!, item.texFile, 0, false)
            }

            // Create text button
            const text = BlzCreateFrameByType(
                'TEXT',
                `TerrainText_${i}`,
                BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)!,
                '',
                0
            )!
            BlzFrameSetText(text, item.title)
            BlzFrameSetSize(text, itemSize, itemSize)

            // Create click trigger
            const trigger = CreateTrigger()!
            BlzTriggerRegisterFrameEvent(trigger, text, FRAMEEVENT_CONTROL_CLICK)
            TriggerAddAction(trigger, () => {
                const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()!))
                const terrainType = getUdgTerrainTypes().getByCode(item.title)

                if (escaper && terrainType) {
                    escaper.makeCreateTerrainBrush(terrainType, 1, 'square')
                    Text.mkP(escaper.getPlayer(), 'creating terrain on')
                }
            })

            this.terrainItemFrames.set(itemKey, {
                container: itemContainer,
                backdrop,
                text,
                trigger,
            })

            this.triggers.push(trigger)
        }

        this.updateLayout()
    }

    private updateLayout(): void {
        const maxNbCols = 16
        const margin = 0.0075
        const containerMargin = margin * 4
        const itemSize = 0.03

        const nbRows = Math.ceil(this.usedTerrains.length / maxNbCols)
        const nbCols = Math.min(maxNbCols, this.usedTerrains.length)

        // Update for each player based on their position
        for (const [playerId, visible] of this.palettesVisibleByPlayer) {
            const mainPos = this.posByPlayer.get(playerId) || this.defaultPalettesPos

            const containerX = mainPos.x - containerMargin
            const containerY = mainPos.y + containerMargin
            const containerWidth = margin + nbCols * itemSize + nbCols * margin + containerMargin * 2
            const containerHeight = margin + nbRows * itemSize + nbRows * margin + containerMargin * 2

            // Update backdrop position and size (player-specific)
            if (GetPlayerId(GetLocalPlayer()!) === playerId) {
                const terrainBackdrop = this.frames.get('terrainBackdrop')!
                BlzFrameSetAbsPoint(terrainBackdrop, FRAMEPOINT_TOPLEFT, containerX, containerY)
                BlzFrameSetSize(terrainBackdrop, containerWidth, containerHeight)
            }

            // Update item positions and visibilities
            let i = 0
            for (const [key, frames] of this.terrainItemFrames) {
                const row = Math.floor(i / nbCols)
                const col = i % nbCols

                const x = mainPos.x + margin + col * itemSize + col * margin
                const y = mainPos.y - margin - row * itemSize - row * margin

                if (GetPlayerId(GetLocalPlayer()!) === playerId) {
                    BlzFrameSetAbsPoint(frames.backdrop, FRAMEPOINT_TOPLEFT, x, y)
                    BlzFrameSetAbsPoint(frames.text, FRAMEPOINT_TOPLEFT, x, y)
                    BlzFrameSetVisible(frames.backdrop, visible) // We apply visibility on text because they are children of GameUI instead of terrain container
                    BlzFrameSetVisible(frames.text, visible) // We apply visibility on text because they are children of GameUI instead of terrain container
                }

                i++
            }
        }
    }

    private rebuildHistoryFramesNow() {
        // Clean up old history frames
        for (const [id, frames] of this.historyFrames) {
            DestroyTrigger(frames.pinTrigger)
            DestroyTrigger(frames.removeTrigger)
            DestroyTrigger(frames.clickTrigger)
            BlzDestroyFrame(frames.text)
            BlzDestroyFrame(frames.pinBtn)
            BlzDestroyFrame(frames.removeBtn)
            BlzDestroyFrame(frames.container)
        }
        this.historyFrames.clear()

        const localPlayerId = GetPlayerId(GetLocalPlayer()!)
        const localEntries = this.getEntriesForPlayer(localPlayerId)

        // Sort entries
        const sortedEntries = [...localEntries].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1
            if (!a.pinned && b.pinned) return 1
            return b.timestamp - a.timestamp
        })

        const containerPadding = 0.008
        const entryHeight = 0.015
        const buttonSize = 0.025
        const containerWidth = 0.25
        const containerHeight = 0.045 + sortedEntries.length * (entryHeight + 0.001)

        const historyRootContainer = this.frames.get('historyRootContainer')!

        // Create/update history backdrop
        let historyBackdrop = this.frames.get('historyBackdrop')
        if (!historyBackdrop) {
            historyBackdrop = BlzCreateFrameByType(
                'BACKDROP',
                'InterfaceHistoryBackdrop',
                historyRootContainer,
                'EscMenuBackdrop',
                0
            )!
            this.frames.set('historyBackdrop', historyBackdrop)
        }

        if (GetPlayerId(GetLocalPlayer()!) === localPlayerId) {
            BlzFrameSetAbsPoint(historyBackdrop, FRAMEPOINT_TOPLEFT, this.historyPos.x, this.historyPos.y)
            BlzFrameSetSize(historyBackdrop, containerWidth, containerHeight)
        }

        // Create frames for each entry
        for (let i = 0; i < sortedEntries.length; i++) {
            const entry = sortedEntries[i]
            const entryY = this.historyPos.y - containerPadding - 0.02 - i * entryHeight

            const entryContainer = BlzCreateFrameByType(
                'FRAME',
                `HistoryEntry_${entry.id}`,
                historyRootContainer,
                '',
                0
            )!

            // Command text
            const text = BlzCreateFrameByType('TEXT', `HistoryText_${entry.id}`, entryContainer, '', 0)!
            const displayText = `${entry.pinned ? '|cff00ff00[PIN] |r' : ''}|cffaaaaaa${entry.command}|r`
            BlzFrameSetText(text, displayText)

            if (GetPlayerId(GetLocalPlayer()!) === localPlayerId) {
                BlzFrameSetAbsPoint(
                    text,
                    FRAMEPOINT_TOPLEFT,
                    this.historyPos.x + containerPadding + 0.02,
                    entryY - 0.001
                )
                BlzFrameSetSize(
                    text,
                    containerWidth - containerPadding * 2 - buttonSize * 2 - 0.02,
                    entryHeight - 0.004
                )
            }

            const clickTrigger = CreateTrigger()!
            BlzTriggerRegisterFrameEvent(clickTrigger, text, FRAMEEVENT_CONTROL_CLICK)
            TriggerAddAction(clickTrigger, () => {
                const escaper = getUdgEscapers().get(GetPlayerId(GetTriggerPlayer()!))
                if (escaper) {
                    ServiceManager.getService('Cmd').ExecuteCommand(escaper, entry.command)
                }
            })

            // Pin button
            const pinBtn = BlzCreateFrameByType(
                'GLUETEXTBUTTON',
                `HistoryPin_${entry.id}`,
                entryContainer,
                'ScriptDialogButton',
                0
            )!
            BlzFrameSetText(pinBtn, entry.pinned ? '|cff00ff00*|r' : '|cffcccccc*|r')
            BlzFrameSetScale(pinBtn, 0.7)

            if (GetPlayerId(GetLocalPlayer()!) === localPlayerId) {
                BlzFrameSetAbsPoint(
                    pinBtn,
                    FRAMEPOINT_TOPRIGHT,
                    this.historyPos.x + containerWidth - 0.028 - buttonSize + 0.01,
                    entryY
                )
                BlzFrameSetSize(pinBtn, buttonSize, buttonSize)
            }

            const pinTrigger = CreateTrigger()!
            BlzTriggerRegisterFrameEvent(pinTrigger, pinBtn, FRAMEEVENT_CONTROL_CLICK)
            const entryId = entry.id
            TriggerAddAction(pinTrigger, () => {
                this.togglePin(entryId, GetPlayerId(GetTriggerPlayer()!))
            })

            // Remove button
            const removeBtn = BlzCreateFrameByType(
                'GLUETEXTBUTTON',
                `HistoryRemove_${entry.id}`,
                entryContainer,
                'ScriptDialogButton',
                0
            )!
            BlzFrameSetText(removeBtn, '|cffff0000X|r')
            BlzFrameSetScale(removeBtn, 0.7)

            if (GetPlayerId(GetLocalPlayer()!) === localPlayerId) {
                BlzFrameSetAbsPoint(removeBtn, FRAMEPOINT_TOPRIGHT, this.historyPos.x + containerWidth - 0.028, entryY)
                BlzFrameSetSize(removeBtn, buttonSize, buttonSize)
            }

            const removeTrigger = CreateTrigger()!
            BlzTriggerRegisterFrameEvent(removeTrigger, removeBtn, FRAMEEVENT_CONTROL_CLICK)
            TriggerAddAction(removeTrigger, () => {
                this.removeEntry(entryId, GetPlayerId(GetTriggerPlayer()!))
            })

            this.historyFrames.set(entry.id, {
                container: entryContainer,
                text,
                pinBtn,
                removeBtn,
                pinTrigger,
                removeTrigger,
                clickTrigger,
            })

            this.triggers.push(clickTrigger, pinTrigger, removeTrigger)
        }
    }

    private rebuildHistoryFrames(): void {
        TimerStart(this.lazyRebuildHistoryTimer, lazyTimerTimeout, false, () => this.rebuildHistoryFramesNow())
    }

    public setPalettesVisible(playerId: number, visible: boolean): void {
        this.palettesVisibleByPlayer.set(playerId, visible)

        if (GetPlayerId(GetLocalPlayer()!) === playerId) {
            const palettesContainer = this.frames.get('palettesContainer')!
            BlzFrameSetVisible(palettesContainer, visible)
            this.updateLayout()
        }
    }

    public resetPalettesUI(playerId: number): void {
        this.posByPlayer.set(playerId, this.defaultPalettesPos)
        this.updateLayout()
    }

    public addCommandToHistory(command: string, playerId: number): void {
        const playerHistory = this.historyByPlayer.get(playerId) || []

        // Don't add duplicate commands
        if (playerHistory.some(entry => entry.command === command)) {
            return
        }

        const nextId = this.nextIdByPlayer.get(playerId) || 1
        this.nextIdByPlayer.set(playerId, nextId + 1)

        const newEntry: ICommandHistoryEntry = {
            command,
            timestamp: os.clock(),
            pinned: false,
            id: nextId,
            playerId,
        }

        let updatedHistory = [newEntry, ...playerHistory]
        updatedHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE)

        this.historyByPlayer.set(playerId, updatedHistory)

        if (GetPlayerId(GetLocalPlayer()!) === playerId) {
            this.rebuildHistoryFrames()
        }
    }

    private togglePin(id: number, playerId: number): void {
        const playerHistory = this.historyByPlayer.get(playerId) || []
        const updatedHistory = playerHistory.map(entry =>
            entry.id === id ? { ...entry, pinned: !entry.pinned } : entry
        )
        this.historyByPlayer.set(playerId, updatedHistory)

        if (GetPlayerId(GetLocalPlayer()!) === playerId) {
            this.rebuildHistoryFrames()
        }
    }

    private removeEntry(id: number, playerId: number): void {
        const playerHistory = this.historyByPlayer.get(playerId) || []
        const updatedHistory = playerHistory.filter(entry => entry.id !== id)
        this.historyByPlayer.set(playerId, updatedHistory)

        if (GetPlayerId(GetLocalPlayer()!) === playerId) {
            this.rebuildHistoryFrames()
        }
    }

    public clearUnpinned(playerId: number): void {
        const playerHistory = this.historyByPlayer.get(playerId) || []
        const updatedHistory = playerHistory.filter(entry => entry.pinned)
        this.historyByPlayer.set(playerId, updatedHistory)

        if (GetPlayerId(GetLocalPlayer()!) === playerId) {
            this.rebuildHistoryFrames()
        }
    }

    private getEntriesForPlayer(playerId: number): ICommandHistoryEntry[] {
        return this.historyByPlayer.get(playerId) || []
    }

    public updateHistoryVisibility(visible: boolean): void {
        const historyRootContainer = this.frames.get('historyRootContainer')!
        BlzFrameSetVisible(historyRootContainer, visible)
    }

    private forceUpdateNow(){
        this.updateTerrainState()
        this.updateLayout()

        const reactService = ServiceManager.getService('React')
        const localPlayerId = GetPlayerId(GetLocalPlayer()!)
        this.updateHistoryVisibility(reactService.getHistoryVisible(localPlayerId))

        this.rebuildHistoryFrames()
    }

    public forceUpdate(): void {
        TimerStart(this.lazyForceUpdateTimer, lazyTimerTimeout, false, () => this.forceUpdateNow())
    }

    public destroy(): void {
        // Destroy all triggers
        for (const trigger of this.triggers) {
            DestroyTrigger(trigger)
        }
        this.triggers = []

        // Destroy terrain item frames
        for (const [key, frames] of this.terrainItemFrames) {
            if (frames.trigger !== null) {
                DestroyTrigger(frames.trigger)
            }
            BlzDestroyFrame(frames.text)
            BlzDestroyFrame(frames.backdrop)
            BlzDestroyFrame(frames.container)
        }
        this.terrainItemFrames.clear()

        // Destroy history frames
        for (const [id, frames] of this.historyFrames) {
            DestroyTrigger(frames.pinTrigger)
            DestroyTrigger(frames.removeTrigger)
            DestroyTrigger(frames.clickTrigger)
            BlzDestroyFrame(frames.text)
            BlzDestroyFrame(frames.pinBtn)
            BlzDestroyFrame(frames.removeBtn)
            BlzDestroyFrame(frames.container)
        }
        this.historyFrames.clear()

        // Destroy main frames
        for (const [key, frame] of this.frames) {
            BlzDestroyFrame(frame)
        }
        this.frames.clear()
    }
}

export const Interface = ({ cb }: InterfaceProps) => {
    const manager = new InterfaceManager()
    manager.init(cb)
    return manager
}
