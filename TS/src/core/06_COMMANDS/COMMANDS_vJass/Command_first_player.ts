import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { ServiceManager } from 'Services'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { isPlayerId, resolvePlayerId } from './Command_functions'

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
}
