import { renderInterface } from 'App/renderInterface'
import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { initLives } from 'core/04_STRUCTURES/Lives_and_game_time/Lives_and_game_time'
import { initMultiboard } from 'core/04_STRUCTURES/Lives_and_game_time/Multiboard'
import { initCommandExecution } from 'core/06_COMMANDS/COMMANDS_vJass/Command_execution'
import { ServiceManager } from 'Services'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { addScriptHook, W3TS_HOOK } from 'w3ts/hooks'
import { MEC_core_API } from './core/API/MEC_core_API'
import { initializers } from './core/Init/initializers'
import { PROD } from './env'

// Changelog:
// Added new cmd: hideChat
// The all dead trigger now ignores players with autorevive turned on
// unit recycler now resets after -setmsm has been used
// -lc now remains active when triggering a new level or restart
// -rto now allows you to tp to dead people and revives you like rpos
// fpc faster rotation and a little more smooth
// fpc now supports walking on terrain. Special thanks to Wrda <3
// Ally system, -(un)ally; Allows you to only coop revive specific players
// Changed -pcor none to also include portals. Its not really 'onRevive' but w/e, nobody plays like this anyway.. except Andy..
// Solo mode option at start no longer crashes, old leaderboard does not work because of -ui command
// Added -setMonsterJumpPadEffect
// Scoreboard now maintains visibility state when someone leaves
// Disabled the classic leaderboard for now since it conflicts with -ui and everyone prefers -ui
// You can no longer finish the game multiple times by patrolling over the end region
// [EXPERIMENTAL] -setLevelProgression all|allied|solo. Makes only you/allied team/all go to the next lvl, can cause lag when levels are too big so use with caution

// TODO;
// The player revive timer should be cancelled when someone gets revived (when everyone is dead after x seconds it revives you but if you -r urself and then die u dont still wanna be instantly teleported back to start cuz of the initial revive timer)
// new cmd: summon, makes someone teleport to you
// make speededit/noobedit support targetplayer -speededit 1 red/all/etc

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

    // use with `yarn test-memory-handler`
    // createTimer(10, false, () => {
    //     print('ok')
    //     ;(_G as any)['printCreation'] = true
    // })

    //triggers
    // initOldTriggers()

    //escapers
    // initEscapers()

    // Some stuff to only show units that are visible on cam
    // const renderInfo = ObjectHandler.getNewObject<IRenderInfo>()

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
