import { initLives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { initMultiboard } from 'core/04_STRUCTURES/Lives_and_game_time/Multiboard'
import { ServiceManager } from 'Services'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'
import { initializers } from './core/Init/initializers'
import { PROD } from './env'
import {MEC_core_API} from "./core/API/MEC_core_API";

const tsMain = () => {
    ServiceManager.registerServices({
        Lives: initLives,
        Multiboard: initMultiboard,
    })

    //initializers
    initializers()

    //triggers
    // initOldTriggers()

    //escapers
    // initEscapers()

    if (!PROD) {
        const gcState = { lastRun: os.clock(), waitingForGc: false }

        createTimer(1, true, () => {
            if (!gcState.waitingForGc) {
                gcState.waitingForGc = true

                const trash = { a: 3 }

                setmetatable(trash, {
                    __gc: () => {
                        const now = os.clock()
                        print(`GC: ${now - gcState.lastRun}`)
                        gcState.lastRun = now
                        gcState.waitingForGc = false
                    },
                })
            }
        })
    }
}

addScriptHook(W3TS_HOOK.MAIN_AFTER, errorHandler(tsMain))


export const MEC_core = MEC_core_API