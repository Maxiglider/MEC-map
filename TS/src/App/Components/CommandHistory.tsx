import * as React from 'w3ts-jsx/dist/src/index'

export type ICommandHistoryEntry = {
    command: string
    timestamp: number
    pinned: boolean
    id: number
}

export type CommandHistoryProps = {
    visible: boolean
    entries: ICommandHistoryEntry[]
    position: { x: number; y: number }
    onPinToggle: (id: number) => void
    onRemove: (id: number) => void
    onCommandClick: (command: string) => void
}

export const CommandHistory = ({
    visible,
    entries,
    position,
    onPinToggle,
    onRemove,
    onCommandClick,
}: CommandHistoryProps) => {
    const containerPadding = 0.008
    const entryHeight = 0.015
    const buttonWidth = 0.025
    const containerWidth = 0.25

    // Sort entries: pinned first, then by timestamp (newest first)
    const sortedEntries = [...entries].sort((a, b) => {
        if (a.pinned && !b.pinned) return -1
        if (!a.pinned && b.pinned) return 1
        return b.timestamp - a.timestamp
    })

    const containerHeight = 0.045 + sortedEntries.length * (entryHeight + 0.001)

    return (
        <container visible={visible}>
            {/* Background */}
            <backdrop
                inherits="EscMenuBackdrop"
                absPosition={{
                    point: FRAMEPOINT_TOPLEFT,
                    x: position.x,
                    y: position.y,
                }}
                size={{ width: containerWidth, height: containerHeight }}
            />

            {/* Command entries */}
            {sortedEntries.map((entry, index) => {
                const entryY = position.y - containerPadding - 0.02 - index * entryHeight
                const isPinned = entry.pinned

                return (
                    <container key={entry.id}>
                        {/* Command text - clickable */}
                        <text
                            text={`${isPinned ? '|cff00ff00[PIN] |r' : ''}|cffaaaaaa${entry.command}|r`}
                            absPosition={{
                                point: FRAMEPOINT_TOPLEFT,
                                x: position.x + containerPadding + 0.02,
                                y: entryY - 0.001,
                            }}
                            size={{
                                width: containerWidth - containerPadding * 2 - buttonWidth * 2 - 0.02,
                                height: entryHeight - 0.004,
                            }}
                            onClick={() => onCommandClick(entry.command)}
                        />

                        {/* Pin/Unpin button */}
                        <gluetextbutton
                            inherits="ScriptDialogButton"
                            text={isPinned ? '|cff00ff00*|r' : '|cffcccccc*|r'}
                            scale={0.7}
                            absPosition={{
                                point: FRAMEPOINT_TOPRIGHT,
                                x: position.x + containerWidth - 0.04 - (buttonWidth + 0.001),
                                y: entryY,
                            }}
                            size={{ width: buttonWidth, height: buttonWidth }}
                            onClick={() => onPinToggle(entry.id)}
                        />

                        {/* Remove button */}
                        <gluetextbutton
                            inherits="ScriptDialogButton"
                            text="|cffff0000X|r"
                            scale={0.7}
                            absPosition={{
                                point: FRAMEPOINT_TOPRIGHT,
                                x: position.x + containerWidth - 0.04,
                                y: entryY,
                            }}
                            size={{ width: buttonWidth, height: buttonWidth }}
                            onClick={() => onRemove(entry.id)}
                        />
                    </container>
                )
            })}
        </container>
    )
}
