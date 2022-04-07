import {SLIDE_PERIOD, TERRAIN_DATA_DISPLAY_TIME} from 'core/01_libraries/Constants'
import {DISPLAY_SPACE, TerrainType} from './TerrainType'
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

        this.slideSpeed = slideSpeed
        this.canTurn = canTurn
    }

    getSlideSpeed = (): number => {
        return this.slideSpeed
    }

    setSlideSpeed = (slideSpeed: number) => {
        this.slideSpeed = slideSpeed
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

    getColor = () => {
        return COLOR_TERRAIN_SLIDE
    }

    displayForPlayer = (p: player) => {
        let display = this.baseTextForDisplay()

        let displayCanTurn: string
        if (this.getCanTurn()) {
            displayCanTurn = 'can turn'
        } else {
            displayCanTurn = "can't turn"
        }

        display = display + I2S(R2I(this.getSlideSpeed())) + DISPLAY_SPACE + displayCanTurn

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
            TerrainTypeMax.TerrainTypeId2TerrainTypeAsciiString(this.terrainTypeId) +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.cliffClassId) +
            CACHE_SEPARATEUR_PARAM

        str += I2S(R2I(this.getSlideSpeed())) + CACHE_SEPARATEUR_PARAM + B2S(this.getCanTurn())

        return str
    }

    destroy = () => {

    }
}
