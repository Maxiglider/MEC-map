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
// [O] make the switch perm kill units instead of timed
// [X] Support for pathing blockers with a new command: -setCanSlideOverPathingBlockers; prevents sliders from going through pathing blockers
// [X] New cmds, -createRegion, displayRegions, deleteRegion, getRegionAtPoint, moveRegionPoint. Not used for many things yet. Also new cmds: setRegionFlag, setMonsterWanderable; Used to recreate Slide Kitty Slide :)
// [X] New make cmd: -copyLevel; copies the current making level to a new one
// [X] SKS; setAnimOnRevive cmd (for the revive anim), kitty has a different one than DH
// [X] SKS; progression; support pathing blocker?
// [X] SKS; setMonsterWanderableTimeout <monsterType> <min> <max>; set the timeout in sec
// [X] New make cmd: -snapPatrolsToSlide; Kinda like snapPatrolsToGrid but snaps to nearest slide terrain instead of grid, better.
// [X] New make cmd: -snapPatrolsToSlideOffset; Allows setting an offset for specific monster types when using -snapPatrolsToSlide so that they look better. -sptso <monsterType> <angle> <offset>
// [X] Improved CircleMob logic
// [X] New make cmd: -setCircleMobInitialAngle; Force the initial angle on a CircleMob to time it with other CircleMobs
// [X] SKS; Added skills
// [X] SKS; Add exp on revive; add exp for reaching corners
// [X] Activating speededit when mirror is on will now mirror the speededit
// [X] When going to -el and if ur camera is already on the new spawn point it seems to move it back to the previous level
// [X] -crma now supports an [angle] param to force a specific angle
// [X] When a level gets deactivated it also removes the debug regions
// [X] Debug regions now support monster patrols by writing `-dr 1 1`
// [X] Fixed a bug in -smn chain where it delays the each smn
// [X] -crma patrols now have a slight offset to prevent the patrols from walking in sync
// [X] New make cmd: -setMonsterCreateTerrain(setmct) <monsterLabel> <terrainLabel> -- When a monstertype has a createTerrainLabel, it will create the terrain at the monsters position and then remove the monster
// [X] New make cmd: -copyLevelPatrol [targetLevel] -- Copy a patrol from your current working level to another
// [X] Static slides now support diagonal slides
// [X] Static slides will now kill the slider when they go out of bounds
// [X] New make cmd: -setStaticSlideCanTurnAngle; Allows setting a specific angle for the slider to turn on the static slide
// [O] Show current level on multiboard

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
