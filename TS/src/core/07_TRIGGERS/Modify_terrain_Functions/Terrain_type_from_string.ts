import { FunctionsOnNumbers } from 'core/01_libraries/Functions_on_numbers'
import { GetRandomNotUsedTerrain, GetRandomTerrain, GetRandomUsedTerrain } from './Terrain_functions'
import { TerrainTypeAsciiConversion } from './Terrain_type_ascii_conversion'
import { TerrainTypeGrass } from './Terrain_type_grass'
import { TerrainTypeMax } from './Terrain_type_max'

const initTerrainTypeFromString = () => {
    const TerrainTypeString2TerrainTypeId = (str: string): number => {
        if (FunctionsOnNumbers.IsPositiveInteger(str)) {
            return TerrainTypeMax.TerrainTypeMaxId2TerrainTypeId(S2I(str))
        }

        if (
            SubStringBJ(str, 1, 1) === 'g' &&
            FunctionsOnNumbers.IsPositiveInteger(SubStringBJ(str, 2, StringLength(str)))
        ) {
            return TerrainTypeGrass.TerrainTypeGrassId2TerrainTypeId(S2I(SubStringBJ(str, 2, StringLength(str))))
        }

        if (StringLength(str) === 6 && SubStringBJ(str, 1, 1) === "'" && SubStringBJ(str, 6, 6) === "'") {
            return TerrainTypeAsciiConversion.TerrainTypeAsciiString2TerrainTypeId(str)
        }

        if (str === 'x') {
            return GetRandomTerrain()
        }

        if (str === 'xnk') {
            return GetRandomNotUsedTerrain()
        }

        if (str === 'xak') {
            return GetRandomUsedTerrain()
        }

        return 0
    }

    return { TerrainTypeString2TerrainTypeId }
}

export const TerrainTypeFromString = initTerrainTypeFromString()
