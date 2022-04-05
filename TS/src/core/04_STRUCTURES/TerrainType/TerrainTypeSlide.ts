import {SLIDE_PERIOD, TERRAIN_DATA_DISPLAY_TIME} from 'core/01_libraries/Constants'
import { CanUseTerrain } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { TerrainType } from './TerrainType'
import {COLOR_TERRAIN_SLIDE} from "../../01_libraries/Init_colorCodes";
import {B2S} from "../../01_libraries/Basic_functions";
import {CACHE_SEPARATEUR_PARAM} from "../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache";
import {Text} from "../../01_libraries/Text";
import {TerrainTypeMax} from "../../07_TRIGGERS/Modify_terrain_Functions/Terrain_type_max";

export class TerrainTypeSlide extends TerrainType {
    private slideSpeed: number
    private canTurn: boolean

    constructor(label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean) {
        super(label, terrainTypeId, null, 'slide', 0, 1)

        this.slideSpeed = slideSpeed * SLIDE_PERIOD
        this.canTurn = canTurn
    }

    getSlideSpeed = (): number => {
        return this.slideSpeed
    }

    setSlideSpeed = (slideSpeed: number) => {
        this.slideSpeed = slideSpeed * SLIDE_PERIOD
    }

    getCanTurn = (): boolean => {
        return this.canTurn
    }

    setCanTurn = (canTurn: boolean): boolean => {
        if (canTurn === this.canTurn) {
            return false
        }
        this.canTurn = canTurn
        return true
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

        if (this.getCanTurn()) {
            displayCanTurn = 'can turn'
        } else {
            displayCanTurn = "can't turn"
        }

        display =
            COLOR_TERRAIN_SLIDE +
            this.label +
            ' ' +
            (this.theAlias || '') +
            order +
            " : '" +
            TerrainTypeMax.TerrainTypeId2TerrainTypeAsciiString(this.terrainTypeId) +
            "'" +
            space
        display = display + I2S(R2I(this.getSlideSpeed() / SLIDE_PERIOD)) + space + displayCanTurn

        //display cliff class
        display += space + 'cliff' + I2S(this.cliffClassId)
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
            TerrainTypeMax.TerrainTypeId2TerrainTypeAsciiString(this.terrainTypeId) +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.cliffClassId) +
            CACHE_SEPARATEUR_PARAM

        str += I2S(R2I(this.getSlideSpeed() / SLIDE_PERIOD)) + CACHE_SEPARATEUR_PARAM + B2S(this.getCanTurn())

        return str
    }

    destroy = () => {

    }
}
