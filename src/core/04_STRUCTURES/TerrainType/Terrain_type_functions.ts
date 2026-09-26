import { getUdgTerrainTypes } from '../../../../globals'
// type only: TerrainType requires Terrain_functions, which requires this file
import type { TerrainType } from './TerrainType'

export const TerrainTypeId2TerrainType = (terrainTypeId: number): TerrainType | null => {
    for (const [_, terrainType] of pairs(getUdgTerrainTypes().getAll())) {
        if (terrainType.getTerrainTypeId() === terrainTypeId) {
            return terrainType
        }
    }

    return null
}

export const IsTerrainTypeOfKind = (terrainTypeId: number, terrainTypeKind: string): boolean => {
    let terrainType = TerrainTypeId2TerrainType(terrainTypeId)
    if (terrainType === null) {
        return false
    }
    // a burn terrain kills as a death terrain does
    if (terrainTypeKind === 'death' && terrainType.getKind() === 'burn') {
        return true
    }
    return terrainTypeKind == terrainType.getKind()
}
