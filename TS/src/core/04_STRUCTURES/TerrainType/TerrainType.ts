import {Ascii2String} from 'core/01_libraries/Ascii'
import {B2S} from 'core/01_libraries/Basic_functions'
import {SLIDE_PERIOD, TERRAIN_DATA_DISPLAY_TIME} from 'core/01_libraries/Constants'
import {COLOR_TERRAIN_DEATH, COLOR_TERRAIN_SLIDE, COLOR_TERRAIN_WALK} from 'core/01_libraries/Init_colorCodes'
import {Text} from 'core/01_libraries/Text'
import {CanUseTerrain} from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import {CACHE_SEPARATEUR_PARAM} from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import {TerrainTypeDeath} from './TerrainTypeDeath'
import {TerrainTypeSlide} from './TerrainTypeSlide'
import {TerrainTypeWalk} from './TerrainTypeWalk'

export abstract class TerrainType {
    label: string
    theAlias: string | null
    kind: string
    terrainTypeId: number
    orderId: number //numéro du terrain (ordre des tilesets), de 1 à 16
    cliffClassId: number //cliff class 1 or 2, depending of the main tileset

    constructor(
        label: string,
        terrainTypeId: number,
        theAlias: string | null,
        kind: string,
        orderId: number,
        cliffClassId: number
    ) {
        this.label = label
        this.terrainTypeId = terrainTypeId
        this.theAlias = theAlias
        this.kind = kind
        this.orderId = orderId
        this.cliffClassId = cliffClassId
    }

    setOrderId = (orderId: number): TerrainType => {
        this.orderId = orderId
        return this
    }

    getOrderId = (): number => {
        return this.orderId
    }

    setCliffClassId = (cliffClassId: number): TerrainType => {
        if (cliffClassId === 1 || cliffClassId === 2) {
            this.cliffClassId = cliffClassId
        }
        return this
    }

    getCliffClassId = (): number => {
        return this.cliffClassId
    }

    setType = (terrainTypeId: number) => {
        this.terrainTypeId = terrainTypeId
    }

    setLabel = (label: string) => {
        this.label = label
    }

    setAlias = (theAlias: string): TerrainType => {
        this.theAlias = theAlias
        return this
    }

    getTerrainTypeId = (): number => {
        return this.terrainTypeId
    }

    setTerrainTypeId = (terrainTypeId: number): boolean => {
        if (!CanUseTerrain(terrainTypeId)) {
            return false
        }
        this.terrainTypeId = terrainTypeId
        return true
    }

    getKind = (): string => {
        return this.kind
    }

    displayForPlayer = (p: player) => {
        let order: string
        let space = '   '
        let displayCanTurn: string
        let display: string = ""

        if (this.orderId !== 0) {
            order = ' (order ' + I2S(this.orderId) + ')'
        } else {
            order = ''
        }

        if (this instanceof TerrainTypeSlide) {
            if (this.getCanTurn()) {
                displayCanTurn = 'can turn'
            } else {
                displayCanTurn = "can't turn"
            }

            display =
                COLOR_TERRAIN_SLIDE +
                this.label +
                ' ' +
                this.theAlias +
                order +
                " : '" +
                Ascii2String(this.terrainTypeId) +
                "'" +
                space
            display = display + I2S(R2I(this.getSlideSpeed() / SLIDE_PERIOD)) + space + displayCanTurn
        } else if (this instanceof TerrainTypeWalk) {
            display =
                COLOR_TERRAIN_WALK +
                this.label +
                ' ' +
                this.theAlias +
                order +
                " : '" +
                Ascii2String(this.terrainTypeId) +
                "'" +
                space
            display = display + I2S(R2I(this.getWalkSpeed()))
        } else if (this instanceof TerrainTypeDeath) {
            display =
                COLOR_TERRAIN_DEATH +
                this.label +
                ' ' +
                this.theAlias +
                order +
                " : '" +
                Ascii2String(this.terrainTypeId) +
                "'" +
                space
            display =
                display +
                R2S(this.getTimeToKill()) +
                space +
                this.getKillingEffectStr() +
                space +
                I2S(R2I(this.getToleranceDist()))
        }

        //display cliff class
        display += space + 'cliff' + I2S(this.cliffClassId)
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    abstract destroy(): void

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

        if (this instanceof TerrainTypeSlide) {
            str =
                str + I2S(R2I(this.getSlideSpeed() / SLIDE_PERIOD)) + CACHE_SEPARATEUR_PARAM + B2S(this.getCanTurn())
        } else if (this instanceof TerrainTypeWalk) {
            str = str + I2S(R2I(this.getWalkSpeed()))
        } else if (this instanceof TerrainTypeDeath) {
            str = str + this.getKillingEffectStr() + CACHE_SEPARATEUR_PARAM
            str = str + R2S(this.getTimeToKill()) + CACHE_SEPARATEUR_PARAM
            str = str + R2S(this.getToleranceDist())
        }

        return str
    }
}
