export type ICommandHistoryEntry = {
    command: string
    timestamp: number
    pinned: boolean
    id: number
    playerId: number
}

export type CommandHistoryProps = {
    visible: boolean
    allEntries: ICommandHistoryEntry[]
    position: { x: number; y: number }
    onPinToggle: (id: number) => void
    onRemove: (id: number) => void
    onCommandClick: (command: string) => void
}

export interface CommandHistoryFrameEntry {
    id: number
    container: framehandle
    text: framehandle
    pinBtn: framehandle
    removeBtn: framehandle
    textTrigger: trigger
    pinTrigger: trigger
    removeTrigger: trigger
}

export interface CommandHistoryFrames {
    mainContainer: framehandle
    background: framehandle
    entries: CommandHistoryFrameEntry[]
    destroy: () => void
}

export const createCommandHistory = ({
    visible,
    allEntries,
    position,
    onPinToggle,
    onRemove,
    onCommandClick,
}: CommandHistoryProps): CommandHistoryFrames => {
    const containerPadding = 0.008
    const entryHeight = 0.015
    const buttonWidth = 0.025
    const containerWidth = 0.25

    const localPlayerId = GetPlayerId(GetLocalPlayer())
    const localEntries = allEntries.filter(e => e.playerId === localPlayerId)

    // Sort entries: pinned first, then by timestamp (newest first)
    const sortedEntries = [...localEntries].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return b.timestamp - a.timestamp
    })

    const containerHeight = 0.045 + sortedEntries.length * (entryHeight + 0.001)

    // Create main container
    const mainContainer = BlzCreateFrameByType(
        'FRAME',
        'CommandHistoryContainer',
        BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0)!,
        '',
        0
    )!
    BlzFrameSetAbsPoint(mainContainer, FRAMEPOINT_TOPLEFT, position.x, position.y)
    BlzFrameSetSize(mainContainer, containerWidth, containerHeight)

    // Set visibility for local player
    if (GetLocalPlayer() === GetLocalPlayer()) {
        BlzFrameSetVisible(mainContainer, visible)
    }

    // Create background backdrop
    const background = BlzCreateFrame('EscMenuBackdrop', mainContainer, 0, 0)!
    BlzFrameSetAllPoints(background, mainContainer)
    BlzFrameSetSize(background, containerWidth, containerHeight)

    // Create entries array
    const entries: CommandHistoryFrameEntry[] = []

    // Create frames for each entry
    for (const entry of allEntries) {
        const isLocalEntry = entry.playerId === localPlayerId
        const localIndex = sortedEntries.findIndex(e => e.id === entry.id)
        const entryY = position.y - containerPadding - 0.02 - localIndex * entryHeight
        const isPinned = entry.pinned
        const entryVisible = visible && isLocalEntry && localIndex !== -1

        // Create entry container
        const entryContainer = BlzCreateFrameByType('FRAME', `CommandHistoryEntry_${entry.id}`, mainContainer, '', 0)!
        BlzFrameSetAbsPoint(entryContainer, FRAMEPOINT_TOPLEFT, position.x, entryY)
        BlzFrameSetSize(entryContainer, containerWidth, entryHeight)

        // Set entry visibility for local player only
        if (GetLocalPlayer() === GetLocalPlayer()) {
            BlzFrameSetVisible(entryContainer, entryVisible)
        }

        // Create command text (clickable)
        const textFrame = BlzCreateFrameByType('TEXT', `CommandHistoryText_${entry.id}`, entryContainer, '', 0)!
        BlzFrameSetAbsPoint(textFrame, FRAMEPOINT_TOPLEFT, position.x + containerPadding + 0.02, entryY - 0.001)
        BlzFrameSetSize(textFrame, containerWidth - containerPadding * 2 - buttonWidth * 2 - 0.02, entryHeight - 0.004)
        const displayText = `${isPinned ? '|cff00ff00[PIN] |r' : ''}|cffaaaaaa${entry.command}|r`
        BlzFrameSetText(textFrame, displayText)
        BlzFrameSetEnable(textFrame, true)

        // Create trigger for text click
        const textTrigger = CreateTrigger()!
        BlzTriggerRegisterFrameEvent(textTrigger, textFrame, FRAMEEVENT_CONTROL_CLICK)
        TriggerAddAction(textTrigger, () => {
            if (GetTriggerPlayer() === GetLocalPlayer()) {
                onCommandClick(entry.command)
            }
        })

        // Create pin/unpin button
        const pinBtn = BlzCreateFrame('ScriptDialogButton', entryContainer, 0, 0)!
        BlzFrameSetAbsPoint(
            pinBtn,
            FRAMEPOINT_TOPRIGHT,
            position.x + containerWidth - 0.04 - (buttonWidth + 0.001),
            entryY
        )
        BlzFrameSetSize(pinBtn, buttonWidth, buttonWidth)
        BlzFrameSetScale(pinBtn, 0.7)
        const pinText = isPinned ? '|cff00ff00*|r' : '|cffcccccc*|r'
        BlzFrameSetText(BlzGetFrameByName('ScriptDialogButtonText', 0)!, pinText)

        // Create trigger for pin button click
        const pinTrigger = CreateTrigger()!
        BlzTriggerRegisterFrameEvent(pinTrigger, pinBtn, FRAMEEVENT_CONTROL_CLICK)
        TriggerAddAction(pinTrigger, () => {
            if (GetTriggerPlayer() === GetLocalPlayer()) {
                onPinToggle(entry.id)
            }
        })

        // Create remove button
        const removeBtn = BlzCreateFrame('ScriptDialogButton', entryContainer, 0, 0)!
        BlzFrameSetAbsPoint(removeBtn, FRAMEPOINT_TOPRIGHT, position.x + containerWidth - 0.04, entryY)
        BlzFrameSetSize(removeBtn, buttonWidth, buttonWidth)
        BlzFrameSetScale(removeBtn, 0.7)
        BlzFrameSetText(BlzGetFrameByName('ScriptDialogButtonText', 0)!, '|cffff0000X|r')

        // Create trigger for remove button click
        const removeTrigger = CreateTrigger()!
        BlzTriggerRegisterFrameEvent(removeTrigger, removeBtn, FRAMEEVENT_CONTROL_CLICK)
        TriggerAddAction(removeTrigger, () => {
            if (GetTriggerPlayer() === GetLocalPlayer()) {
                onRemove(entry.id)
            }
        })

        entries.push({
            id: entry.id,
            container: entryContainer,
            text: textFrame,
            pinBtn,
            removeBtn,
            textTrigger,
            pinTrigger,
            removeTrigger,
        })
    }

    // Create destroy method for cleanup
    function destroy(this: any) {
        // Destroy all entry triggers and frames
        for (const entry of entries) {
            DestroyTrigger(entry.textTrigger)
            DestroyTrigger(entry.pinTrigger)
            DestroyTrigger(entry.removeTrigger)
            BlzDestroyFrame(entry.text)
            BlzDestroyFrame(entry.pinBtn)
            BlzDestroyFrame(entry.removeBtn)
            BlzDestroyFrame(entry.container)
        }

        // Destroy background and main container
        BlzDestroyFrame(background)
        BlzDestroyFrame(mainContainer)
    }

    return {
        mainContainer,
        background,
        entries,
        destroy,
    }
}
