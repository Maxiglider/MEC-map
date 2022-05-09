import { errorHandler } from 'Utils/mapUtils'
import { EncodingBase64 } from './EncodingBase64'
import { EncodingHex } from './EncodingHex'
import { Logger } from './Logger'

const BASE_64_DEFAULT = true

export const SyncSaveLoad = () => {
    const syncPrefix = 'S_TIO'
    const syncPrefixFinish = 'S_TIOF'
    const syncEvent: trigger = CreateTrigger()

    const allPromises: (IFilePromise | undefined)[] = []

    for (let i = 0; i < GetBJMaxPlayers(); i++) {
        BlzTriggerRegisterPlayerSyncEvent(syncEvent, Player(i), syncPrefix, false)
        BlzTriggerRegisterPlayerSyncEvent(syncEvent, Player(i), syncPrefixFinish, false)
    }

    TriggerAddAction(
        syncEvent,
        errorHandler(
            () => {
                const readData = BlzGetTriggerSyncData()
                const totalChunkSize = EncodingHex.ToNumber(readData.substr(0, 8))
                const currentChunk = EncodingHex.ToNumber(readData.substr(8, 8))
                const theRest = readData.substr(16)

                Logger.verbose('Loading ', currentChunk, ' out of ', totalChunkSize)

                const promise = allPromises[GetPlayerId(GetTriggerPlayer())]

                if (promise) {
                    if (BlzGetTriggerSyncPrefix() === syncPrefix) {
                        promise.setBuffer(currentChunk - 1, theRest)
                    } else if (BlzGetTriggerSyncPrefix() === syncPrefixFinish) {
                        promise.finish()
                        allPromises[GetPlayerId(promise.syncOwner)] = undefined
                    }
                } else {
                    Logger.warning(
                        `Syncronised data in SyncSaveLoad when there is no promise present for player: ${GetPlayerName(
                            GetTriggerPlayer()
                        )}`
                    )
                }
            },
            () => {
                allPromises[GetPlayerId(GetTriggerPlayer())] = undefined
            }
        )
    )

    const writeFile = (fileName: string, data: string, base64Encode = BASE_64_DEFAULT) => {
        PreloadGenClear()
        PreloadGenStart()

        const rawData = data
        const toCompile = base64Encode ? EncodingBase64.Encode(rawData) : rawData
        const chunkSize = 180
        let assemble = ''
        const noOfChunks = math.ceil(toCompile.length / chunkSize)

        Logger.verbose('rawData.length: ', rawData.length)
        Logger.verbose('toCompile.length: ', toCompile.length)

        xpcall(() => {
            for (let i = 0; i < toCompile.length; i++) {
                assemble += toCompile.charAt(i)

                if (assemble.length >= chunkSize) {
                    const header =
                        EncodingHex.To32BitHexString(noOfChunks) +
                        EncodingHex.To32BitHexString(math.ceil(i / chunkSize))
                    Preload(`")\ncall BlzSendSyncData("${syncPrefix}","${header + assemble}`)
                    assemble = ''
                }
            }

            if (assemble.length > 0) {
                const header = EncodingHex.To32BitHexString(noOfChunks) + EncodingHex.To32BitHexString(noOfChunks)
                Preload(`")\ncall BlzSendSyncData("${syncPrefix}","${header + assemble}`)
                //Final curtain call
            }
        }, Logger.critical)
        PreloadGenEnd(fileName)
    }

    const writeFileWithoutPossibleLoading = (fileName: string, data: string, base64Encode = BASE_64_DEFAULT) => {
        PreloadGenClear()
        PreloadGenStart()

        const rawData = data
        const toCompile = base64Encode ? EncodingBase64.Encode(rawData) : rawData
        const chunkSize = 180
        let assemble = ''
        const noOfChunks = math.ceil(toCompile.length / chunkSize)

        Logger.verbose('rawData.length: ', rawData.length)
        Logger.verbose('toCompile.length: ', toCompile.length)

        xpcall(() => {
            for(let i = 0; i < noOfChunks; i++){
                const start = i * chunkSize
                const end = i < noOfChunks - 1 ? start + chunkSize : undefined
                assemble = toCompile.substring(start, end)
                Preload(assemble)
            }
        }, Logger.critical)
        PreloadGenEnd(fileName)
    }

    const read = (
        fileName: string,
        reader: player,
        onFinish: (promise: IFinishedFilePromise) => void,
        base64Encode = BASE_64_DEFAULT
    ): IFilePromise => {
        if (allPromises[GetPlayerId(reader)] === null) {
            allPromises[GetPlayerId(reader)] = FilePromise(reader, onFinish, base64Encode)

            if (GetLocalPlayer() === reader) {
                PreloadStart()
                Preloader(fileName)
                PreloadEnd(1)

                BlzSendSyncData(syncPrefixFinish, '')
            }
        } else {
            Logger.warning('Trying to read file when file read is already busy.')
        }

        return allPromises[GetPlayerId(reader)]!
    }

    return {
        read,
        writeFile,
        writeFileWithoutPossibleLoading
    }
}

type IFinishedFilePromise = string

type IFilePromise = ReturnType<typeof FilePromise>

const FilePromise = (syncOwner: player, onFinish: (promise: IFinishedFilePromise) => void, base64Encode = BASE_64_DEFAULT) => {
    const buffer: string[] = []

    const finish = () => {
        const loadString = buffer.join('')
        const finalString = base64Encode ? EncodingBase64.Decode(loadString) : loadString

        Logger.verbose('loadString.length', loadString.length)
        Logger.verbose('onFinish', onFinish)
        Logger.verbose('Finished: ')
        Logger.verbose('finalString.length: ', finalString.length)

        onFinish(finalString)
    }

    return {
        finish,
        setBuffer: (i: number, s: string) => (buffer[i] = s),
        syncOwner,
    }
}
