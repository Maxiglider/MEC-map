import { createTimer, errorHandler } from 'Utils/mapUtils'
import { EncodingBase64 } from './EncodingBase64'
import { EncodingHex } from './EncodingHex'
import { Logger } from './Logger'
import { Natives } from '../../../core/wc3_natives_unsecured/Natives'

const BASE_64_DEFAULT = true
const ESCAPE_DOUBLE_QUOTES_FOR_JSON_CHAR = '#DQ#'
const CHUNK_SIZE = 150

const syncPrefix = 'S_TIO'
const syncPrefixFinish = 'S_TIOF'
let syncEventsTrigger: trigger | null = null

const allPromises: (IFilePromise | undefined)[] = []

const init_syncEventsTrigger = () => {
    if (syncEventsTrigger) {
        DestroyTrigger(syncEventsTrigger)
    }
    syncEventsTrigger = CreateTrigger()

    for (let i = 0; i < GetBJMaxPlayers(); i++) {
        BlzTriggerRegisterPlayerSyncEvent(syncEventsTrigger, Natives.UPlayer(i), syncPrefix, false)
        BlzTriggerRegisterPlayerSyncEvent(syncEventsTrigger, Natives.UPlayer(i), syncPrefixFinish, false)
    }

    TriggerAddAction(
        syncEventsTrigger,
        errorHandler(
            () => {
                const readData = Natives.UBlzGetTriggerSyncData()
                const totalChunkSize = EncodingHex.ToNumber(readData.substr(0, 8))
                const currentChunk = EncodingHex.ToNumber(readData.substr(8, 8))
                const theRest = readData.substr(16)

                Logger.verbose('Loading ', currentChunk, ' out of ', totalChunkSize)

                const promise = allPromises[GetPlayerId(Natives.UGetTriggerPlayer())]

                if (promise) {
                    if (BlzGetTriggerSyncPrefix() === syncPrefix) {
                        promise.setBuffer(currentChunk - 1, theRest)
                    } else if (BlzGetTriggerSyncPrefix() === syncPrefixFinish) {
                        promise.finish()
                        allPromises[GetPlayerId(promise.syncOwner)] = undefined
                    }
                } else {
                    Logger.warning(
                        `Syncronised data in SyncSaveLoad when there is no promise present for player: ${Natives.UGetPlayerName(
                            Natives.UGetTriggerPlayer()
                        )}`
                    )
                }
            },
            () => {
                allPromises[GetPlayerId(Natives.UGetTriggerPlayer())] = undefined
            }
        )
    )
}

export const SyncSaveLoad = () => {
    const writeFile = (fileName: string, data: string, base64Encode = BASE_64_DEFAULT) => {
        PreloadGenClear()
        PreloadGenStart()

        const rawData = data

        let toCompile: string
        if (base64Encode) {
            toCompile = EncodingBase64.Encode(rawData)
        } else {
            // Escape doubles quotes for BlzSendSyncData calls not to crash on lmfc
            toCompile = strings().replaceAll('"', ESCAPE_DOUBLE_QUOTES_FOR_JSON_CHAR, rawData)
        }

        const noOfChunks = math.ceil(toCompile.length / CHUNK_SIZE)

        Logger.verbose('rawData.length: ', rawData.length)
        Logger.verbose('toCompile.length: ', toCompile.length)

        xpcall(() => {
            for (let i = 0; i < noOfChunks; i++) {
                const chunk = toCompile.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)

                const header = EncodingHex.To32BitHexString(noOfChunks) + EncodingHex.To32BitHexString(i + 1)
                Preload(`")\ncall BlzSendSyncData("${syncPrefix}","${header + chunk}`)
            }
        }, Logger.critical)
        PreloadGenEnd(fileName)
    }

    const writeFileWithoutPossibleLoading = (fileName: string, data: string, base64Encode = BASE_64_DEFAULT) => {
        PreloadGenClear()
        PreloadGenStart()

        const rawData = data

        let toCompile: string
        if (base64Encode) {
            toCompile = EncodingBase64.Encode(rawData)
        } else {
            // Escape doubles quotes for BlzSendSyncData calls not to crash on lmfc
            toCompile = strings().replaceAll('"', ESCAPE_DOUBLE_QUOTES_FOR_JSON_CHAR, rawData)
        }

        let assemble = ''
        const noOfChunks = math.ceil(toCompile.length / CHUNK_SIZE)

        Logger.verbose('rawData.length: ', rawData.length)
        Logger.verbose('toCompile.length: ', toCompile.length)

        xpcall(() => {
            for (let i = 0; i < noOfChunks; i++) {
                const chunk = toCompile.substring(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
                Preload(chunk)
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
            init_syncEventsTrigger()

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
        writeFileWithoutPossibleLoading,
    }
}

type IFinishedFilePromise = string

type IFilePromise = ReturnType<typeof FilePromise>

const FilePromise = (
    syncOwner: player,
    onFinish: (promise: IFinishedFilePromise) => void,
    base64Encode = BASE_64_DEFAULT
) => {
    const buffer: string[] = []

    const finish = () => {
        const loadString = buffer.join('')
        const stringNotEscaped = base64Encode ? EncodingBase64.Decode(loadString) : loadString
        const finalString = strings().replaceAll(ESCAPE_DOUBLE_QUOTES_FOR_JSON_CHAR, '"', stringNotEscaped)

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
