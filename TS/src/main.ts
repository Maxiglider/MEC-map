import { renderInterface } from 'App/renderInterface'
import { ServiceManager } from 'Services'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { initLives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { initMultiboard } from 'core/04_STRUCTURES/Lives_and_game_time/Multiboard'
import { initCommandExecution } from 'core/06_COMMANDS/COMMANDS_vJass/Command_execution'
import { W3TS_HOOK, addScriptHook } from 'w3ts/hooks'
import { MEC_core_API } from './core/API/MEC_core_API'
import { initializers } from './core/Init/initializers'
import { PROD } from './env'

// [X] per player rkr thing, ignore players who haven't clicked yet (support arrowkeys too somehow)
// [X] ignore noobedit players
// [O] make it activate for closest alive player in front of you
// [O] add max distance cmd
// [O] add disable cmd
// [O] detect walk terrain with end region, if you touch it set progression to 100%
// [O] get current lvl highest prog cmd / stats
// [X] added -setgametheme murloc|fullskill
// [X] -setgametheme with -se 1 doesn't change ss of newly created terrains
// [X] make speededit work per player instead of changing terrains
// [X] fix bug where cam doesn't follow player on -rpos, -smn and -back

const tsMain = () => {
    ServiceManager.registerServices({
        Lives: initLives,
        Multiboard: initMultiboard,
        Cmd: initCommandExecution,
        React: () => {
            return renderInterface({
                cb: ({ setVisible, resetUI }) => {
                    ServiceManager.getService('Cmd').registerCommand({
                        name: 'palette',
                        alias: ['p'],
                        group: 'make',
                        argDescription: '',
                        description: '',
                        cb: ({ nbParam, param1 }) => {
                            if (nbParam !== 1) {
                                throw 'Wrong command parameters'
                            }

                            if (param1 === 'reset') {
                                resetUI(GetPlayerId(GetTriggerPlayer()))
                                return true
                            }

                            if (!IsBoolString(param1)) {
                                return true
                            }

                            setVisible({ visible: S2B(param1), playerId: GetPlayerId(GetTriggerPlayer()) })
                            return true
                        },
                    })
                },
            })
        },
    })

    ServiceManager.getService('Cmd').initCommands()

    //initializers
    initializers()

    //triggers
    // initOldTriggers()

    //escapers
    // initEscapers()

    // Some stuff to only show units that are visible on cam
    // const renderInfo = MemoryHandler.getEmptyObject<IRenderInfo>()

    // createTimer(0.2, true, () => {
    //     renderWorld(renderInfo)
    // })

    ServiceManager.getService('React').init()

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
