import { CanUseTerrain } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { Escaper } from '../Escaper/Escaper'
import { TerrainType } from './TerrainType'
import { KillingTimers } from './TerrainTypeDeath_KillingTimers'

export const DEATH_TERRAIN_MAX_TOLERANCE = 50

export class TerrainTypeDeath extends TerrainType {
    private killingEffectStr: string
    private timeToKill: number
    private killingTimers: KillingTimers
    private toleranceDist: number

    constructor(
        label: string,
        terrainTypeId: number,
        killingEffectStr: string,
        timeToKill: number,
        toleranceDist: number
    ) {
        super(label, terrainTypeId, null, 'death', 0, 1)

        if (!CanUseTerrain(terrainTypeId)) {
            // check shoulda been done sooner
            throw new Error('bad code, ttd')
        }

        this.killingEffectStr = killingEffectStr
        this.timeToKill = timeToKill
        this.killingTimers = new KillingTimers()
        this.toleranceDist = toleranceDist
    }

    setKillingEffectStr = (killingEffectStr: string) => {
        this.killingEffectStr = killingEffectStr
    }

    getKillingEffectStr = (): string => {
        return this.killingEffectStr
    }

    setTimeToKill = (newTimeToKill: number): boolean => {
        if (newTimeToKill < 0) {
            return false
        }
        this.timeToKill = newTimeToKill
        return true
    }

    getTimeToKill = (): number => {
        return this.timeToKill
    }

    killEscaper = (escaper: Escaper) => {
        escaper.enableCheckTerrain(false)
        escaper.enableSlide(false)
        escaper.pause(true)
        escaper.createTerrainKillEffect(this.killingEffectStr)
        this.killingTimers.start(escaper.getId(), this.timeToKill)
    }

    getTimer = (escaperId: number): timer => {
        return this.killingTimers.get(escaperId)
    }

    getToleranceDist = (): number => {
        return this.toleranceDist
    }

    setToleranceDist = (toleranceDist: number): boolean => {
        if (toleranceDist < 0 || toleranceDist > DEATH_TERRAIN_MAX_TOLERANCE) {
            return false
        }
        this.toleranceDist = toleranceDist
        return true
    }

    destroy() {
        this.killingTimers.destroy()
    }
}
