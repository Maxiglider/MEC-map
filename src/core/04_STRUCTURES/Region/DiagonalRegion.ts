import { MECRegion } from './MECRegion'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'

function dot(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * x2 + y1 * y2
}

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

    private deltaP4X1: number = 0
    private deltaP4Y1: number = 0
    private dotP1P2: number = 0
    private dotP4: number = 0

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

        this.areCoordsInRegionPreCalculation()
    }

    /**
     * Pre-calculations for areCoordsInRegion best performance
     */
    private areCoordsInRegionPreCalculation() {
        // Height of the rectangle
        let h = Math.sqrt(this.vectorX * this.vectorX + this.vectorY * this.vectorY)
        if (this.deltaX2X1 * this.vectorY - this.deltaY2Y1 * this.vectorX < 0) {
            h = -h
        }

        // Compute P4
        const deltaX2X1 = this.x2 - this.x1
        const deltaY2Y1 = this.y2 - this.y1

        const L = Math.sqrt(deltaX2X1 * deltaX2X1 + deltaY2Y1 * deltaY2Y1)

        const nx = -deltaY2Y1 / L
        const ny = deltaX2X1 / L

        const P4x = this.x1 + h * nx
        const P4y = this.y1 + h * ny

        // Pre-calculate values for areCoordsInRegion
        this.deltaP4X1 = P4x - this.x1
        this.deltaP4Y1 = P4y - this.y1

        this.dotP1P2 = dot(this.deltaX2X1, this.deltaY2Y1, this.deltaX2X1, this.deltaY2Y1)
        this.dotP4 = dot(this.deltaP4X1, this.deltaP4Y1, this.deltaP4X1, this.deltaP4Y1)
    }

    areCoordsInRegion(x: number, y: number) {
        // Let's say (x, y) is point P
        const deltaPxX1 = x - this.x1
        const deltaPyY1 = y - this.y1

        const u = dot(deltaPxX1, deltaPyY1, this.deltaX2X1, this.deltaY2Y1) / this.dotP1P2
        const v = dot(deltaPxX1, deltaPyY1, this.deltaP4X1, this.deltaP4Y1) / this.dotP4

        return u >= 0 && u <= 1 && v >= 0 && v <= 1
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
