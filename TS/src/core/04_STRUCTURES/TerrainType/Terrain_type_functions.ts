import { getUdgTerrainTypes } from '../../../../globals'

import { TerrainType } from './TerrainType'

export const TerrainTypeId2TerrainType = (terrainTypeId: number): TerrainType | null => {
    let i = 0
    while (true) {
        if (i >= getUdgTerrainTypes().numberOfWalk) break
        if (getUdgTerrainTypes().getWalk(i).getTerrainTypeId() == terrainTypeId) {
            return getUdgTerrainTypes().getWalk(i)
        }
        i = i + 1
    }

    i = 0
    while (true) {
        if (i >= getUdgTerrainTypes().numberOfDeath) break
        if (getUdgTerrainTypes().getDeath(i).getTerrainTypeId() == terrainTypeId) {
            return getUdgTerrainTypes().getDeath(i)
        }
        i = i + 1
    }

    i = 0
    while (true) {
        if (i >= getUdgTerrainTypes().numberOfSlide) break
        if (getUdgTerrainTypes().getSlide(i).getTerrainTypeId() == terrainTypeId) {
            return getUdgTerrainTypes().getSlide(i)
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
