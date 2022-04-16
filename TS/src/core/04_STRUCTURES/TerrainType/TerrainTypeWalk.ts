import { TERRAIN_DATA_DISPLAY_TIME } from '../../01_libraries/Constants'
import { COLOR_TERRAIN_WALK } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { DISPLAY_SPACE, TerrainType } from './TerrainType'

export class TerrainTypeWalk extends TerrainType {
    private walkSpeed: number

    constructor(label: string, terrainTypeId: number, walkSpeed: number) {
        super(label, terrainTypeId, null, 'walk', 0, 1)

        this.walkSpeed = walkSpeed
    }

    getWalkSpeed = (): number => {
        return this.walkSpeed
    }

    setWalkSpeed = (walkSpeed: number) => {
        this.walkSpeed = walkSpeed
    }

    getColor = () => {
        return COLOR_TERRAIN_WALK
    }

    displayForPlayer = (p: player) => {
        let display = this.baseTextForDisplay()

        display += I2S(R2I(this.getWalkSpeed()))

        //display cliff class
        display += DISPLAY_SPACE + 'cliff' + I2S(this.cliffClassId)
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    toJson() {
        return {
            ...super.toJson(),
            walkSpeed: R2I(this.getWalkSpeed()),
        }
    }

    destroy = () => {}
}
