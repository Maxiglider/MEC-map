import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { getUdgEscapers, getUdgLevels } from '../../../../globals'
import { CmdName, CmdParam, isPlayerId, NbParam, NoParam, resolvePlayerId } from './Command_functions'

export const ExecuteCommandRed = (escaper: Escaper, cmd: string): boolean => {
    let name = CmdName(cmd)
    let noParam = NoParam(cmd)
    let nbParam = NbParam(cmd)

    let n: number
    let i: number
    let j: number
    let k: number

    let b: boolean

    let str = ''
    let str2 = ''

    let x: number
    let y: number
    let point: location

    let param: string

    let param1 = CmdParam(cmd, 1)
    let param2 = CmdParam(cmd, 2)
    let param3 = CmdParam(cmd, 3)
    let param4 = CmdParam(cmd, 4)

    //-kill(kl) <Pcolor>   --> kills a hero
    if (name === 'kill' || name === 'kl') {
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
    }

    //-kick(kc) <Pcolor>   --> kicks a player
    if (name === 'kick' || name === 'kc') {
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
                i = 0
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
    }

    //-restart(-)
    if (name === 'restart') {
        if (noParam) {
            getUdgLevels().restartTheGame()
        }
        return true
    }

    return false
}
