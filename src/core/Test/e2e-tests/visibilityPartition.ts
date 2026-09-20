import { arrayPush } from '../../01_libraries/Basic_functions'
import { Text } from '../../01_libraries/Text'
import { TileMask, TileRect, partitionTiles } from '../../04_STRUCTURES/Visibility/VisibilityPartition'
import { E2EAction, E2ETest } from './base/e2e-tests-base'

/**
 * The partition is the one piece of the visibility system that can be asserted without a game around it: it is a pure
 * function over a set of tiles. Every expected count below is the minimum the Lipski/Ohtsuki bound gives, so a
 * regression that merely produces a valid but larger partition is caught too - and that matters, since an excess
 * rectangle is an excess fog modifier.
 *
 * "H shape" is the telling one: a greedy row merge gives 5 rectangles there, the minimum is 3.
 */

type PartitionCase = {
    name: string
    /** Bottom row first, 'X' for a tile in the mask */
    rows: string[]
    expected: number
}

const cases: PartitionCase[] = [
    { name: 'single rectangle', rows: ['XXX', 'XXX'], expected: 1 },
    { name: 'two disjoint rectangles', rows: ['XX.XX', 'XX.XX'], expected: 2 },
    { name: 'L shape', rows: ['X..', 'X..', 'XXX'], expected: 2 },
    { name: 'T shape', rows: ['XXX', '.X.', '.X.'], expected: 2 },
    { name: 'plus', rows: ['.X.', 'XXX', '.X.'], expected: 3 },
    { name: 'H shape', rows: ['X.X', 'XXX', 'X.X'], expected: 3 },
    { name: 'comb, 3 teeth', rows: ['X.X.X', 'XXXXX', 'X.X.X'], expected: 5 },
    { name: 'frame with a hole', rows: ['XXXX', 'X..X', 'X..X', 'XXXX'], expected: 4 },
    { name: 'staircase, 3 steps', rows: ['X..', 'XX.', 'XXX'], expected: 3 },
    { name: 'pinwheel', rows: ['XXX.', '..X.', '.XXX', '.X..'], expected: 4 },
    { name: 'tiles touching by a corner only', rows: ['X.', '.X'], expected: 2 },
    { name: 'single tile', rows: ['X'], expected: 1 },
]

const maskFromRows = (rows: string[]): TileMask => {
    const height = rows.length
    const width = rows[0].length
    const cells: { [index: number]: boolean } = {}

    for (let row = 0; row < height; row++) {
        for (let column = 0; column < width; column++) {
            if (rows[row].substring(column, column + 1) === 'X') {
                cells[row * width + column] = true
            }
        }
    }

    return {
        minTx: 0,
        minTy: 0,
        maxTx: width - 1,
        maxTy: height - 1,
        has: (tx, ty) => tx >= 0 && ty >= 0 && tx < width && ty < height && cells[ty * width + tx] === true,
    }
}

/** The count alone proves nothing: the rectangles must also cover the mask exactly, with no overlap and no hole */
const checkCoverage = (mask: TileMask, rects: TileRect[]): string | null => {
    const covered: { [index: number]: number } = {}
    const width = mask.maxTx - mask.minTx + 1

    for (const rect of rects) {
        if (rect.tx1 > rect.tx2 || rect.ty1 > rect.ty2) {
            return 'inverted rectangle'
        }

        for (let ty = rect.ty1; ty <= rect.ty2; ty++) {
            for (let tx = rect.tx1; tx <= rect.tx2; tx++) {
                if (!mask.has(tx, ty)) {
                    return `a rectangle covers the empty tile ${tx},${ty}`
                }

                const index = ty * width + tx
                covered[index] = (covered[index] || 0) + 1

                if (covered[index] > 1) {
                    return `the tile ${tx},${ty} is covered twice`
                }
            }
        }
    }

    for (let ty = mask.minTy; ty <= mask.maxTy; ty++) {
        for (let tx = mask.minTx; tx <= mask.maxTx; tx++) {
            if (mask.has(tx, ty) && !covered[ty * width + tx]) {
                return `the tile ${tx},${ty} is not covered`
            }
        }
    }

    return null
}

const partitionActions: E2EAction[] = [
    {
        function: () => {
            const failures: string[] = []

            for (const testCase of cases) {
                const mask = maskFromRows(testCase.rows)
                const rects = partitionTiles(mask)
                const problem = checkCoverage(mask, rects)

                if (problem) {
                    arrayPush(failures, `${testCase.name}: ${problem}`)
                } else if (rects.length !== testCase.expected) {
                    arrayPush(failures, `${testCase.name}: ${rects.length} rectangles, expected ${testCase.expected}`)
                }
            }

            // Same input twice must give the same rectangles in the same order, or the machines of a same game would
            // not create the same fog modifiers - see the desync warning in VisibilityPartition.ts
            const stabilityMask = maskFromRows(['XXXXX.XX', 'X...X.XX', 'X.X.X..X', 'X...X..X', 'XXXXX.XX'])
            const first = partitionTiles(stabilityMask)
            const second = partitionTiles(stabilityMask)

            if (first.length !== second.length) {
                arrayPush(failures, 'two runs on the same mask gave a different number of rectangles')
            } else {
                for (let i = 0; i < first.length; i++) {
                    if (
                        first[i].tx1 !== second[i].tx1 ||
                        first[i].ty1 !== second[i].ty1 ||
                        first[i].tx2 !== second[i].tx2 ||
                        first[i].ty2 !== second[i].ty2
                    ) {
                        arrayPush(failures, `two runs on the same mask disagree on the rectangle number ${i + 1}`)
                        break
                    }
                }
            }

            if (failures.length === 0) {
                Text.mkA_timed(-1, `\nVisibility partition: the ${cases.length} cases pass, and the result is stable`)
                return
            }

            Text.erA_timed(-1, `\nVisibility partition: ${failures.length} failure(s)`)

            for (const failure of failures) {
                Text.erA_timed(-1, failure)
            }
        },
    },
]

export const visibilityPartition: E2ETest = {
    shortName: 'visibilityPartition',
    name: 'Minimal partition of a set of tiles into rectangles',
    actions: partitionActions,
}
