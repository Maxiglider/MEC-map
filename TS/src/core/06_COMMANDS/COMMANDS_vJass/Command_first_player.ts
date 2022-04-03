import {NB_ESCAPERS} from 'core/01_libraries/Constants'
import {ColorString2Id} from 'core/01_libraries/Init_colorCodes'
import {Escaper} from 'core/04_STRUCTURES/Escaper/Escaper'
 import { udg_escapers } from '../../../../globals'
import { udg_levels } from "../../../../globals";
import {CmdName, CmdParam, IsPlayerColorString, NbParam, NoParam} from './Command_functions'


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
            if (IsPlayerColorString(param1)) {
                if (udg_escapers.get(ColorString2Id(param1)) != null) {
                    udg_escapers.get(ColorString2Id(param1))?.kill()
                }
                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break
                    if (udg_escapers.get(i) != escaper && udg_escapers.get(i) != null) {
                        udg_escapers.get(i)?.kill()
                    }
                    i = i + 1
                }
            }
            return true
        }
        if (
            IsPlayerColorString(param1) &&
            !udg_escapers.get(ColorString2Id(param1))?.canCheat()
        ) {
            if (udg_escapers.get(ColorString2Id(param1)) != null) {
                udg_escapers.get(ColorString2Id(param1))?.kill()
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
            if (IsPlayerColorString(param1)) {
                const target = udg_escapers.get(ColorString2Id(param1))

                if (target != null) {
                    target.kick(target)
                }

                return true
            }
            if (param1 === 'all' || param1 === 'a') {
                i = 0
                while (true) {
                    if (i >= NB_ESCAPERS) break

                    const target = udg_escapers.get(i)

                    if (target != escaper && target != null) {
                        escaper.kick(target)
                    }

                    i = i + 1
                }
            }
            return true
        }

        const target = udg_escapers.get(ColorString2Id(param1))

        if (IsPlayerColorString(param1) && !target?.canCheat()) {
            if (target != null) {
                escaper.kick(target)
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