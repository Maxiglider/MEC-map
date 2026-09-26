import { Constants } from 'core/01_libraries/Constants'
import { getUdgLevels, getUdgTerrainTypes, globals } from '../../../../../globals'
import type { Level } from '../../Level/Level'
import type { Start } from '../../Level/StartAndEnd'
import { tileIndexOf, tileIndexTx, tileIndexTy, tileToWorldCenter } from '../../Visibility/TileCoordinates'
import type { TerrainTypeKind } from '../TerrainType'
import { burningTileOriginals } from './BurningTiles'

/** The terrain type id a tile really has: the one under the fire when it burns */
export const getTileTerrainTypeId = (tileIndex: number) =>
    burningTileOriginals[tileIndex] ??
    GetTerrainType(tileToWorldCenter(tileIndexTx(tileIndex)), tileToWorldCenter(tileIndexTy(tileIndex)))

export type BurnZone = {
    /** The tiles of the level, in the order the flood reached them: an order every machine agrees on */
    tiles: number[]
    has: { [tileIndex: number]: boolean | undefined }
}

const NEIGHBOUR_DX = [1, -1, 0, 0]
const NEIGHBOUR_DY = [0, 0, 1, -1]

export const forEachNeighbour = (tileIndex: number, cb: (neighbourIndex: number) => void) => {
    const tx = tileIndexTx(tileIndex)
    const ty = tileIndexTy(tileIndex)

    for (let i = 0; i < 4; i++) {
        cb(tileIndexOf(tx + NEIGHBOUR_DX[i], ty + NEIGHBOUR_DY[i]))
    }
}

const isTileInMap = (tileIndex: number) => {
    const x = tileToWorldCenter(tileIndexTx(tileIndex))
    const y = tileToWorldCenter(tileIndexTy(tileIndex))

    return x >= globals.MAP_MIN_X && x <= globals.MAP_MAX_X && y >= globals.MAP_MIN_Y && y <= globals.MAP_MAX_Y
}

/** Walk and slide are the ground a level is made of, the one its heroes can be on */
const makeKindOf = () => {
    const kinds: { [terrainTypeId: number]: TerrainTypeKind | undefined } = {}

    for (const [_, terrainType] of pairs(getUdgTerrainTypes().getAll())) {
        kinds[terrainType.getTerrainTypeId()] = terrainType.getKind()
    }

    return (tileIndex: number) => kinds[getTileTerrainTypeId(tileIndex)]
}

type KindOf = (tileIndex: number) => TerrainTypeKind | undefined

/**
 * The seeds, and every tile linked to them by a side whose kind the flood spreads to, never entering a blocked tile.
 * The tiles come in the order they were reached: a queue read by index, the array growing while it is walked.
 */
const flood = (
    seeds: number[],
    kindOf: KindOf,
    spreadsTo: (kind: TerrainTypeKind | undefined) => boolean,
    blocked?: BurnZone
) => {
    const zone: BurnZone = { tiles: [], has: {} }

    const reach = (tileIndex: number) => {
        if (zone.has[tileIndex] || !isTileInMap(tileIndex) || blocked?.has[tileIndex]) {
            return
        }

        if (spreadsTo(kindOf(tileIndex))) {
            zone.has[tileIndex] = true
            zone.tiles.push(tileIndex)
        }
    }

    for (const tileIndex of seeds) {
        reach(tileIndex)
    }

    for (let head = 0; head < zone.tiles.length; head++) {
        forEachNeighbour(zone.tiles[head], reach)
    }

    return zone
}

const isWalk = (kind: TerrainTypeKind | undefined) => kind === 'walk'

const isWalkOrSlide = (kind: TerrainTypeKind | undefined) => kind === 'walk' || kind === 'slide'

/** The tiles whose centre is in the rect. A rect narrower than a tile still holds the tile under its centre */
const tilesOfRect = (rect: Start): number[] => {
    const minTx = Math.ceil(rect.minX / Constants.LARGEUR_CASE)
    const maxTx = Math.floor(rect.maxX / Constants.LARGEUR_CASE)
    const minTy = Math.ceil(rect.minY / Constants.LARGEUR_CASE)
    const maxTy = Math.floor(rect.maxY / Constants.LARGEUR_CASE)

    if (minTx > maxTx || minTy > maxTy) {
        return [
            tileIndexOf(
                Math.floor(rect.getCenterX() / Constants.LARGEUR_CASE + 0.5),
                Math.floor(rect.getCenterY() / Constants.LARGEUR_CASE + 0.5)
            ),
        ]
    }

    const tiles: number[] = []

    for (let ty = minTy; ty <= maxTy; ty++) {
        for (let tx = minTx; tx <= maxTx; tx++) {
            tiles.push(tileIndexOf(tx, ty))
        }
    }

    return tiles
}

/** Where a level starts: the walk tiles of its start rect, and every walk tile linked to them */
const computeStartZone = (start: Start, kindOf: KindOf) => flood(tilesOfRect(start), kindOf, isWalk)

/** A start zone and every walk or slide tile linked to it, never entering the start zone of the level after */
const floodLevel = (startZone: BurnZone, nextStartZone: BurnZone | undefined, kindOf: KindOf) =>
    flood(startZone.tiles, kindOf, isWalkOrSlide, nextStartZone)

/**
 * The tiles a level is played on, found from its start rect since a level does not say which tiles are its own:
 * what the flood from its start zone reaches, stopping at the start zone of the next level, and leaving out what the
 * same flood from the previous level's start zone reaches - that ground is the previous level's.
 *
 * A start zone is not only the start rect: it is the walk ground linked to it, so a walk tile touching the next
 * level's start rect is that level's too.
 *
 * Read from the terrain as it is when the level starts, so a terrain painted since then counts at the next start.
 */
export const computeBurnZone = (level: Level): BurnZone | null => {
    const start = level.getStart()

    if (!start) {
        return null
    }

    const kindOf = makeKindOf()
    const nextStart = getUdgLevels()
        .get(level.getId() + 1)
        ?.getStart()
    const previousStart = getUdgLevels()
        .get(level.getId() - 1)
        ?.getStart()

    const startZone = computeStartZone(start, kindOf)
    const zone = floodLevel(startZone, nextStart ? computeStartZone(nextStart, kindOf) : undefined, kindOf)

    if (!previousStart) {
        return zone
    }

    const previousZone = floodLevel(computeStartZone(previousStart, kindOf), startZone, kindOf)
    const ownZone: BurnZone = { tiles: [], has: {} }

    for (const tileIndex of zone.tiles) {
        if (!previousZone.has[tileIndex]) {
            ownZone.has[tileIndex] = true
            ownZone.tiles.push(tileIndex)
        }
    }

    return ownZone
}
