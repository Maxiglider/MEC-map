import { MECRegion } from './MECRegion'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'

export class DiagonalRegion extends MECRegion {
    private x1: number
    private y1: number
    private x2: number
    private y2: number

    private deltaX2X1: number
    private deltaY2Y1: number
    private points1_2_denominator: number

    private vectorX: number
    private vectorY: number

    constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        super()

        this.deltaX2X1 = x2 - x1
        this.deltaY2Y1 = y2 - y1
        const deltaX3X1 = x3 - x1
        const deltaY3Y1 = y3 - y1

        this.points1_2_denominator = this.deltaX2X1 * this.deltaX2X1 + this.deltaY2Y1 * this.deltaY2Y1
        if (this.points1_2_denominator === 0) {
            // Points 1 and 2 at the same spot
            this.vectorX = deltaX3X1
            this.vectorY = deltaY3Y1
        } else {
            const t = (deltaX3X1 * this.deltaX2X1 + deltaY3Y1 * this.deltaY2Y1) / this.points1_2_denominator
            const Xproj3to1_2 = x1 + t * this.deltaX2X1
            const Yproj3to1_2 = y1 + t * this.deltaY2Y1

            this.vectorX = x3 - Xproj3to1_2
            this.vectorY = y3 - Yproj3to1_2
        }

        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    areCoordsInRegion(x: number, y: number) {
        // Let's say (x, y) is point P
        const deltaPxX1 = x - this.x1
        const deltaPyY1 = y - this.y1

        // Let's find the orthogonal projections of P on lines 1-2
        let PvectorX: number
        let PvectorY: number
        if (this.points1_2_denominator === 0) {
            // Points 1 and 2 at the same spot
            PvectorX = deltaPxX1
            PvectorY = deltaPyY1
        } else {
            const t = (deltaPxX1 * this.deltaX2X1 + deltaPyY1 * this.deltaY2Y1) / this.points1_2_denominator
            if (t < 0 || t > 1) {
                // The projection of P on line 1-2 is outside the segment 1-2, so P is outside the region
                return false
            }

            const XprojPto1_2 = this.x1 + t * this.deltaX2X1
            const YprojPto1_2 = this.y1 + t * this.deltaY2Y1

            PvectorX = x - XprojPto1_2
            PvectorY = y - YprojPto1_2
        }

        // The Pvector must have same direction as the rectangle vector and its length must be smaller or equal
        const deltaVectorX = this.vectorX - PvectorX
        if (deltaVectorX * this.vectorX < 0 || Math.abs(deltaVectorX) > Math.abs(this.vectorX)) {
            return false
        }

        const deltaVectorY = this.vectorY - PvectorY
        if (deltaVectorY * this.vectorY < 0 || Math.abs(deltaVectorY) > Math.abs(this.vectorY)) {
            return false
        }

        return true
    }

    generateDebugLightnings(): lightning[] {
        const lightnings: lightning[] = []

        const x3 = this.x2 + this.vectorX
        const y3 = this.y2 + this.vectorY
        const x4 = this.x1 + this.vectorX
        const y4 = this.y1 + this.vectorY

        arrayPush(lightnings, DrawLine(this.x1, this.y1, this.x2, this.y2))
        arrayPush(lightnings, DrawLine(this.x2, this.y2, x3, y3))
        arrayPush(lightnings, DrawLine(x3, y3, x4, y4))
        arrayPush(lightnings, DrawLine(x4, y4, this.x1, this.y1))

        return lightnings
    }
}
