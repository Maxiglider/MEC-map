import { errorHandler } from 'Utils/mapUtils'
import { Natives } from '../../../core/wc3_natives_unsecured/Natives'
import { EncodingBase64 } from './EncodingBase64'
import { EncodingHex } from './EncodingHex'
import { Logger } from './Logger'

const BASE_64_DEFAULT = true
const ESCAPE_DOUBLE_QUOTES_FOR_JSON_CHAR = '#DQ#'
const CHUNK_SIZE = 200

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

// Preload escapes backslashes in the written file and truncates too long lines,
// so each backslash counts twice for a chunk to stay within CHUNK_SIZE once escaped
const splitInChunks = (toCompile: string) => {
    const chunks: string[] = []
    let position = 0

    while (position < toCompile.length) {
        const candidate = toCompile.substring(position, position + CHUNK_SIZE)
        const nbBackslashes = candidate.split('\\').length - 1
        const chunk = candidate.substring(0, Math.max(CHUNK_SIZE - nbBackslashes, CHUNK_SIZE / 2))

        chunks.push(chunk)
        position += chunk.length
    }

    return chunks
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

        const chunks = splitInChunks(toCompile)
        const noOfChunks = chunks.length

        Logger.verbose('rawData.length: ', rawData.length)
        Logger.verbose('toCompile.length: ', toCompile.length)

        xpcall(() => {
            for (let i = 0; i < noOfChunks; i++) {
                const chunk = chunks[i]

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

        const chunks = splitInChunks(toCompile)

        Logger.verbose('rawData.length: ', rawData.length)
        Logger.verbose('toCompile.length: ', toCompile.length)

        xpcall(() => {
            for (const chunk of chunks) {
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
