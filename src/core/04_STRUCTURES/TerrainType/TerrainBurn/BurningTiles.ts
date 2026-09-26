import { tileIndexOf, worldToTile } from '../../Visibility/TileCoordinates'

/**
 * The slide tiles the fire has reached, whatever level or burn type it came from, with the terrain type they had.
 * Shared by every running fire, so that two of them never take the same tile, and so that whatever reads the terrain
 * for good - a level's tiles, the -smic export, a terrain save's capture - reads the slide a tile really is.
 *
 * A module of its own that imports next to nothing: the savers read it, and must not pull the levels in.
 */
export const burningTileOriginals: { [tileIndex: number]: number | undefined } = {}

/** The terrain type id at a point, the one under the fire when the tile burns */
export const getRealTerrainTypeId = (x: number, y: number) =>
    burningTileOriginals[tileIndexOf(worldToTile(x), worldToTile(y))] ?? GetTerrainType(x, y)

/** The terrain type id the fire replaced at a point, undefined when the tile is not burning */
export const getBurningTileOriginal = (x: number, y: number) =>
    burningTileOriginals[tileIndexOf(worldToTile(x), worldToTile(y))]
