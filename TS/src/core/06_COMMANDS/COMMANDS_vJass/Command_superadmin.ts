import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { getUdgEscapers } from '../../../../globals'
import { CmdName, CmdParam, isPlayerId, NbParam, NoParam, resolvePlayerId } from './Command_functions'

export const ExecuteCommandTrueMax = (escaper: Escaper, cmd: string): boolean => {
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

    let speed: number

    //-beAdmin <Pcolor>|all(a) [<boolean status>]
    if (name === 'beAdmin') {
        if (!(nbParam === 1 || nbParam === 2)) {
            Text.erP(escaper.getPlayer(), 'one or two params for this command')
            return true
        }
        if (nbParam === 2) {
            if (IsBoolString(param2)) {
                b = S2B(param2)
            } else {
                Text.erP(escaper.getPlayer(), 'param2 must be a boolean')
                return true
            }
        } else {
            b = true
        }
        if (param1 === 'all' || param1 === 'a') {
            i = 0
            while (true) {
                if (i >= NB_ESCAPERS) break
                if (getUdgEscapers().get(i) != null && getUdgEscapers().get(i) != escaper) {
                    getUdgEscapers().get(i)?.setIsMaximaxou(b)
                }
                i = i + 1
            }
            if (b) {
                Text.P(escaper.getPlayer(), 'all players have now admin rights')
            } else {
                Text.P(escaper.getPlayer(), 'you are now the only one to have admin rights')
            }
            return true
        }
        if (isPlayerId(param1)) {
            n = resolvePlayerId(param1)
            if (getUdgEscapers().get(n) != null) {
                if (getUdgEscapers().get(n) != escaper) {
                    getUdgEscapers().get(n)?.setIsMaximaxou(b)
                    if (b) {
                        Text.P(escaper.getPlayer(), 'player ' + param1 + ' has now admin rights')
                    } else {
                        Text.P(escaper.getPlayer(), 'player ' + param1 + ' no longer has admin rights')
                    }
                } else {
                    Text.erP(escaper.getPlayer(), "you can't change your own rights")
                }
            } else {
                Text.erP(escaper.getPlayer(), 'escaper ' + param1 + " doesn't exist")
            }
        } else {
            Text.erP(escaper.getPlayer(), 'param1 must be a player color or "all"')
        }
        return true
    }

    //-exec
    if (name === 'e' || name === 'exec') {
        const args = GetEventPlayerChatString().substring(name.length + 2)

        const [func, err] = load(`return function() return ${args} end`)

        if (func) {
            const [ok, f] = pcall(func)

            if (ok) {
                Text.P(escaper.getPlayer(), `Ran: '${args}'`)
                const out = f()

                if (out) {
                    Text.P(escaper.getPlayer(), `Out: '${out}'`)
                }
            } else {
                Text.erP(escaper.getPlayer(), `Execution error: ${f}`)
            }
        } else {
            if (typeof err === 'string') {
                Text.erP(escaper.getPlayer(), err)
            } else {
                Text.erP(escaper.getPlayer(), 'Syntax error')
            }
        }

        return true
    }

    return false
}
