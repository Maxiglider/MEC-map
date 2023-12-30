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
//   ^ [X] ignore noobedit players
//   ^ [O] make it activate for closest alive player in front of you
//   ^ [O] add max distance cmd
//   ^ [O] add disable cmd
//   ^ [>TEST] make it work for only allied players
//   ^ [>TEST] make it work for all allied teams
// [X] bug; whenever u -back or -rpos after dying on death terrain u revive on death terrain and it kills you again
// [X] oldest bug in the book; when u die to terrain and then touch a unit, the unit will kill u, then u revive, then death terrain will kill you again. Should cancel the death terrain kill in progress after revive
// [X] -ot should also apply to their death circles. -vc too
// [X] whenever u -el it doesn't pan camera to new lvl
// [X] make multiboard only show highest progression
// [X] make setPointsEarnedOnLevelCompletion give out points to other teams on game completion
// [X] make cmd setPointsEarnedOnMeteorCompletion to give points to people who use meteor
//   ^ [X] make cmd setPointsEarnedOnMeteorCompletionMaxPerLevel to limit max meteor kill points earned per level
// [X] on ldb add lvl number column when lp is allied or solo
// [Added but doesnt work] disable death sound when idm is on
// [X] when players leave the game or get kicked the level should be unloaded on -setlp solo/allied
// [X] make -gotl work with lp solo/allied like -el
// [X] -getCurrentLevel supports player parameter now for when ur playing lp solo/allied
// [X] -an walk works again, you can now play animations by index so -an 8 instead of knowing their names
// [X] new cmd: -skin; change your slider unit skin
// [X] new cmd: -scale; change your slider unit scale
// [O] detect walk terrain with end region, if you touch it set progression to 100%
// [O] add option 'progression' to -lc to lock cam to #1 slider

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
