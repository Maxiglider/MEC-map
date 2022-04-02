import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { Escaper } from 'core/04_STRUCTURES/Escaper/Escaper'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { CommandsFunctions } from './Command_functions'

const initCommandRed = () => {
    const ExecuteCommandRed = (escaper: Escaper, cmd: string): boolean => {
        let name = CommandsFunctions.CmdName(cmd)
        let noParam = CommandsFunctions.NoParam(cmd)
        let nbParam = CommandsFunctions.NbParam(cmd)

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

        let param1 = CommandsFunctions.CmdParam(cmd, 1)
        let param2 = CommandsFunctions.CmdParam(cmd, 2)
        let param3 = CommandsFunctions.CmdParam(cmd, 3)
        let param4 = CommandsFunctions.CmdParam(cmd, 4)

        //-kill(kl) <Pcolor>   --> kills a hero
        if (name === 'kill' || name === 'kl') {
            if (nbParam !== 1) {
                return true
            }
            if (escaper.isTrueMaximaxou()) {
                if (CommandsFunctions.IsPlayerColorString(param1)) {
                    if (udg_escapers.get(ColorString2Id(param1)) != null) {
                        udg_escapers.get(ColorString2Id(param1)).kill()
                    }
                    return true
                }
                if (param1 === 'all' || param1 === 'a') {
                    i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break
                        if (udg_escapers.get(i) != escaper && udg_escapers.get(i) != null) {
                            udg_escapers.get(i).kill()
                        }
                        i = i + 1
                    }
                }
                return true
            }
            if (CommandsFunctions.IsPlayerColorString(param1) && !udg_escapers.get(ColorString2Id(param1)).canCheat()) {
                if (udg_escapers.get(ColorString2Id(param1)) != null) {
                    udg_escapers.get(ColorString2Id(param1)).kill()
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
                if (CommandsFunctions.IsPlayerColorString(param1)) {
                    if (udg_escapers.get(ColorString2Id(param1)) != null) {
                        escaper.kick(udg_escapers.get(ColorString2Id(param1)))
                    }
                    return true
                }
                if (param1 === 'all' || param1 === 'a') {
                    i = 0
                    while (true) {
                        if (i >= NB_ESCAPERS) break
                        if (udg_escapers.get(i) != escaper && udg_escapers.get(i) != null) {
                            escaper.kick(udg_escapers.get(i))
                        }
                        i = i + 1
                    }
                }
                return true
            }
            if (CommandsFunctions.IsPlayerColorString(param1) && !udg_escapers.get(ColorString2Id(param1)).canCheat()) {
                if (udg_escapers.get(ColorString2Id(param1)) != null) {
                    escaper.kick(udg_escapers.get(ColorString2Id(param1)))
                }
            }
            return true
        }

        //-restart(-)
        if (name === 'restart') {
            if (noParam) {
                udg_levels.restartTheGame()
            }
            return true
        }

        return false
    }

    return { ExecuteCommandRed }
}

export const CommandRed = initCommandRed()
