import { udg_terrainTypes } from '../../../../globals'
import { TerrainType } from './TerrainType'

export const TerrainTypeId2TerrainType = (terrainTypeId: number): TerrainType | null => {
    let i = 0
    while (true) {
        if (i >= udg_terrainTypes.numberOfWalk) break
        if (udg_terrainTypes.getWalk(i).getTerrainTypeId() == terrainTypeId) {
            return udg_terrainTypes.getWalk(i)
        }
        i = i + 1
    }

    i = 0
    while (true) {
        if (i >= udg_terrainTypes.numberOfDeath) break
        if (udg_terrainTypes.getDeath(i).getTerrainTypeId() == terrainTypeId) {
            return udg_terrainTypes.getDeath(i)
        }
        i = i + 1
    }

    i = 0
    while (true) {
        if (i >= udg_terrainTypes.numberOfSlide) break
        if (udg_terrainTypes.getSlide(i).getTerrainTypeId() == terrainTypeId) {
            return udg_terrainTypes.getSlide(i)
        }
        i = i + 1
    }

    return null
}

export const IsTerrainTypeOfKind = (terrainTypeId: number, terrainTypeKind: string): boolean => {
    let terrainType = TerrainTypeId2TerrainType(terrainTypeId)
    if (terrainType === null) {
        return false
    }
    return terrainTypeKind == terrainType.getKind()
}
