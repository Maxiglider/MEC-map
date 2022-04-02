import { CanUseTerrain } from 'core/07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { TerrainType } from './TerrainType'

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
}
