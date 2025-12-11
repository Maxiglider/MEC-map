import { renderInterface } from 'App/renderInterface'
import { ServiceManager } from 'Services'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { initLives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { initMultiboard } from 'core/04_STRUCTURES/Lives_and_game_time/Multiboard'
import { initCommandExecution } from './core/06_COMMANDS/Helpers/Command_execution'
import { W3TS_HOOK, addScriptHook } from 'w3ts/hooks'
import { MEC_core_API } from './core/API/MEC_core_API'
import { initializers } from './core/Init/initializers'
import { PROD } from './env'

// [X] per player rkr thing, ignore players who haven't clicked yet (support arrowkeys too somehow)
//   ^ [X] ignore noobedit players
//   ^ [O] make it activate for closest alive player in front of you
//   ^ [O] add max distance cmd
//   ^ [O] add disable cmd
//   ^ [>TEST] make it work for only allied players
//   ^ [>TEST] make it work for all allied teams
// [X] New cmd: -spinCam [speed]; Recommended 0.5 or less speed
// [O] make the switch perm kill units instead of timed
// [O] Show current level on multiboard

const tsMain = () => {
    ServiceManager.registerServices({
        Lives: initLives,
        Multiboard: initMultiboard,
        Cmd: initCommandExecution,
        React: () => {
            return renderInterface({
                cb: ({ setVisible, resetUI, addCommandToHistory }) => {
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

                    ServiceManager.getService('Cmd').registerCommand({
                        name: 'commandHistory',
                        alias: ['cmdh', 'cmdhis', 'cmdhist', 'cmdhistory'],
                        group: 'all',
                        argDescription: '[on|off|toggle|clear]',
                        description: 'Toggle command history display, or clear unpinned commands',
                        cb: ({ noParam, param1 }, escaper) => {
                            const playerId = GetPlayerId(GetTriggerPlayer())

                            if (noParam || param1 === 'toggle') {
                                // Toggle visibility
                                const currentVisible =
                                    ServiceManager.getService('React').getHistoryVisible(playerId) || false
                                ServiceManager.getService('React').setHistoryVisible(playerId, !currentVisible)
                                return true
                            }

                            if (param1 === 'on') {
                                ServiceManager.getService('React').setHistoryVisible(playerId, true)
                                return true
                            }

                            if (param1 === 'off') {
                                ServiceManager.getService('React').setHistoryVisible(playerId, false)
                                return true
                            }

                            if (param1 === 'clear') {
                                ServiceManager.getService('React').clearUnpinnedHistory(playerId)
                                Text.P(escaper.getPlayer(), 'Cleared unpinned command history')
                                return true
                            }

                            return true
                        },
                    })

                    // Store the addCommandToHistory function in the service
                    ServiceManager.getService('Cmd').setAddCommandToHistory(addCommandToHistory)
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
