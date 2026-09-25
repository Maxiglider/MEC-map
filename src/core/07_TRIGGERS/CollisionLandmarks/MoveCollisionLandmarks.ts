import { Timer } from 'w3ts'
import { getUdgEscapers, udg_monsters } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'
import { isAnyoneDisplayingCollisionLandmarks, isLocallyDisplayingCollisionLandmarks } from './CollisionLandmarkEffect'
import {
    destroySpawnedCollisionLandmarks,
    moveSpawnedCollisionLandmarks,
    refreshSpawnedCollisionLandmarks,
} from './SpawnedCollisionLandmarks'

/**
 * Two walks, since making or dropping a landmark must happen on every machine alike, while moving one changes
 * nothing of the game: a player who does not show them should not pay for moving them.
 */
const MOVE_INTERVAL = 0.02
const REFRESH_INTERVAL = 0.1

let moveTimer: Timer | null = null
let refreshTimer: Timer | null = null

/** Run on every machine: what makes or drops a landmark, noticed here since nothing tells us about it */
function RefreshCollisionLandmarks() {
    for (const [_, monster] of pairs(udg_monsters)) {
        monster.refreshCollisionLandmarkIfHiddenChanged()
    }

    // what a monster spawn put on the map and what a caster shot: they have no Monster to carry a landmark
    refreshSpawnedCollisionLandmarks()
}

/** Run on every machine too, but it does nothing where the landmarks are not shown */
function MoveCollisionLandmarks() {
    if (!isLocallyDisplayingCollisionLandmarks()) {
        return
    }

    getUdgEscapers().forMainEscapers(escaper => {
        escaper.moveCollisionLandmark()
    })

    for (const [_, monster] of pairs(udg_monsters)) {
        monster.moveCollisionLandmark()
    }

    moveSpawnedCollisionLandmarks()
}

export const refreshTrigMoveCollisionLandmarks = () => {
    // a landmark's model is chosen when it is made, by who shows them: the walk makes them again with the new choice,
    // and if nothing walks them any more they would hang where their unit last stood
    destroySpawnedCollisionLandmarks()

    const enable = isAnyoneDisplayingCollisionLandmarks()

    const isEnabled = !!moveTimer

    if (enable && !isEnabled) {
        refreshTimer = createTimer(REFRESH_INTERVAL, true, RefreshCollisionLandmarks)
        moveTimer = createTimer(MOVE_INTERVAL, true, MoveCollisionLandmarks)
    } else if (!enable && isEnabled) {
        refreshTimer && refreshTimer.destroy()
        refreshTimer = null
        moveTimer && moveTimer.destroy()
        moveTimer = null
    }

    // without waiting for the first refresh; a command runs on every machine alike
    if (enable) {
        RefreshCollisionLandmarks()
    }
}
