const initTerrainTypeFunctions = () => {
    const TerrainTypeId2TerrainType = (terrainTypeId: number): TerrainType => {
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
        return 0
    }

    const IsTerrainTypeOfKind = (terrainTypeId: number, terrainTypeKind: string): boolean => {
        let terrainType = TerrainTypeId2TerrainType(terrainTypeId)
        if (terrainType === 0) {
            return false
        }
        return terrainTypeKind == terrainType.getKind()
    }

    return { TerrainTypeId2TerrainType, IsTerrainTypeOfKind }
}

export const TerrainTypeFunctions = initTerrainTypeFunctions()
