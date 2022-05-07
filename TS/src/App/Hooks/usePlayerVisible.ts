import * as React from 'w3ts-jsx/dist/src/index'

export const usePlayerVariable = <T>() => {
    const [state, setState] = React.useState<{ [playerId: number]: T | undefined }>({})

    return {
        get: ({ playerId }: { playerId: number }) => state[playerId],
        set: ({ playerId, value }: { playerId: number; value: T }) => setState(s => ({ ...s, [playerId]: value })),
    }
}
