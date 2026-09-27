import { tileIndexOf, tileIndexTx, tileIndexTy, tileToWorldCenter, worldToTile } from '../../Visibility/TileCoordinates'

/**
 * The slide tiles the fire has reached, whatever level or burn type it came from, with the terrain type they had.
 * Shared by every running fire, so that two of them never take the same tile, and so that whatever reads the terrain
 * for good - a level's tiles, the -smic export, a terrain save's capture - reads the slide a tile really is.
 *
 * A module of its own that imports next to nothing: the savers read it, and must not pull the levels in.
 */
export const burningTileOriginals: { [tileIndex: number]: number | undefined } = {}

/** The burn terrain type id that took each of those tiles */
const burningTileBurnIds: { [tileIndex: number]: number | undefined } = {}

export const setBurningTile = (tileIndex: number, originalTerrainTypeId: number, burnTerrainTypeId: number) => {
    burningTileOriginals[tileIndex] = originalTerrainTypeId
    burningTileBurnIds[tileIndex] = burnTerrainTypeId
}

export const clearBurningTile = (tileIndex: number) => {
    burningTileOriginals[tileIndex] = undefined
    burningTileBurnIds[tileIndex] = undefined
}

/**
 * The terrain type id the fire replaced on a tile, undefined when it is not burning. A tile something else painted
 * over since it caught fire - a terrain save loaded, a maker - is not burning any more, whatever its fire has not
 * noticed yet: the terrain it shows is its real one.
 */
export const getBurningTileOriginalAt = (tileIndex: number) => {
    const original = burningTileOriginals[tileIndex]

    if (original === undefined) {
        return undefined
    }

    const x = tileToWorldCenter(tileIndexTx(tileIndex))
    const y = tileToWorldCenter(tileIndexTy(tileIndex))

    return GetTerrainType(x, y) === burningTileBurnIds[tileIndex] ? original : undefined
}

/** The terrain type id the fire replaced at a point, undefined when the tile is not burning */
export const getBurningTileOriginal = (x: number, y: number) =>
    getBurningTileOriginalAt(tileIndexOf(worldToTile(x), worldToTile(y)))

/** The terrain type id at a point, the one under the fire when the tile burns */
export const getRealTerrainTypeId = (x: number, y: number) => getBurningTileOriginal(x, y) ?? GetTerrainType(x, y)
