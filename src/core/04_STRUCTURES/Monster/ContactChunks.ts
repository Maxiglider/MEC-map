import { createTimer } from 'Utils/mapUtils'
import { getUdgEscapers, globals, udg_monsters } from '../../../../globals'
import { Constants } from '../../01_libraries/Constants'
import type { Monster } from './Monster'

/**
 * Where every monster can be found, without looking at all of them.
 *
 * MEC's own contact check asks, fifty times a second and for every hero, what that hero touches.
 * Walking the 1518 monsters of a map for each of the 24 heroes is 1.8M tests a second, which no
 * Warcraft III machine survives - so each monster is registered once in the chunks of a grid it
 * can be found in, and a hero only ever looks at the chunk it stands in.
 *
 * The invariant that makes a single lookup per tier enough: a monster is registered in EVERY chunk
 * its padded movement area overlaps, and the padding covers everything that separates the hero's
 * position from a contact - the monster's own reach, the hero's collision size, and the longest
 * step a hero can take between two checks. So if the hero is close enough to touch the monster,
 * the hero's own position is inside that padded area, hence inside one of those chunks.
 *
 * The index is only an accelerator over synced state: as long as it stays exact, the contacts
 * found do not depend on the tier sizes, which makes them a pure performance knob (see
 * docs/MEC_CONTACT_CHECK_TO_REPLACE_IMMOLATION.md).
 */

/**
 * The longest step a hero can take between two contact checks. A step longer than this is not a
 * step at all - a revive, a teleport, a level change - and the check treats it as a landing, so
 * this is a real bound and the padding built on it is exact.
 */
export const MAX_SWEPT_STEP = 2 * Constants.LARGEUR_CASE

/**
 * Chunk sizes in units, from the finest up. Units rather than divisions: the same number means the
 * same thing on any map, and it is directly comparable to a monster's reach and to the padding.
 * A tier holding the whole map is always added on top of these - a monster patrolling the whole
 * map on its own has to live somewhere.
 */
const DEFAULT_TIER_SIZES = [512, 4096]

/**
 * How many chunks of a tier a single monster may occupy before it is moved up to a coarser tier.
 * It has to promote rather than drop: a monster missing from the index is a contact never found.
 */
const MAX_CHUNKS_PER_MONSTER = 16

/** A circle mob is carried around its trigger mob; some of its shapes reach well past the radius */
const CIRCLE_MOB_REACH_FACTOR = 5

/**
 * How long the first registration waits: the monsters of the first level appear as the game starts
 * and register themselves one by one, and this is the moment their count can be told.
 */
const INITIAL_REGISTRATION_DELAY = 1

/** A rebuild waits this long for the rest of the burst that asked for it */
const REBUILD_REQUEST_DELAY = 0.1

const SHAPE_RECT = 0
const SHAPE_SEGMENT = 1

type ChunkBucket = {
    monsters: (Monster | undefined)[]
    /** Filled up to here; the slots beyond are free for the next monster to take */
    count: number
}

type ChunkTier = {
    chunkSize: number
    cols: number
    rows: number
    buckets: { [chunkIndex: number]: ChunkBucket }
    /** Which walk last visited a chunk, so that the same one is not collected twice */
    visitedBy: { [chunkIndex: number]: number }
}

/** Where one monster sits, so that removing it costs no search */
type Membership = {
    buckets: (ChunkBucket | undefined)[]
    indices: number[]
    count: number
}

const state = {
    isInitialized: false,
    tierSizes: DEFAULT_TIER_SIZES,
    tiers: [] as ChunkTier[],
    memberships: {} as { [monsterId: number]: Membership },
    maxHeroCollisionSize: 0,
    monsterCount: 0,
    entryCount: 0,
    walk: 0,
    lastRebuildDuration: 0,
    isRebuildRequested: false,
    isFirstRegistrationDone: false,
}

/**
 * The area of the monster being registered, refilled for each of them and never given back: a
 * table dropped once per monster is a table the Lua of Warcraft III has to collect.
 */
const shape = {
    kinds: [] as number[],
    ax: [] as number[],
    ay: [] as number[],
    bx: [] as number[],
    by: [] as number[],
    count: 0,
    padding: 0,
}

/** The chunks the area covers at the tier being tried */
const collected = { indices: [] as number[], count: 0, isOverCap: false }

export type ContactAreaBuilder = {
    /** A place the monster can stand at */
    addPoint: (x: number, y: number) => void
    /** A line the monster travels along */
    addSegment: (x1: number, y1: number, x2: number, y2: number) => void
    /** An area the monster can be anywhere in */
    addRect: (minX: number, minY: number, maxX: number, maxY: number) => void
}

const pushShape = (kind: number, ax: number, ay: number, bx: number, by: number) => {
    shape.kinds[shape.count] = kind
    shape.ax[shape.count] = ax
    shape.ay[shape.count] = ay
    shape.bx[shape.count] = bx
    shape.by[shape.count] = by
    shape.count++
}

const areaBuilder: ContactAreaBuilder = {
    addPoint: (x, y) => pushShape(SHAPE_RECT, x, y, x, y),
    addSegment: (x1, y1, x2, y2) => pushShape(SHAPE_SEGMENT, x1, y1, x2, y2),
    addRect: (minX, minY, maxX, maxY) =>
        pushShape(SHAPE_RECT, RMinBJ(minX, maxX), RMinBJ(minY, maxY), RMaxBJ(minX, maxX), RMaxBJ(minY, maxY)),
}

const colOf = (tier: ChunkTier, x: number) => {
    const col = Math.floor((x - globals.MAP_MIN_X) / tier.chunkSize)

    return col < 0 ? 0 : col > tier.cols - 1 ? tier.cols - 1 : col
}

const rowOf = (tier: ChunkTier, y: number) => {
    const row = Math.floor((y - globals.MAP_MIN_Y) / tier.chunkSize)

    return row < 0 ? 0 : row > tier.rows - 1 ? tier.rows - 1 : row
}

const collectChunk = (tier: ChunkTier, col: number, row: number) => {
    const chunkIndex = row * tier.cols + col

    if (tier.visitedBy[chunkIndex] === state.walk) {
        return
    }

    tier.visitedBy[chunkIndex] = state.walk

    if (collected.count >= MAX_CHUNKS_PER_MONSTER) {
        collected.isOverCap = true
        return
    }

    collected.indices[collected.count] = chunkIndex
    collected.count++
}

const collectRectChunks = (tier: ChunkTier, minX: number, minY: number, maxX: number, maxY: number) => {
    const firstCol = colOf(tier, minX - shape.padding)
    const lastCol = colOf(tier, maxX + shape.padding)
    const firstRow = rowOf(tier, minY - shape.padding)
    const lastRow = rowOf(tier, maxY + shape.padding)

    for (let col = firstCol; col <= lastCol; col++) {
        for (let row = firstRow; row <= lastRow; row++) {
            collectChunk(tier, col, row)

            if (collected.isOverCap) {
                return
            }
        }
    }
}

/**
 * The chunks a padded line covers, walked column by column (or row by row when the line is steeper
 * than wide) rather than over its bounding box: the bounding box of a long diagonal is mostly empty
 * space, and it is what would push a patrolling monster up to a coarse tier for nothing.
 */
const collectSegmentChunks = (tier: ChunkTier, x1: number, y1: number, x2: number, y2: number) => {
    const padding = shape.padding
    const minX = RMinBJ(x1, x2)
    const maxX = RMaxBJ(x1, x2)
    const minY = RMinBJ(y1, y2)
    const maxY = RMaxBJ(y1, y2)

    if (maxX - minX >= maxY - minY) {
        const slope = maxX - minX > 0 ? (y2 - y1) / (x2 - x1) : 0
        const firstCol = colOf(tier, minX - padding)
        const lastCol = colOf(tier, maxX + padding)

        for (let col = firstCol; col <= lastCol; col++) {
            const chunkMinX = globals.MAP_MIN_X + col * tier.chunkSize
            const fromX = RMaxBJ(minX, chunkMinX - padding)
            const toX = RMinBJ(maxX, chunkMinX + tier.chunkSize + padding)

            if (fromX > toX) {
                continue
            }

            const fromY = y1 + (fromX - x1) * slope
            const toY = y1 + (toX - x1) * slope
            const firstRow = rowOf(tier, RMinBJ(fromY, toY) - padding)
            const lastRow = rowOf(tier, RMaxBJ(fromY, toY) + padding)

            for (let row = firstRow; row <= lastRow; row++) {
                collectChunk(tier, col, row)

                if (collected.isOverCap) {
                    return
                }
            }
        }

        return
    }

    const slope = (x2 - x1) / (y2 - y1)
    const firstRow = rowOf(tier, minY - padding)
    const lastRow = rowOf(tier, maxY + padding)

    for (let row = firstRow; row <= lastRow; row++) {
        const chunkMinY = globals.MAP_MIN_Y + row * tier.chunkSize
        const fromY = RMaxBJ(minY, chunkMinY - padding)
        const toY = RMinBJ(maxY, chunkMinY + tier.chunkSize + padding)

        if (fromY > toY) {
            continue
        }

        const fromX = x1 + (fromY - y1) * slope
        const toX = x1 + (toY - y1) * slope
        const firstCol = colOf(tier, RMinBJ(fromX, toX) - padding)
        const lastCol = colOf(tier, RMaxBJ(fromX, toX) + padding)

        for (let col = firstCol; col <= lastCol; col++) {
            collectChunk(tier, col, row)

            if (collected.isOverCap) {
                return
            }
        }
    }
}

/** The chunks of one tier the area covers, or nothing when there are more of them than the cap */
const collectTierChunks = (tier: ChunkTier) => {
    state.walk++
    collected.count = 0
    collected.isOverCap = false

    for (let i = 0; i < shape.count; i++) {
        if (shape.kinds[i] === SHAPE_SEGMENT) {
            collectSegmentChunks(tier, shape.ax[i], shape.ay[i], shape.bx[i], shape.by[i])
        } else {
            collectRectChunks(tier, shape.ax[i], shape.ay[i], shape.bx[i], shape.by[i])
        }

        if (collected.isOverCap) {
            return false
        }
    }

    return collected.count > 0
}

const getMembership = (monsterId: number) => {
    const existing = state.memberships[monsterId]

    if (existing !== undefined) {
        return existing
    }

    const membership: Membership = { buckets: [], indices: [], count: 0 }
    state.memberships[monsterId] = membership

    return membership
}

const addToChunk = (tier: ChunkTier, chunkIndex: number, monster: Monster, membership: Membership) => {
    let bucket = tier.buckets[chunkIndex]

    if (bucket === undefined) {
        bucket = { monsters: [], count: 0 }
        tier.buckets[chunkIndex] = bucket
    }

    bucket.monsters[bucket.count] = monster
    membership.buckets[membership.count] = bucket
    membership.indices[membership.count] = bucket.count
    bucket.count++
    membership.count++
    state.entryCount++
}

/** Swaps the last monster of the chunk into the hole, and tells it where it now sits */
const removeFromChunk = (bucket: ChunkBucket, index: number, monster: Monster) => {
    const lastIndex = bucket.count - 1
    const moved = bucket.monsters[lastIndex]

    bucket.monsters[index] = moved
    bucket.monsters[lastIndex] = undefined
    bucket.count = lastIndex
    state.entryCount--

    if (moved === undefined || moved === monster) {
        return
    }

    const movedMembership = state.memberships[moved.getId()]

    if (movedMembership === undefined) {
        return
    }

    for (let i = 0; i < movedMembership.count; i++) {
        if (movedMembership.buckets[i] === bucket && movedMembership.indices[i] === lastIndex) {
            movedMembership.indices[i] = index
            return
        }
    }
}

export const unregisterMonsterFromChunks = (monster: Monster) => {
    const membership = state.memberships[monster.getId()]

    if (membership === undefined || membership.count === 0) {
        return
    }

    for (let i = 0; i < membership.count; i++) {
        const bucket = membership.buckets[i]

        if (bucket !== undefined) {
            removeFromChunk(bucket, membership.indices[i], monster)
            membership.buckets[i] = undefined
        }
    }

    membership.count = 0
    state.monsterCount--
}

/** For a monster that is gone for good: its chunks are left, and its own bookkeeping dropped */
export const forgetMonsterInChunks = (monster: Monster) => {
    unregisterMonsterFromChunks(monster)
    delete state.memberships[monster.getId()]
}

/**
 * Puts a monster in the chunks it can be found in, at the finest tier that can hold it. Called
 * whenever its unit appears; a monster nothing can touch is left out of the index entirely.
 */
export const registerMonsterInChunks = (monster: Monster) => {
    unregisterMonsterFromChunks(monster)

    if (!state.isInitialized || monster.u === undefined) {
        return
    }

    const reach = monster.getMonsterType()?.getImmolationRadius() ?? 0

    if (reach <= 0) {
        // no immolation is no contact: the hero passes through it
        return
    }

    shape.count = 0
    shape.padding = reach + state.maxHeroCollisionSize + MAX_SWEPT_STEP
    monster.describeContactArea(areaBuilder)

    if (shape.count === 0) {
        return
    }

    for (let tierIndex = 0; tierIndex < state.tiers.length; tierIndex++) {
        const tier = state.tiers[tierIndex]

        if (!collectTierChunks(tier)) {
            continue
        }

        const membership = getMembership(monster.getId())

        for (let i = 0; i < collected.count; i++) {
            addToChunk(tier, collected.indices[i], monster, membership)
        }

        state.monsterCount++

        return
    }
}

const buildTiers = () => {
    const mapWidth = globals.MAP_MAX_X - globals.MAP_MIN_X
    const mapHeight = globals.MAP_MAX_Y - globals.MAP_MIN_Y
    const mapSpan = RMaxBJ(mapWidth, mapHeight)

    state.tiers = []

    const pushTier = (chunkSize: number) => {
        state.tiers[state.tiers.length] = {
            chunkSize,
            cols: Math.floor(mapWidth / chunkSize) + 1,
            rows: Math.floor(mapHeight / chunkSize) + 1,
            buckets: {},
            visitedBy: {},
        }
    }

    for (let i = 0; i < state.tierSizes.length; i++) {
        if (state.tierSizes[i] > 0 && state.tierSizes[i] < mapSpan) {
            pushTier(state.tierSizes[i])
        }
    }

    // the whole map, always last: a single chunk nothing can be too big for
    pushTier(mapSpan + 1)
}

/** The largest hero the padding has to account for, whatever hero the check ends up asking about */
const refreshMaxHeroCollisionSize = () => {
    let maxCollisionSize = globals.heroBaseCollisionSize

    // the escapers may not be there yet, early in the initialization
    getUdgEscapers()?.forAll(escaper => {
        const collisionSize = escaper.getHeroCollisionSize()

        if (collisionSize > maxCollisionSize) {
            maxCollisionSize = collisionSize
        }
    })

    state.maxHeroCollisionSize = maxCollisionSize
}

/**
 * Registers every monster unit standing on the map again, from nothing. Cheap enough to be the
 * answer to anything the index cannot follow on its own - a changed immolation radius, a changed
 * hero collision size, a new tier ladder.
 */
export const rebuildContactChunks = () => {
    const startTime = os.clock()

    print('Starting monsters contact check registration...')

    refreshMaxHeroCollisionSize()
    buildTiers()
    state.isInitialized = true

    state.memberships = {}
    state.monsterCount = 0
    state.entryCount = 0

    for (const [_, monster] of pairs(udg_monsters)) {
        registerMonsterInChunks(monster)
    }

    state.lastRebuildDuration = os.clock() - startTime
    state.isFirstRegistrationDone = true

    print(
        `Monsters contact check registration done. ${state.monsterCount} monster units on the map, ` +
            `${state.entryCount} entries in ${state.tiers.length} tiers, ` +
            `${Math.floor(state.lastRebuildDuration * 1000 + 0.5)} ms. ` +
            `The monsters of a level to come register as it starts.`
    )
}

/**
 * Asks for a rebuild instead of doing one: a single command can change the immolation of every
 * monster type in a row, or the collision size of every hero, and the index only has to be right
 * once such a burst has settled.
 *
 * One rebuild is pending at a time, and anything asked for before the first registration of the
 * game is answered by that one - which registers everything anyway, and is the only one to say so.
 */
export const requestContactChunksRebuild = () => {
    if (state.isRebuildRequested || !state.isFirstRegistrationDone) {
        return
    }

    state.isRebuildRequested = true

    createTimer(REBUILD_REQUEST_DELAY, false, () => {
        state.isRebuildRequested = false
        rebuildContactChunks()
    })
}

export const setContactChunkTierSizes = (tierSizes: number[]) => {
    state.tierSizes = tierSizes
    rebuildContactChunks()
}

export const getContactChunkTierSizes = () => state.tierSizes

export const getContactChunkTierCount = () => state.tiers.length

/** The monsters a hero standing there may touch, at one tier. Every tier has to be asked. */
export const getContactChunkBucket = (tierIndex: number, x: number, y: number) => {
    const tier = state.tiers[tierIndex]

    if (tier === undefined) {
        return undefined
    }

    return tier.buckets[rowOf(tier, y) * tier.cols + colOf(tier, x)]
}

export const initContactChunks = () => {
    if (state.isInitialized) {
        return
    }

    refreshMaxHeroCollisionSize()
    buildTiers()
    state.isInitialized = true

    // From here on every monster unit created registers itself; this only tells what came of it,
    // once the first level has had the time to put its own monsters on the map.
    createTimer(INITIAL_REGISTRATION_DELAY, false, rebuildContactChunks)
}

export const getContactChunkStats = () => {
    const lines: string[] = []

    let definedMonsters = 0
    let monstersWithUnit = 0
    let untouchableMonsters = 0

    for (const [_, monster] of pairs(udg_monsters)) {
        definedMonsters++

        if (monster.u !== undefined) {
            monstersWithUnit++

            if ((monster.getMonsterType()?.getImmolationRadius() ?? 0) <= 0) {
                untouchableMonsters++
            }
        }
    }

    lines[0] =
        `Monsters: ${state.monsterCount} registered, ${monstersWithUnit} with a unit on the map ` +
        `(${untouchableMonsters} of them without immolation, so untouchable), ${definedMonsters} defined in all`
    lines[1] =
        `Tiers: ${state.tiers.length}, entries: ${state.entryCount}, ` +
        `hero padding: ${state.maxHeroCollisionSize} + ${MAX_SWEPT_STEP}, ` +
        `last rebuild: ${Math.floor(state.lastRebuildDuration * 1000 + 0.5)} ms`

    for (let tierIndex = 0; tierIndex < state.tiers.length; tierIndex++) {
        const tier = state.tiers[tierIndex]
        let chunks = 0
        let entries = 0
        let worstChunk = 0

        for (const [_, bucket] of pairs(tier.buckets)) {
            if (bucket.count > 0) {
                chunks++
                entries += bucket.count

                if (bucket.count > worstChunk) {
                    worstChunk = bucket.count
                }
            }
        }

        lines[lines.length] =
            `  tier ${tierIndex} (${tier.chunkSize} units, ${tier.cols}x${tier.rows}): ` +
            `${entries} entries in ${chunks} chunks, worst chunk ${worstChunk}`
    }

    return lines
}

/**
 * Checks that every registered monster unit is really standing in one of its own chunks. Nothing
 * uses it at runtime: it is there to catch a monster moved in a way its movement class does not
 * describe, which is the one mistake that would cost a contact.
 */
export const auditContactChunks = () => {
    const offenders: string[] = []

    for (const [_, monster] of pairs(udg_monsters)) {
        const membership = state.memberships[monster.getId()]

        if (monster.u === undefined || membership === undefined || membership.count === 0) {
            continue
        }

        const x = GetUnitX(monster.u)
        const y = GetUnitY(monster.u)
        let isFound = false

        for (let tierIndex = 0; tierIndex < state.tiers.length && !isFound; tierIndex++) {
            const bucket = getContactChunkBucket(tierIndex, x, y)

            if (bucket === undefined) {
                continue
            }

            for (let i = 0; i < bucket.count; i++) {
                if (bucket.monsters[i] === monster) {
                    isFound = true
                    break
                }
            }
        }

        if (!isFound) {
            offenders[offenders.length] =
                `  monster ${monster.getId()} (${monster.constructor.name}) at ${Math.floor(x)}, ${Math.floor(y)}`
        }
    }

    return offenders
}
