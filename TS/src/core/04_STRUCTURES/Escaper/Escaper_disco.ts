import { NB_ESCAPERS } from 'core/01_libraries/Constants'
import { getUdgEscapers } from '../../../../globals'
const udg_escapers = getUdgEscapers()

const initDisco = () => {
    const ApplyRandomColor = (n: number) => {
        const esc = udg_escapers.get(n)

        if (!esc) {
            return
        }

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

        while (!(udg_escapers.get(n)?.discoTrigger === GetTriggeringTrigger())) {
            if (n >= NB_ESCAPERS) {
                return
            }

            n = n + 1
        }

        ApplyRandomColor(n)
    }

    return { Disco_Actions }
}

export const Disco = initDisco()
