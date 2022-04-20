import { IsBoolString, S2B } from 'core/01_libraries/Basic_functions'
import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { ServiceManager } from 'Services'
import { getUdgEscapers } from '../../../../globals'
import { isPlayerId, resolvePlayerId } from './Command_functions'

export const initExecuteCommandTrueMax = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')

    //-beAdmin <Pcolor>|all(a) [<boolean status>]
    registerCommand({
        name: 'beAdmin',
        alias: [],
        group: 'truemax',
        cb: ({ cmd, noParam, nbParam, param1, param2, param3, param4 }, escaper) => {
            if (!(nbParam === 1 || nbParam === 2)) {
                Text.erP(escaper.getPlayer(), 'one or two params for this command')
                return true
            }

            let b = false

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
                let i = 0
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
                let n = resolvePlayerId(param1)
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
        },
    })

    //-exec
    registerCommand({
        name: 'exec',
        alias: ['e'],
        group: 'truemax',
        cb: ({ name }, escaper) => {
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
        },
    })
}
