import { SyncSaveLoad } from './TreeLib/SyncSaveLoad'

export type ISaveLoad = ReturnType<typeof initSaveLoad>

export const initSaveLoad = () => {
    const syncSaveLoad = SyncSaveLoad(true)

    // We cache files in memory since readFile is cached by the blizzard natives
    const localFileCache: { [x: string]: string } = {}

    return {
        saveFile: (fileName: string, player: player | null, data: string) => {
            player && (localFileCache[`${GetPlayerId(player)}_${fileName}`] = data)

            if (!player || GetLocalPlayer() === player) {
                syncSaveLoad.writeFile(fileName, data)
            }
        },
        readFile: (fileName: string, player: player, onRead: (promise: string) => void) => {
            if (localFileCache[`${GetPlayerId(player)}_${fileName}`]) {
                onRead(localFileCache[`${GetPlayerId(player)}_${fileName}`])
            } else {
                syncSaveLoad.read(fileName, player, data => {
                    localFileCache[`${GetPlayerId(player)}_${fileName}`] = data
                    onRead(data)
                })
            }
        },
    }
}
