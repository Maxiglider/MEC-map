import { Escaper } from '../Escaper/Escaper'

export const DEATH_TERRAIN_MAX_TOLERANCE = 50

// TODO; extends TerrainType
export class TerrainTypeDeath {
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
        let i: number

        if (!CanUseTerrain(terrainTypeId)) {
            return 0
        }

        this.label = label
        this.theAlias = null
        this.terrainTypeId = terrainTypeId
        this.killingEffectStr = killingEffectStr
        this.timeToKill = timeToKill
        this.killingTimers = KillingTimers.create()
        this.kind = 'death'
        this.toleranceDist = toleranceDist
        this.orderId = 0
        this.cliffClassId = 1
    }

    onDestroy = () => {
        this.killingTimers.destroy()
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
}
