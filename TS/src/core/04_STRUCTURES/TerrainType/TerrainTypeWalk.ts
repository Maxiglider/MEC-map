import { TerrainType } from './TerrainType'

export class TerrainTypeWalk extends TerrainType {
    private walkSpeed: number

    // TODO; Used to be static

    create = (label: string, terrainTypeId: number, walkSpeed: number): TerrainTypeWalk => {
        let tt: TerrainTypeWalk
        if (!CanUseTerrain(terrainTypeId)) {
            return 0
        }
        tt = TerrainTypeWalk.allocate()
        tt.label = label
        tt.theAlias = null
        tt.terrainTypeId = terrainTypeId
        tt.walkSpeed = walkSpeed
        tt.kind = 'walk'
        tt.orderId = 0
        tt.cliffClassId = 1
        return tt
    }

    getWalkSpeed = (): number => {
        return this.walkSpeed
    }

    setWalkSpeed = (walkSpeed: number) => {
        this.walkSpeed = walkSpeed
    }
}
