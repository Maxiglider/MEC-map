import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgVisibilityTypes } from '../../../../globals'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { log } from '../../Log/log'
import { TileMask, partitionTiles } from './VisibilityPartition'
import { VisibilityType } from './VisibilityType'

/**
 * A tile index has to stay a plain positive integer while tile coordinates can be negative, the grid being anchored
 * on the world origin. 4096 tiles either way is far beyond any Warcraft III map.
 */
const TILE_INDEX_OFFSET = 4096
const TILE_INDEX_STRIDE = 8192

const indexOf = (tx: number, ty: number) => (ty + TILE_INDEX_OFFSET) * TILE_INDEX_STRIDE + (tx + TILE_INDEX_OFFSET)
const txOf = (index: number) => (index % TILE_INDEX_STRIDE) - TILE_INDEX_OFFSET
const tyOf = (index: number) => Math.floor(index / TILE_INDEX_STRIDE) - TILE_INDEX_OFFSET

type TileBox = {
    minTx: number
    minTy: number
    maxTx: number
    maxTy: number
}

/**
 * What one level says about the visibility of the terrain tiles, the level's own source of truth at runtime.
 *
 * A tile holds a VisibilityType reference, not an object of its own: one Lua table per painted tile would cost far
 * more than the reference for nothing. A tile nothing was painted on simply has no entry, which is what "untouched"
 * means - so painting "untouched" deletes rather than stores.
 *
 * The serialized form is not the tiles but the rectangles they partition into, grouped by type: far smaller, and the
 * compositor wants rectangles anyway.
 */
export class VisibilityTileArray {
    private types: { [index: number]: VisibilityType | undefined } = {}
    private nbTiles = 0

    private box: TileBox = { minTx: 0, minTy: 0, maxTx: -1, maxTy: -1 }
    /** Deletions can only ever leave the box too wide, which costs a wider sweep but never a wrong result */
    private boxDirty = false

    isEmpty = () => this.nbTiles === 0

    count = () => this.nbTiles

    get = (tx: number, ty: number): VisibilityType | null => this.types[indexOf(tx, ty)] ?? null

    /**
     * Paints one tile and gives back what was there before, which is what the make actions need to undo a stroke.
     * Painting an "untouched" type erases the tile.
     */
    set = (tx: number, ty: number, visibilityType: VisibilityType): VisibilityType | null => {
        const index = indexOf(tx, ty)
        const previous = this.types[index] ?? null

        if (visibilityType.isUntouched()) {
            if (previous !== null) {
                delete this.types[index]
                this.nbTiles--
                this.boxDirty = true
            }

            return previous
        }

        if (previous === null) {
            this.nbTiles++
            this.growBox(tx, ty)
        }

        this.types[index] = visibilityType

        return previous
    }

    /**
     * Paints a tile only if nothing is there yet. This is how the compositor stacks the levels: it walks them from
     * the highest active one down, so the first type to claim a tile is the one that wins.
     */
    setIfAbsent = (tx: number, ty: number, visibilityType: VisibilityType) => {
        const index = indexOf(tx, ty)

        if (this.types[index] !== undefined || visibilityType.isUntouched()) {
            return
        }

        this.types[index] = visibilityType
        this.nbTiles++
        this.growBox(tx, ty)
    }

    /**
     * Walks every painted tile. pairs again: a tile index appears once and only once here, so a caller that treats
     * each tile on its own - which is all any caller does - cannot depend on the order they arrive in.
     */
    forEachTile = (cb: (tx: number, ty: number, visibilityType: VisibilityType) => void) => {
        for (const [index, visibilityType] of pairs(this.types)) {
            cb(txOf(index), tyOf(index), visibilityType)
        }
    }

    setRect = (tx1: number, ty1: number, tx2: number, ty2: number, visibilityType: VisibilityType) => {
        const fromTx = tx1 < tx2 ? tx1 : tx2
        const toTx = tx1 < tx2 ? tx2 : tx1
        const fromTy = ty1 < ty2 ? ty1 : ty2
        const toTy = ty1 < ty2 ? ty2 : ty1

        for (let ty = fromTy; ty <= toTy; ty++) {
            for (let tx = fromTx; tx <= toTx; tx++) {
                this.set(tx, ty, visibilityType)
            }
        }
    }

    clear = () => {
        this.types = {}
        this.nbTiles = 0
        this.box = { minTx: 0, minTy: 0, maxTx: -1, maxTy: -1 }
        this.boxDirty = false
    }

    countByType = (visibilityType: VisibilityType) => {
        let n = 0

        // pairs is safe here and in the walks below: a count, a min/max and a set of deletions are all the same
        // whatever order the tiles come in. Nothing that feeds the partition depends on this order.
        for (const [_, type] of pairs(this.types)) {
            if (type === visibilityType) {
                n++
            }
        }

        return n
    }

    /** Used by "-delvt <label> --force", which has to take the tiles of a deleted type away from every level */
    removeAllOfType = (visibilityType: VisibilityType) => {
        let removed = 0

        for (const [index, type] of pairs(this.types)) {
            if (type === visibilityType) {
                delete this.types[index]
                removed++
            }
        }

        if (removed > 0) {
            this.nbTiles -= removed
            this.boxDirty = true
        }

        return removed
    }

    getBox = (): TileBox | null => {
        if (this.nbTiles === 0) {
            return null
        }

        this.refreshBox()

        return this.box
    }

    /**
     * One box per visibility type id, so each type's partition sweeps its own tiles rather than the whole level.
     * Indexed by VisibilityType.id, holes included.
     */
    collectBoxes = (): (TileBox | null)[] => {
        const boxes: (TileBox | null)[] = []

        for (let id = 0; id < getUdgVisibilityTypes().getIdLimit(); id++) {
            boxes[id] = null
        }

        for (const [index, type] of pairs(this.types)) {
            const tx = txOf(index)
            const ty = tyOf(index)
            const box = boxes[type.id]

            if (!box) {
                boxes[type.id] = { minTx: tx, minTy: ty, maxTx: tx, maxTy: ty }
                continue
            }

            if (tx < box.minTx) box.minTx = tx
            if (tx > box.maxTx) box.maxTx = tx
            if (ty < box.minTy) box.minTy = ty
            if (ty > box.maxTy) box.maxTy = ty
        }

        return boxes
    }

    maskFor = (visibilityType: VisibilityType, box: TileBox): TileMask => ({
        minTx: box.minTx,
        minTy: box.minTy,
        maxTx: box.maxTx,
        maxTy: box.maxTy,
        has: (tx: number, ty: number) => this.types[indexOf(tx, ty)] === visibilityType,
    })

    /**
     * Rectangles grouped by type, in tile coordinates. The groups come out in visibility type id order, so the same
     * level always serializes the same way.
     */
    toJson = () => {
        const output = MemoryHandler.getEmptyArray()

        if (this.nbTiles === 0) {
            return output
        }

        const visibilityTypes = getUdgVisibilityTypes()
        const boxes = this.collectBoxes()

        for (let id = 0; id < visibilityTypes.getIdLimit(); id++) {
            const visibilityType = visibilityTypes.get(id)
            const box = boxes[id]

            if (!visibilityType || !box) {
                continue
            }

            const rects = partitionTiles(this.maskFor(visibilityType, box))

            if (rects.length === 0) {
                continue
            }

            const rectsJson = MemoryHandler.getEmptyArray()

            for (const rect of rects) {
                arrayPush(rectsJson, [rect.tx1, rect.ty1, rect.tx2, rect.ty2])
            }

            const group = MemoryHandler.getEmptyObject<any>()
            group['type'] = visibilityType.label
            group['rects'] = rectsJson

            arrayPush(output, group)
        }

        return output
    }

    newFromJson = (tilesJson: { [x: string]: any }[]) => {
        for (const group of tilesJson) {
            const visibilityType = getUdgVisibilityTypes().getByLabel(group.type)

            if (!visibilityType) {
                log(`VisibilityTileArray: unknown visibility type "${group.type}", its tiles are dropped`)
                continue
            }

            // The annotation is not cosmetic: typescript-to-lua only shifts an index to Lua's 1 based tables when
            // it knows the value is an array. Read straight off the "any" the json decoder gives, rect[0] would stay
            // rect[0] in Lua and come back nil.
            const rects: number[][] = group.rects

            for (const rect of rects) {
                this.setRect(rect[0], rect[1], rect[2], rect[3], visibilityType)
            }
        }
    }

    destroy = () => {
        this.clear()
    }

    private growBox = (tx: number, ty: number) => {
        if (this.nbTiles === 1) {
            this.box = { minTx: tx, minTy: ty, maxTx: tx, maxTy: ty }
            this.boxDirty = false
            return
        }

        if (tx < this.box.minTx) this.box.minTx = tx
        if (tx > this.box.maxTx) this.box.maxTx = tx
        if (ty < this.box.minTy) this.box.minTy = ty
        if (ty > this.box.maxTy) this.box.maxTy = ty
    }

    private refreshBox = () => {
        if (!this.boxDirty) {
            return
        }

        let first = true

        for (const [index, _] of pairs(this.types)) {
            const tx = txOf(index)
            const ty = tyOf(index)

            if (first) {
                this.box = { minTx: tx, minTy: ty, maxTx: tx, maxTy: ty }
                first = false
                continue
            }

            if (tx < this.box.minTx) this.box.minTx = tx
            if (tx > this.box.maxTx) this.box.maxTx = tx
            if (ty < this.box.minTy) this.box.minTy = ty
            if (ty > this.box.maxTy) this.box.maxTy = ty
        }

        this.boxDirty = false
    }
}
