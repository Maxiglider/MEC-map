import { ReplaceBackslahsesInLinks } from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { DISPLAY_SPACE } from './TerrainType'
import { TerrainTypeDeath } from './TerrainTypeDeath'

const COLOR_TERRAIN_BURN = udg_colorCode[Constants.RED]

export const BURN_DEFAULT_PROPAGATION_TIME = 1
export const BURN_DEFAULT_BURNING_TIME = 3
export const BURN_DEFAULT_BURNING_EFFECT_TIME = 0
export const BURN_DEFAULT_TIME_TO_BURN_AGAIN = 3
/** Below this a propagation would tick faster than the terrain check reads the ground */
export const BURN_MIN_PROPAGATION_TIME = 0.1

/**
 * A death terrain that spreads over the slide tiles around it, one tile further at each propagation time.
 *
 * The tiles painted with it are the sources: they burn for good. A tile the fire reaches takes this terrain type
 * for a while, then gets back the slide terrain it had. Every duration but the propagation time is counted in
 * propagation times. The spreading itself is run by the level the tiles belong to, see TerrainBurn/.
 */
export class TerrainTypeBurn extends TerrainTypeDeath {
    private propagationTime: number
    /** How long a reached tile burns before becoming slide again. 0: for good */
    private burningTime: number
    /** Shown on a tile the fire reaches, not on the sources */
    private burningEffectStr: string = ''
    /** How long the effect of a reached tile lasts. 0: as long as the tile burns */
    private burningEffectTime: number
    /** How long a tile back to slide cannot burn again */
    private timeToBurnAgain: number

    constructor(
        label: string,
        terrainTypeId: number,
        propagationTime: number,
        burningTime: number,
        burningEffectStr: string,
        burningEffectTime: number,
        timeToBurnAgain: number,
        killingEffectStr: string,
        timeToKill: number,
        toleranceDist: number
    ) {
        super(label, terrainTypeId, killingEffectStr, timeToKill, toleranceDist, 'burn')

        this.propagationTime = propagationTime
        this.burningTime = burningTime
        this.setBurningEffectStr(burningEffectStr)
        this.burningEffectTime = burningEffectTime
        this.timeToBurnAgain = timeToBurnAgain
    }

    getPropagationTime = () => this.propagationTime
    setPropagationTime = (propagationTime: number): boolean => {
        if (propagationTime < BURN_MIN_PROPAGATION_TIME) {
            return false
        }
        this.propagationTime = propagationTime
        return true
    }

    getBurningTime = () => this.burningTime
    setBurningTime = (burningTime: number) => (this.burningTime = burningTime)

    getBurningEffectStr = () => this.burningEffectStr
    setBurningEffectStr = (burningEffectStr: string) => {
        this.burningEffectStr = ReplaceBackslahsesInLinks(burningEffectStr)
    }

    getBurningEffectTime = () => this.burningEffectTime
    setBurningEffectTime = (burningEffectTime: number) => (this.burningEffectTime = burningEffectTime)

    getTimeToBurnAgain = () => this.timeToBurnAgain
    setTimeToBurnAgain = (timeToBurnAgain: number) => (this.timeToBurnAgain = timeToBurnAgain)

    getColor = () => {
        return COLOR_TERRAIN_BURN
    }

    toText = (): string => {
        return (
            this.deathTextForDisplay() +
            DISPLAY_SPACE +
            'burn: ' +
            R2S(this.propagationTime) +
            's ' +
            I2S(this.burningTime) +
            ' ' +
            (this.burningEffectStr === '' ? 'none' : this.burningEffectStr) +
            ' ' +
            I2S(this.burningEffectTime) +
            ' ' +
            I2S(this.timeToBurnAgain)
        )
    }

    toJson() {
        const output = super.toJson()

        output['propagationTime'] = this.propagationTime
        output['burningTime'] = this.burningTime
        output['burningEffect'] = this.burningEffectStr
        output['burningEffectTime'] = this.burningEffectTime
        output['timeToBurnAgain'] = this.timeToBurnAgain

        return output
    }
}
