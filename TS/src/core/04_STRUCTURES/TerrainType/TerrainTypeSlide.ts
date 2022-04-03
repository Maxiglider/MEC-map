import { SLIDE_PERIOD } from 'core/01_libraries/Constants'
import { CanUseTerrain } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { TerrainType } from './TerrainType'

export class TerrainTypeSlide extends TerrainType {
    private slideSpeed: number
    private canTurn: boolean

    constructor(label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean) {
        super(label, terrainTypeId, null, 'slide', 0, 1)

        if (!CanUseTerrain(terrainTypeId)) {
            // check shoulda been done sooner
            throw new Error('bad code, tts')
        }

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

    destroy(){

    }
}
