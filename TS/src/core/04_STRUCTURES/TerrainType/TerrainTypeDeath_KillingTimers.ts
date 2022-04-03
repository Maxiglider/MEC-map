import { NB_ESCAPERS } from 'core/01_libraries/Constants'
 import { udg_escapers } from '../../../../globals'
import { udg_levels } from "../../../../globals";
import { forRange } from 'Utils/mapUtils'
import { udg_terrainTypes } from '../../../../globals'

export class KillingTimers {
    private timers: timer[] = []

    constructor() {
        forRange(NB_ESCAPERS, i => (this.timers[i] = CreateTimer()))
    }

    destroy = () => {
        forRange(NB_ESCAPERS, i => DestroyTimer(this.timers[i]))
    }

    TerrainKillTimer2Escaper = (theTimer: timer) => {
        const terrainTypeDeathMaxId = udg_terrainTypes.numberOfDeath - 1
        let terrainTypeDeathId = 0
        let escaperId = 0

        while (!(terrainTypeDeathId > terrainTypeDeathMaxId)) {
            escaperId = 0

            while (!(escaperId >= NB_ESCAPERS)) {
                if (theTimer == udg_terrainTypes.getDeath(terrainTypeDeathId).getTimer(escaperId)) {
                    return udg_escapers.get(escaperId)
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

            if (escaper.currentLevelTouchTerrainDeath == udg_levels.getCurrentLevel()) {
                escaper.kill()
            } else {
                if (escaper.isAlive()) {
                    escaper.enableCheckTerrain(true)
                }
            }
        })

        const escaper = udg_escapers.get(timerId)

        if (escaper) {
            escaper.currentLevelTouchTerrainDeath = udg_levels.getCurrentLevel()
        }
    }

    get = (id: number): timer => this.timers[id]
}
