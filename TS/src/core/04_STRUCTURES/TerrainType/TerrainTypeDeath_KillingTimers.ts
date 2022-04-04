import { NB_ESCAPERS } from 'core/01_libraries/Constants'
 import { getUdgEscapers } from '../../../../globals'

import { getUdgLevels } from "../../../../globals"

import { forRange } from 'Utils/mapUtils'
import { getUdgTerrainTypes } from '../../../../globals'


export class KillingTimers {
    private timers: timer[] = []

    constructor() {
        forRange(NB_ESCAPERS, i => (this.timers[i] = CreateTimer()))
    }

    destroy = () => {
        forRange(NB_ESCAPERS, i => DestroyTimer(this.timers[i]))
    }

    TerrainKillTimer2Escaper = (theTimer: timer) => {
        const terrainTypeDeathMaxId = getUdgTerrainTypes().numberOfDeath - 1
        let terrainTypeDeathId = 0
        let escaperId = 0

        while (!(terrainTypeDeathId > terrainTypeDeathMaxId)) {
            escaperId = 0

            while (!(escaperId >= NB_ESCAPERS)) {
                if (theTimer == getUdgTerrainTypes().getDeath(terrainTypeDeathId).getTimer(escaperId)) {
                    return getUdgEscapers().get(escaperId)
                }

                escaperId = escaperId + 1
            }

            terrainTypeDeathId = terrainTypeDeathId + 1
        }
    }

    start = (timerId: number, time: number) => {
        TimerStart(this.timers[timerId], time, false, () => {
            const escaper = this.TerrainKillTimer2Escaper(GetExpiredTimer())

            if (!escaper) {
                return
            }

            escaper.pause(false)
            escaper.destroyTerrainKillEffect()

            if (escaper.currentLevelTouchTerrainDeath == getUdgLevels().getCurrentLevel()) {
                escaper.kill()
            } else {
                if (escaper.isAlive()) {
                    escaper.enableCheckTerrain(true)
                }
            }
        })

        const escaper = getUdgEscapers().get(timerId)

        if (escaper) {
            escaper.currentLevelTouchTerrainDeath = getUdgLevels().getCurrentLevel()
        }
    }

    get = (id: number): timer => this.timers[id]
}
