import * as React from 'w3ts-jsx/dist/src/index'
import { ICommandHistoryEntry } from '../Components/CommandHistory'

export type ICommandHistoryManager = {
    entries: ICommandHistoryEntry[]
    addCommand: (command: string, playerId: number) => void
    togglePin: (id: number, playerId: number) => void
    removeEntry: (id: number, playerId: number) => void
    clearUnpinned: (playerId: number) => void
}

const MAX_HISTORY_SIZE = 20

// Global ID counter to avoid race conditions with rapid calls
const nextIdByPlayer: { [playerId: number]: number } = {}

export const useCommandHistory = () => {
    const [historyByPlayer, setHistoryByPlayer] = React.useState<{
        [playerId: number]: ICommandHistoryEntry[]
    }>({})

    const getNextId = (playerId: number): number => {
        const currentId = nextIdByPlayer[playerId] || 1
        nextIdByPlayer[playerId] = currentId + 1
        return currentId
    }

    const addCommand = (command: string, playerId: number) => {
        setHistoryByPlayer(prev => {
            const playerHistory = prev[playerId] || []

            // Don't add duplicate commands that already exist in history
            if (playerHistory.some(entry => entry.command === command)) {
                return prev
            }

            const newEntry: ICommandHistoryEntry = {
                command,
                timestamp: os.clock(),
                pinned: false,
                id: getNextId(playerId),
                playerId,
            }

            let updatedHistory = [newEntry, ...playerHistory]

            // Limit total history to MAX_HISTORY_SIZE
            updatedHistory = updatedHistory.slice(0, MAX_HISTORY_SIZE)

            return { ...prev, [playerId]: updatedHistory }
        })
    }

    const togglePin = (id: number, playerId: number) => {
        setHistoryByPlayer(prev => {
            const playerHistory = prev[playerId] || []
            const updatedHistory = playerHistory.map(entry =>
                entry.id === id ? { ...entry, pinned: !entry.pinned } : entry
            )
            return { ...prev, [playerId]: updatedHistory }
        })
    }

    const removeEntry = (id: number, playerId: number) => {
        setHistoryByPlayer(prev => {
            const playerHistory = prev[playerId] || []
            const updatedHistory = playerHistory.filter(entry => entry.id !== id)
            return { ...prev, [playerId]: updatedHistory }
        })
    }

    const clearUnpinned = (playerId: number) => {
        setHistoryByPlayer(prev => {
            const playerHistory = prev[playerId] || []
            const updatedHistory = playerHistory.filter(entry => entry.pinned)
            return { ...prev, [playerId]: updatedHistory }
        })
    }

    const getEntries = (playerId: number): ICommandHistoryEntry[] => {
        return historyByPlayer[playerId] || []
    }

    const getAllEntries = (): ICommandHistoryEntry[] => {
        const allEntries: ICommandHistoryEntry[] = []
        for (const playerId in historyByPlayer) {
            allEntries.push(...historyByPlayer[playerId])
        }
        return allEntries
    }

    return {
        getEntries,
        getAllEntries,
        addCommand,
        togglePin,
        removeEntry,
        clearUnpinned,
    }
}
