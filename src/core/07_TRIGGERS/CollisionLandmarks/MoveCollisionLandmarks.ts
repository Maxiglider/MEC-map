import { Timer } from 'w3ts'
import { getUdgEscapers, udg_monsters } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'
import { destroySpawnedCollisionLandmarks, moveSpawnedCollisionLandmarks } from './SpawnedCollisionLandmarks'

const TIMER_INTERVAL = 0.01

let timer: Timer | null = null

function MoveCollisionLandmarks() {
    getUdgEscapers().forMainEscapers(escaper => {
        escaper.moveCollisionLandmark()
    })

    for (const [_, monster] of pairs(udg_monsters)) {
        monster.moveCollisionLandmark()
    }

    // what a monster spawn put on the map and what a caster shot: they have no Monster to carry a landmark
    moveSpawnedCollisionLandmarks()
}

export const refreshTrigMoveCollisionLandmarks = () => {
    let enable = false
    getUdgEscapers().forMainEscapers(escaper => {
        if (escaper.getDisplayCollisionLandmarks()) {
            enable = true
        }
    })

    const isEnabled = !!timer
    if (enable === isEnabled) {
        return
    }

    if (enable) {
        timer = createTimer(TIMER_INTERVAL, true, MoveCollisionLandmarks)
    } else {
        timer && timer.destroy()
        timer = null
        // nothing walks them any more, so they would hang where their unit last stood
        destroySpawnedCollisionLandmarks()
    }
}
