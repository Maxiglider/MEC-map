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
