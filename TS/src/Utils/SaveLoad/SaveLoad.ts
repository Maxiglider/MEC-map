import { SyncSaveLoad } from './TreeLib/SyncSaveLoad'

export type ISaveLoad = ReturnType<typeof initSaveLoad>

const BASE_64_DEFAULT = true

export const initSaveLoad = () => {
    const syncSaveLoad = SyncSaveLoad()

    // We cache files in memory since readFile is cached by the blizzard natives
    const localFileCache: { [x: string]: string } = {}

    return {
        saveFile: (fileName: string, player: player | null, data: string, base64 = BASE_64_DEFAULT) => {
            player && (localFileCache[`${GetPlayerId(player)}_${fileName}`] = data)

            if (!player || GetLocalPlayer() === player) {
                syncSaveLoad.writeFile(fileName, data, base64)
            }
        },

        saveFileWithoutPossibleLoading: (fileName: string, player: player | null, data: string, base64 = BASE_64_DEFAULT) => {
            player && (localFileCache[`${GetPlayerId(player)}_${fileName}`] = data)

            if (!player || GetLocalPlayer() === player) {
                syncSaveLoad.writeFileWithoutPossibleLoading(fileName, data, base64)
            }
        },

        readFile: (fileName: string, player: player, onRead: (promise: string) => void, base64 = BASE_64_DEFAULT) => {
            if (localFileCache[`${GetPlayerId(player)}_${fileName}`]) {
                onRead(localFileCache[`${GetPlayerId(player)}_${fileName}`])
            } else {
                syncSaveLoad.read(fileName, player, data => {
                    localFileCache[`${GetPlayerId(player)}_${fileName}`] = data
                    onRead(data)
                }, base64)
            }
        },
    }
}
