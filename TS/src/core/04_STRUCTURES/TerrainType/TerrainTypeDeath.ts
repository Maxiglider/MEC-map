import { CanUseTerrain } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import type { Escaper } from '../Escaper/Escaper'
import {DISPLAY_SPACE, TerrainType} from './TerrainType'
import { KillingTimers } from './TerrainTypeDeath_KillingTimers'
import {COLOR_TERRAIN_DEATH} from "../../01_libraries/Init_colorCodes";
import {Ascii2String} from "../../01_libraries/Ascii";
import {Text} from "../../01_libraries/Text";
import {TERRAIN_DATA_DISPLAY_TIME} from "../../01_libraries/Constants";
import {CACHE_SEPARATEUR_PARAM} from "../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache";

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

    displayForPlayer = (p: player) => {
        let display = this.baseTextForDisplay()

        display +=
            R2S(this.getTimeToKill()) +
            DISPLAY_SPACE +
            this.getKillingEffectStr() +
            DISPLAY_SPACE +
            I2S(R2I(this.getToleranceDist()))

        //display cliff class
        display += DISPLAY_SPACE + 'cliff' + I2S(this.cliffClassId)
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    toString = (): string => {
        let str =
            this.label +
            CACHE_SEPARATEUR_PARAM +
            this.theAlias +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.orderId) +
            CACHE_SEPARATEUR_PARAM
        str =
            str +
            this.kind +
            CACHE_SEPARATEUR_PARAM +
            Ascii2String(this.terrainTypeId) +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.cliffClassId) +
            CACHE_SEPARATEUR_PARAM

        str = str + this.getKillingEffectStr() + CACHE_SEPARATEUR_PARAM
        str = str + R2S(this.getTimeToKill()) + CACHE_SEPARATEUR_PARAM
        str = str + R2S(this.getToleranceDist())

        return str
    }

    destroy = () => {
        this.killingTimers.destroy()
    }
}
