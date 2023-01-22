import { getUdgLevels } from '../../../../globals'
import { Escaper } from '../Escaper/Escaper'

const areMutuallyAllied = (a: Escaper, b: Escaper) => {
    return a.alliedState[b.getId()] && b.alliedState[a.getId()]
}

export const sameLevelProgression = (a: Escaper, b: Escaper) => {
    return (
        getUdgLevels().getLevelProgression() === 'all' ||
        (getUdgLevels().getLevelProgression() === 'allied' && areMutuallyAllied(b, a)) ||
        (getUdgLevels().getLevelProgression() === 'solo' && b.getId() === a.getId())
    )
}
