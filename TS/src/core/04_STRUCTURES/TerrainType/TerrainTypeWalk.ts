import { CanUseTerrain } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { TerrainType } from './TerrainType'
import {TERRAIN_DATA_DISPLAY_TIME} from "../../01_libraries/Constants";
import {COLOR_TERRAIN_WALK} from "../../01_libraries/Init_colorCodes";
import {CACHE_SEPARATEUR_PARAM} from "../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache";
import {Text} from "../../01_libraries/Text";
import {Ascii2String} from "../../01_libraries/Ascii";

export class TerrainTypeWalk extends TerrainType {
    private walkSpeed: number

    constructor(label: string, terrainTypeId: number, walkSpeed: number) {
        super(label, terrainTypeId, null, 'walk', 0, 1)

        if (!CanUseTerrain(terrainTypeId)) {
            // check shoulda been done sooner
            throw new Error('bad code, ttw')
        }

        this.walkSpeed = walkSpeed
    }

    getWalkSpeed = (): number => {
        return this.walkSpeed
    }

    setWalkSpeed = (walkSpeed: number) => {
        this.walkSpeed = walkSpeed
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
            Ascii2String(this.terrainTypeId) +
            CACHE_SEPARATEUR_PARAM +
            I2S(this.cliffClassId) +
            CACHE_SEPARATEUR_PARAM

        str = str + I2S(R2I(this.getWalkSpeed()))

        return str
    }

    destroy = () => {

    }
}
