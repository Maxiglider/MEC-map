import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { udg_escapers } from 'core/08_GAME/Init_structures/Init_escapers'
import { Escaper } from './Escaper'

const initDisco = () => {
    const ApplyRandomColor = (n: number) => {
        const esc: Escaper = udg_escapers.get(n)
        esc.setBaseColorDisco(GetRandomInt(0, 12))
        esc.setVcRed(GetRandomPercentageBJ())
        esc.setVcGreen(GetRandomPercentageBJ())
        esc.setVcBlue(GetRandomPercentageBJ())
        esc.setVcTransparency(GetRandomReal(0, 25))

        const hero = esc.getHero()

        if (hero) {
            SetUnitVertexColorBJ(hero, esc.getVcRed(), esc.getVcGreen(), esc.getVcBlue(), esc.getVcTransparency())
        }
    }

    const Disco_Actions = () => {
        let n = 0

        while (!(udg_escapers.get(n).discoTrigger == GetTriggeringTrigger())) {
            if (n >= NB_ESCAPERS) {
                return
            }
            n = n + 1
        }

        ApplyRandomColor(n)
    }

    return { ApplyRandomColor, Disco_Actions }
}

export const Disco = initDisco()
