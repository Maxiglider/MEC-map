/**
 * An old map's visibility rectangles, turned into the per-tile visibility MEC composes (see docs/VISIBILITY.md).
 *
 * The old rectangles could only ever reveal, and a level holds either them or tiles, never both - so a map whose
 * levels light part of the maze now and then has to go to tiles entirely. What that costs is a border moving by up
 * to half a tile; what it buys is a `periodic` type saying the blink outright, a `masked` type saying what an old
 * map said by switching a fog modifier off, and a game data that is usually *lighter*, since the old rectangles
 * overlap heavily and the union of their tiles partitions shorter than they do.
 *
 * The partition is the game's own (`VisibilityPartition.ts`), run here rather than reimplemented, so a converted map
 * ships exactly the rectangles the game would have written. That module is kept free of imports for this reason.
 */
import { partitionTiles, TileRect } from '../../src/core/04_STRUCTURES/Visibility/VisibilityPartition'

type Rect = { minX: number; minY: number; maxX: number; maxY: number }

/** MEC's tile grid: a tile centre on a multiple of 128, anchored on the world origin, so an index can be negative */
const TILE_WIDTH = 128
const HALF_TILE = TILE_WIDTH / 2
const worldToTile = (coord: number) => Math.floor((coord + HALF_TILE) / TILE_WIDTH)

/** Tiles live in a set keyed by one number; the offset keeps the key positive for the negative half of the map */
const KEY_OFFSET = 4096
const KEY_STRIDE = 16384
const tileKey = (tx: number, ty: number) => (tx + KEY_OFFSET) * KEY_STRIDE + (ty + KEY_OFFSET)
const keyTx = (key: number) => Math.floor(key / KEY_STRIDE) - KEY_OFFSET
const keyTy = (key: number) => (key % KEY_STRIDE) - KEY_OFFSET

export type TileSet = Set<number>

/** Every tile a world rectangle covers, its borders snapping to the nearest tile centre */
export const tilesOfRect = (r: Rect, into: TileSet = new Set()): TileSet => {
    for (let tx = worldToTile(r.minX); tx <= worldToTile(r.maxX); tx++) {
        for (let ty = worldToTile(r.minY); ty <= worldToTile(r.maxY); ty++) {
            into.add(tileKey(tx, ty))
        }
    }
    return into
}

export const unionTiles = (...sets: TileSet[]): TileSet => {
    const out: TileSet = new Set()
    for (const set of sets) for (const key of set) out.add(key)
    return out
}

export const withoutTiles = (tiles: TileSet, removed: TileSet): TileSet => {
    const out: TileSet = new Set()
    for (const key of tiles) if (!removed.has(key)) out.add(key)
    return out
}

/** The game's own partition, into the minimum number of rectangles, in tile coordinates with both ends included */
export const partitionTileSet = (tiles: TileSet): TileRect[] => {
    if (tiles.size === 0) return []

    let minTx = Infinity
    let minTy = Infinity
    let maxTx = -Infinity
    let maxTy = -Infinity

    for (const key of tiles) {
        const tx = keyTx(key)
        const ty = keyTy(key)
        if (tx < minTx) minTx = tx
        if (tx > maxTx) maxTx = tx
        if (ty < minTy) minTy = ty
        if (ty > maxTy) maxTy = ty
    }

    return partitionTiles({ minTx, minTy, maxTx, maxTy, has: (tx, ty) => tiles.has(tileKey(tx, ty)) })
}

/** What the game data holds for a level: the rectangles its tiles partition into, grouped by visibility type */
export type VisibilityTileGroup = { type: string; rects: number[][] }

export const tileGroup = (type: string, tiles: TileSet): VisibilityTileGroup | undefined => {
    const rects = partitionTileSet(tiles)
    if (rects.length === 0) return undefined
    return { type, rects: rects.map(r => [r.tx1, r.ty1, r.tx2, r.ty2]) }
}

/**
 * The tiles of every level, from what each level reveals and what it lights now and then.
 *
 * The two systems do not resolve a tile the same way, and that is the whole of the work here. The old rectangles
 * were cumulative and reveal always won, so a light over ground a level revealed changed nothing there. Tiles are
 * resolved by the **highest** active level, so a level's periodic tiles would override what a lower level reveals,
 * and put out a light the old map kept on. Hence:
 *
 * - `periodic` is painted only where no level up to this one reveals;
 * - `masked` carries what the old map did by switching a level's lights off when the next one began - the lights of
 *   the levels before, again minus what is revealed by then.
 */
export const visibilityTilesOfLevels = (
    levels: { visible: Rect[]; periodic: { type: string; rect: Rect }[] }[]
): VisibilityTileGroup[][] => {
    const revealed: TileSet[] = []
    const revealedSoFar: TileSet[] = []
    const accumulated: TileSet = new Set()

    for (const level of levels) {
        const tiles: TileSet = new Set()
        for (const rect of level.visible) tilesOfRect(rect, tiles)
        revealed.push(tiles)

        for (const key of tiles) accumulated.add(key)
        revealedSoFar.push(new Set(accumulated))
    }

    // the periodic tiles of each level, by type, and the running union of every level's, for the masking below
    const periodicByLevel: { [type: string]: TileSet }[] = []
    const periodicSoFar: TileSet = new Set()
    const litBefore: TileSet[] = []

    levels.forEach((level, levelIndex) => {
        litBefore.push(new Set(periodicSoFar))

        const byType: { [type: string]: TileSet } = {}
        for (const { type, rect } of level.periodic) {
            const tiles = withoutTiles(tilesOfRect(rect), revealedSoFar[levelIndex])
            byType[type] = unionTiles(byType[type] ?? new Set(), tiles)
        }

        for (const type of Object.keys(byType)) for (const key of byType[type]) periodicSoFar.add(key)
        periodicByLevel.push(byType)
    })

    return levels.map((_level, levelIndex) => {
        const groups: VisibilityTileGroup[] = []

        const visible = tileGroup('visible', revealed[levelIndex])
        visible && groups.push(visible)

        for (const type of Object.keys(periodicByLevel[levelIndex]).sort()) {
            const group = tileGroup(type, periodicByLevel[levelIndex][type])
            group && groups.push(group)
        }

        const masked = tileGroup('masked', withoutTiles(litBefore[levelIndex], revealedSoFar[levelIndex]))
        masked && groups.push(masked)

        return groups
    })
}
