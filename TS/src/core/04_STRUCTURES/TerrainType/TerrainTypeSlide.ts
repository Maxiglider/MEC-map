import { SLIDE_PERIOD } from 'core/01_libraries/Constants'
import { TerrainType } from './TerrainType'

export class TerrainTypeSlide extends TerrainType {
    private slideSpeed: number
    private canTurn: boolean

    // TODO; Used to be static

    create = (label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean): TerrainTypeSlide => {
        let tt: TerrainTypeSlide
        if (!CanUseTerrain(terrainTypeId)) {
            return 0
        }
        tt = TerrainTypeSlide.allocate()
        tt.label = label
        tt.theAlias = null
        tt.terrainTypeId = terrainTypeId
        tt.kind = 'slide'
        tt.slideSpeed = slideSpeed * SLIDE_PERIOD
        tt.canTurn = canTurn
        tt.orderId = 0
        tt.cliffClassId = 1
        return tt
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
}
