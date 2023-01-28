import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { ServiceManager } from 'Services'
import { getUdgEscapers, getUdgLevels, globals } from '../../../../globals'
import { isPlayerId, resolvePlayerId, resolvePlayerIds } from './Command_functions'

export const initExecuteCommandRed = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    //-kill(kl) <Pcolor>   --> kills a hero
    registerCommand({
        name: 'kill',
        alias: ['kl'],
        group: 'red',
        argDescription: '<Pcolor>',
        description: 'Kills a hero',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            if (escaper.isTrueMaximaxou()) {
                if (isPlayerId(param1)) {
                    if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                        getUdgEscapers().get(resolvePlayerId(param1))?.kill()
                    }
                    return true
                }

                if (param1 === 'all' || param1 === 'a') {
                    for (const [_, esc] of pairs(getUdgEscapers().getAll())) {
                        if (escaper !== esc && !esc.isEscaperSecondary()) {
                            esc.kill()
                        }
                    }
                }
                return true
            }

            if (isPlayerId(param1) && !getUdgEscapers().get(resolvePlayerId(param1))?.canCheat()) {
                if (getUdgEscapers().get(resolvePlayerId(param1)) != null) {
                    getUdgEscapers().get(resolvePlayerId(param1))?.kill()
                }
            }
            return true
        },
    })

    //-kick(kc) <Pcolor>   --> kicks a player
    registerCommand({
        name: 'kick',
        alias: ['kc'],
        group: 'red',
        argDescription: '<Pcolor>',
        description: 'Kicks a player',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return true
            }
            if (escaper.isTrueMaximaxou()) {
                if (isPlayerId(param1)) {
                    const target = getUdgEscapers().get(resolvePlayerId(param1))

                    if (target != null) {
                        escaper.kick(target)
                    }

                    return true
                }
                if (param1 === 'all' || param1 === 'a') {
                    let i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break

                        const target = getUdgEscapers().get(i)

                        if (target != escaper && target != null) {
                            escaper.kick(target)
                        }

                        i = i + 1
                    }
                }
                return true
            }

            const target = getUdgEscapers().get(resolvePlayerId(param1))

            if (isPlayerId(param1) && !target?.canCheat()) {
                if (target != null) {
                    escaper.kick(target)
                }
            }
            return true
        },
    })

    //-restart(-)
    registerCommand({
        name: 'restart',
        alias: [],
        group: 'red',
        argDescription: '',
        description: 'Restarts the game',
        cb: ({ noParam }) => {
            if (noParam) {
                getUdgLevels().restartTheGame()
            }
            return true
        },
    })

    //-noobedit
    registerCommand({
        name: 'noobedit',
        alias: ['ne'],
        group: 'red',
        argDescription: '<active>',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam === 2 && IsBoolString(param1)) {
                globals.autoreviveDelay = 0.3

                resolvePlayerIds(param2, e => {
                    if (e.isNoobedit) {
                        Text.P(escaper.getPlayer(), "That's better, but you're still Noobs!")
                        Text.P(e.getPlayer(), "That's better, but you're still Noobs!")
                        e.isNoobedit = false
                        e.setHasAutorevive(false)
                    } else {
                        Text.P(escaper.getPlayer(), 'Really? Noobs!')
                        Text.P(e.getPlayer(), 'Really? Noobs!')
                        e.isNoobedit = true
                        e.setHasAutorevive(true)
                    }
                })
            }

            if (nbParam === 1 && IsBoolString(param1)) {
                if (S2B(param1)) {
                    Text.A('Really? Noobs!')
                } else {
                    if (getUdgLevels().isNoobEdit()) {
                        Text.A("That's better, but you're still Noobs!")
                    }
                }

                getUdgLevels().setIsNoobEdit(S2B(param1))
            }

            return true
        },
    })

    //-speededit
    registerCommand({
        name: 'speededit',
        alias: ['se'],
        group: 'red',
        argDescription: '<active> [player]',
        description: '',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam === 2 && IsBoolString(param1)) {
                resolvePlayerIds(param2, e => {
                    if (e.isSpeedEdit) {
                        Text.P(escaper.getPlayer(), 'Speed disabled')
                        Text.P(e.getPlayer(), 'Speed disabled')
                        e.isSpeedEdit = false
                        e.stopAbsoluteSlideSpeed()
                        e.stopAbsoluteRotationSpeed()
                    } else {
                        Text.P(escaper.getPlayer(), 'Letsgoooooo!')
                        Text.P(e.getPlayer(), 'Letsgoooooo!')
                        e.isSpeedEdit = true
                        e.absoluteSlideSpeed(800)
                        e.absoluteRotationSpeed(1.2)
                    }
                })
            }

            if (nbParam === 1 && IsBoolString(param1)) {
                if (S2B(param1)) {
                    Text.A('Letsgoooooo!')
                } else {
                    Text.A('Speed disabled')
                }

                getUdgLevels().setIsSpeedEdit(S2B(param1))
            }

            return true
        },
    })

    //-setLevelProgression(setlp) all|allied|solo
    registerCommand({
        name: 'setLevelProgression',
        alias: ['setlp'],
        group: 'red',
        argDescription: '<all|allied|solo> [player]',
        description: '',
        cb: ({ param1 }, escaper) => {
            if (param1 !== 'all' && param1 !== 'allied' && param1 !== 'solo') {
                Text.erP(escaper.getPlayer(), 'Invalid mode')
                return true
            }

            Text.A(`Level progression changed to: ${param1}`)
            getUdgLevels().setLevelProgression(param1)
            return true
        },
    })
}
