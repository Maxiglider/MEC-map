import { Constants } from '../../01_libraries/Constants'

const HALF_TILE = Constants.LARGEUR_CASE / 2

/**
 * The terrain tile grid, as the rest of MEC sees it: roundCoordinateToCenterOfTile (Basic_functions.ts) rounds to the
 * nearest multiple of LARGEUR_CASE, so a tile's centre sits on a multiple of 128 and its borders half a tile away.
 * The grid is anchored on the world origin, not on the map's own bounds, so a tile index can be negative.
 */
export const worldToTile = (coord: number) => Math.floor((coord + HALF_TILE) / Constants.LARGEUR_CASE)

export const tileToWorldCenter = (tile: number) => tile * Constants.LARGEUR_CASE

export const tileToWorldMin = (tile: number) => tile * Constants.LARGEUR_CASE - HALF_TILE

export const tileToWorldMax = (tile: number) => tile * Constants.LARGEUR_CASE + HALF_TILE

/**
 * A tile index has to stay a plain positive integer while tile coordinates can be negative, the grid being anchored
 * on the world origin. 4096 tiles either way is far beyond any Warcraft III map.
 */
const TILE_INDEX_OFFSET = 4096
const TILE_INDEX_STRIDE = 8192

export const tileIndexOf = (tx: number, ty: number) =>
    (ty + TILE_INDEX_OFFSET) * TILE_INDEX_STRIDE + (tx + TILE_INDEX_OFFSET)

export const tileIndexTx = (index: number) => (index % TILE_INDEX_STRIDE) - TILE_INDEX_OFFSET

export const tileIndexTy = (index: number) => Math.floor(index / TILE_INDEX_STRIDE) - TILE_INDEX_OFFSET
