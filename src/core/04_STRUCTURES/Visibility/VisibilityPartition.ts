import { arrayPush } from '../../01_libraries/Basic_functions'
import { log } from '../../Log/log'

/** Tile coordinates, both ends included */
export type TileRect = {
    tx1: number
    ty1: number
    tx2: number
    ty2: number
}

/** What the partition reads: a membership test plus the box it is worth scanning */
export type TileMask = {
    minTx: number
    minTy: number
    maxTx: number
    maxTy: number
    has: (tx: number, ty: number) => boolean
}

type Reflex = {
    px: number
    py: number
    /**
     * Where the inner extension of this vertex goes, +1 or -1 along ty. The missing cell being on the py - 1 side
     * means the extension goes towards py, and the other way round.
     */
    dir: number
    used: boolean
}

type Chord = {
    /** Row (horizontal chord) or column (vertical chord) the chord lies on */
    at: number
    from: number
    to: number
    a: Reflex
    b: Reflex
}

/**
 * Minimal partition of a set of tiles into axis-aligned rectangles (Lipski, Ohtsuki).
 *
 * For a rectilinear region the minimum number of rectangles is C - M - T + 1, where C counts the concave vertices,
 * T the holes and M a maximum set of pairwise disjoint "chords" - interior axis-aligned segments joining two concave
 * vertices. Two chords of the same orientation can never share an endpoint (that point would have its four cells
 * filled, so it would not be concave), so their intersection graph is bipartite H x V and a maximum independent set
 * comes out of a maximum matching through Konig's theorem. Cutting along the retained chords, then extending every
 * remaining concave vertex, leaves no concave vertex at all: the pieces are rectangles, and there is no fewer of them.
 *
 * Ported from the proof of concept in the separate wc3-visiblity-modfiers-theory repository.
 *
 * DESYNC WARNING: every machine must compute the very same rectangles, in the very same order - a different but
 * equally valid partition means a different number of CreateFogModifierRect calls and a different handle id sequence
 * (see docs/LUA_PAIRS_AND_MEMORY_HANDLER.md). So nothing here may iterate a table with pairs, and no tie may be
 * broken by anything other than an explicit index order. In particular the reflex vertices are gathered by two
 * ordered sweeps - row major then column major - instead of being grouped into a table and read back.
 */
export const partitionTiles = (mask: TileMask): TileRect[] => {
    const out: TileRect[] = []

    const width = mask.maxTx - mask.minTx + 1
    const height = mask.maxTy - mask.minTy + 1

    if (width <= 0 || height <= 0) {
        return out
    }

    // Sparse, only the filled tiles ever get an entry. undefined means "not visited yet".
    const componentOf: { [index: number]: number | undefined } = {}
    const indexOf = (tx: number, ty: number) => (ty - mask.minTy) * width + (tx - mask.minTx)

    let componentCount = 0

    // Row major, so the components come out in a fixed order whatever the shape
    for (let ty = mask.minTy; ty <= mask.maxTy; ty++) {
        for (let tx = mask.minTx; tx <= mask.maxTx; tx++) {
            if (!mask.has(tx, ty) || componentOf[indexOf(tx, ty)] !== undefined) {
                continue
            }

            componentCount++
            partitionComponent(mask, componentOf, indexOf, componentCount, tx, ty, out)
        }
    }

    return out
}

/**
 * Flood fills one 4-connected component from (startTx, startTy), then partitions it. No rectangle can ever span two
 * components, and each component's own box bounds every sweep below - the whole mask is never rescanned.
 */
const partitionComponent = (
    mask: TileMask,
    componentOf: { [index: number]: number | undefined },
    indexOf: (tx: number, ty: number) => number,
    componentId: number,
    startTx: number,
    startTy: number,
    out: TileRect[]
) => {
    const cellsX: number[] = []
    const cellsY: number[] = []

    let bx1 = startTx
    let bx2 = startTx
    let by1 = startTy
    let by2 = startTy

    componentOf[indexOf(startTx, startTy)] = componentId
    arrayPush(cellsX, startTx)
    arrayPush(cellsY, startTy)

    // Index based walk over the growing lists: no stack object, and a fixed visiting order
    let read = 0

    while (read < cellsX.length) {
        const tx = cellsX[read]
        const ty = cellsY[read]
        read++

        if (tx < bx1) bx1 = tx
        if (tx > bx2) bx2 = tx
        if (ty < by1) by1 = ty
        if (ty > by2) by2 = ty

        const neighboursX = [tx + 1, tx - 1, tx, tx]
        const neighboursY = [ty, ty, ty + 1, ty - 1]

        for (let n = 0; n < 4; n++) {
            const nx = neighboursX[n]
            const ny = neighboursY[n]

            if (nx < mask.minTx || nx > mask.maxTx || ny < mask.minTy || ny > mask.maxTy) {
                continue
            }

            if (!mask.has(nx, ny) || componentOf[indexOf(nx, ny)] !== undefined) {
                continue
            }

            componentOf[indexOf(nx, ny)] = componentId
            arrayPush(cellsX, nx)
            arrayPush(cellsY, ny)
        }
    }

    const inComponent = (tx: number, ty: number) =>
        tx >= bx1 && tx <= bx2 && ty >= by1 && ty <= by2 && componentOf[indexOf(tx, ty)] === componentId

    // --- 1. Concave vertices: 3 of the 4 cells around a grid point are filled.
    //     The degenerate point with 2 opposite cells filled needs nothing: no cut could go through it, the two cells
    //     not being 4-adjacent.
    const reflex: Reflex[] = []
    // Grid point (px, py) -> its 1 based rank in `reflex`. Sparse, membership only, never iterated.
    const reflexAt: { [key: number]: number | undefined } = {}
    const pointStride = bx2 - bx1 + 3
    const pointKey = (px: number, py: number) => (py - by1 + 1) * pointStride + (px - bx1 + 1)

    for (let py = by1; py <= by2 + 1; py++) {
        for (let px = bx1; px <= bx2 + 1; px++) {
            const topLeft = inComponent(px - 1, py - 1)
            const topRight = inComponent(px, py - 1)
            const bottomLeft = inComponent(px - 1, py)
            const bottomRight = inComponent(px, py)

            let filled = 0
            if (topLeft) filled++
            if (topRight) filled++
            if (bottomLeft) filled++
            if (bottomRight) filled++

            if (filled !== 3) {
                continue
            }

            arrayPush(reflex, { px, py, dir: !topLeft || !topRight ? 1 : -1, used: false })
            reflexAt[pointKey(px, py)] = reflex.length
        }
    }

    if (reflex.length === 0) {
        emit(inComponent, cellsX, cellsY, null, null, pointKey, out)
        return
    }

    // --- 2. Chords, between two concave vertices consecutive on a row or on a column.
    //     `reflex` is already sorted by py then px by the sweep above, so the horizontal pairs are read straight from
    //     it; a second, column major sweep gives the vertical ones. No grouping table, hence no iteration order to
    //     depend on.
    const horizontal: Chord[] = []
    const vertical: Chord[] = []

    for (let i = 0; i + 1 < reflex.length; i++) {
        const a = reflex[i]
        const b = reflex[i + 1]

        if (a.py !== b.py) {
            continue
        }

        let inside = true

        for (let x = a.px; x < b.px && inside; x++) {
            inside = inComponent(x, a.py - 1) && inComponent(x, a.py)
        }

        if (inside) {
            arrayPush(horizontal, { at: a.py, from: a.px, to: b.px, a, b })
        }
    }

    let previous: Reflex | null = null

    for (let px = bx1; px <= bx2 + 1; px++) {
        previous = null

        for (let py = by1; py <= by2 + 1; py++) {
            const rank = reflexAt[pointKey(px, py)]

            if (rank === undefined) {
                continue
            }

            const current = reflex[rank - 1]

            if (previous) {
                let inside = true

                for (let y = previous.py; y < current.py && inside; y++) {
                    inside = inComponent(px - 1, y) && inComponent(px, y)
                }

                if (inside) {
                    arrayPush(vertical, { at: px, from: previous.py, to: current.py, a: previous, b: current })
                }
            }

            previous = current
        }
    }

    // --- 3. Maximum independent set of chords: maximum matching, then Konig.
    const adjacency: number[][] = []

    for (let h = 0; h < horizontal.length; h++) {
        const chord = horizontal[h]
        const crossed: number[] = []

        for (let v = 0; v < vertical.length; v++) {
            const other = vertical[v]

            if (chord.from <= other.at && other.at <= chord.to && other.from <= chord.at && chord.at <= other.to) {
                arrayPush(crossed, v)
            }
        }

        arrayPush(adjacency, crossed)
    }

    const matchH: number[] = []
    const matchV: number[] = []
    const seenV: number[] = []

    for (let h = 0; h < horizontal.length; h++) matchH[h] = -1
    for (let v = 0; v < vertical.length; v++) {
        matchV[v] = -1
        seenV[v] = -1
    }

    const augment = (h: number, stamp: number): boolean => {
        const crossed = adjacency[h]

        for (let k = 0; k < crossed.length; k++) {
            const v = crossed[k]

            if (seenV[v] === stamp) {
                continue
            }

            seenV[v] = stamp

            if (matchV[v] === -1 || augment(matchV[v], stamp)) {
                matchV[v] = h
                matchH[h] = v
                return true
            }
        }

        return false
    }

    for (let h = 0; h < horizontal.length; h++) {
        augment(h, h)
    }

    // Z = the vertices an alternating path reaches from an unmatched horizontal chord. The minimum vertex cover is
    // (H \ Z) + (V & Z), so the maximum independent set - what we keep - is its complement.
    const inZH: boolean[] = []
    const inZV: boolean[] = []
    const queue: number[] = []

    for (let h = 0; h < horizontal.length; h++) inZH[h] = false
    for (let v = 0; v < vertical.length; v++) inZV[v] = false

    for (let h = 0; h < horizontal.length; h++) {
        if (matchH[h] === -1) {
            inZH[h] = true
            arrayPush(queue, h)
        }
    }

    let queueRead = 0

    while (queueRead < queue.length) {
        const h = queue[queueRead]
        queueRead++

        const crossed = adjacency[h]

        for (let k = 0; k < crossed.length; k++) {
            const v = crossed[k]

            if (inZV[v]) {
                continue
            }

            inZV[v] = true

            const matched = matchV[v]

            if (matched !== -1 && !inZH[matched]) {
                inZH[matched] = true
                arrayPush(queue, matched)
            }
        }
    }

    // --- 4. Cuts: the retained chords first...
    /** Keyed by (cell x, grid point y): the horizontal cut between the cells (x, y - 1) and (x, y) */
    const cutBelow: { [key: number]: boolean } = {}
    /** Keyed by (grid point x, cell y): the vertical cut between the cells (x - 1, y) and (x, y) */
    const cutLeft: { [key: number]: boolean } = {}

    for (let h = 0; h < horizontal.length; h++) {
        if (!inZH[h]) {
            continue
        }

        const chord = horizontal[h]

        for (let x = chord.from; x < chord.to; x++) {
            cutBelow[pointKey(x, chord.at)] = true
        }

        chord.a.used = true
        chord.b.used = true
    }

    for (let v = 0; v < vertical.length; v++) {
        if (inZV[v]) {
            continue
        }

        const chord = vertical[v]

        for (let y = chord.from; y < chord.to; y++) {
            cutLeft[pointKey(chord.at, y)] = true
        }

        chord.a.used = true
        chord.b.used = true
    }

    // ...then the vertical extension of every concave vertex left, stopped by the border of the component or by a
    // horizontal chord already drawn.
    for (let i = 0; i < reflex.length; i++) {
        const vertex = reflex[i]

        if (vertex.used) {
            continue
        }

        let y = vertex.dir > 0 ? vertex.py : vertex.py - 1

        while (inComponent(vertex.px - 1, y) && inComponent(vertex.px, y)) {
            cutLeft[pointKey(vertex.px, y)] = true

            const crossing = vertex.dir > 0 ? y + 1 : y

            if (cutBelow[pointKey(vertex.px - 1, crossing)] || cutBelow[pointKey(vertex.px, crossing)]) {
                break
            }

            y += vertex.dir
        }
    }

    emit(inComponent, cellsX, cellsY, cutBelow, cutLeft, pointKey, out)
}

/**
 * Labels the pieces the cuts leave behind - every cut blocks adjacency - and turns each one into a rectangle.
 */
const emit = (
    inComponent: (tx: number, ty: number) => boolean,
    cellsX: number[],
    cellsY: number[],
    cutBelow: { [key: number]: boolean } | null,
    cutLeft: { [key: number]: boolean } | null,
    pointKey: (px: number, py: number) => number,
    out: TileRect[]
) => {
    const isCutBelow = (x: number, y: number) => (cutBelow ? cutBelow[pointKey(x, y)] === true : false)
    const isCutLeft = (x: number, y: number) => (cutLeft ? cutLeft[pointKey(x, y)] === true : false)

    const pieceOf: { [key: number]: number | undefined } = {}
    let pieceCount = 0

    // The cells are visited in the order the component's flood fill found them, which is itself fixed
    for (let c = 0; c < cellsX.length; c++) {
        if (pieceOf[pointKey(cellsX[c], cellsY[c])] !== undefined) {
            continue
        }

        pieceCount++

        const pieceX: number[] = []
        const pieceY: number[] = []

        pieceOf[pointKey(cellsX[c], cellsY[c])] = pieceCount
        arrayPush(pieceX, cellsX[c])
        arrayPush(pieceY, cellsY[c])

        let x1 = cellsX[c]
        let x2 = cellsX[c]
        let y1 = cellsY[c]
        let y2 = cellsY[c]

        let read = 0

        while (read < pieceX.length) {
            const tx = pieceX[read]
            const ty = pieceY[read]
            read++

            if (tx < x1) x1 = tx
            if (tx > x2) x2 = tx
            if (ty < y1) y1 = ty
            if (ty > y2) y2 = ty

            const neighboursX = [tx + 1, tx - 1, tx, tx]
            const neighboursY = [ty, ty, ty + 1, ty - 1]
            const open = [!isCutLeft(tx + 1, ty), !isCutLeft(tx, ty), !isCutBelow(tx, ty + 1), !isCutBelow(tx, ty)]

            for (let n = 0; n < 4; n++) {
                if (!open[n]) {
                    continue
                }

                const nx = neighboursX[n]
                const ny = neighboursY[n]

                if (!inComponent(nx, ny) || pieceOf[pointKey(nx, ny)] !== undefined) {
                    continue
                }

                pieceOf[pointKey(nx, ny)] = pieceCount
                arrayPush(pieceX, nx)
                arrayPush(pieceY, ny)
            }
        }

        if (pieceX.length === (x2 - x1 + 1) * (y2 - y1 + 1)) {
            arrayPush(out, { tx1: x1, ty1: y1, tx2: x2, ty2: y2 })
            continue
        }

        // A correct construction leaves no concave vertex, so this never runs. It is kept as a net - producing a few
        // extra fog modifiers beats producing a hole - but it is logged, so a real case can be looked into instead of
        // passing silently.
        log(
            `VisibilityPartition: non rectangular piece of ${pieceX.length} tiles in [${x1},${y1}]-[${x2},${y2}], sliced into rows`
        )

        for (let ty = y1; ty <= y2; ty++) {
            let runStart: number | null = null

            for (let tx = x1; tx <= x2 + 1; tx++) {
                const inPiece = tx <= x2 && pieceOf[pointKey(tx, ty)] === pieceCount

                if (inPiece && runStart === null) {
                    runStart = tx
                } else if (!inPiece && runStart !== null) {
                    arrayPush(out, { tx1: runStart, ty1: ty, tx2: tx - 1, ty2: ty })
                    runStart = null
                }
            }
        }
    }
}
