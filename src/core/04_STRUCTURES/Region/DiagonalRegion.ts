import { MECRegion } from './MECRegion'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'

export class DiagonalRegion extends MECRegion {
    private x1: number
    private y1: number
    private x2: number
    private y2: number

    private vectorX: number
    private vectorY: number
    private vectorLength: number

    private dist1_2: number
    private dist1_3: number
    private dist2_3: number

    constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        super()

        // Caclulate the vector from line points1-points2 towards direction of point3
        this.dist1_2 = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
        this.dist1_3 = Math.sqrt((x3 - x1) ** 2 + (y3 - y1) ** 2)
        this.dist2_3 = Math.sqrt((x3 - x2) ** 2 + (y3 - y2) ** 2)

        const cosAngle1 =
            (this.dist1_2 ** 2 + this.dist1_3 ** 2 - this.dist2_3 ** 2) / (2 * this.dist1_2 * this.dist1_3)

        const dist1_X = cosAngle1 * this.dist1_3

        const xX = x1 + (dist1_X * (x2 - x1)) / this.dist1_2
        const yX = y1 + (dist1_X * (y2 - y1)) / this.dist1_2

        this.vectorX = x3 - xX
        this.vectorY = y3 - yX
        this.vectorLength = Math.sqrt(this.vectorX ** 2 + this.vectorY ** 2)

        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
    }

    areCoordsInRegion(x: number, y: number) {
        // Let's say (x, y) is point P
        const dist1_P = Math.sqrt((x - this.x1) ** 2 + (y - this.y1) ** 2)
        const dist2_P = Math.sqrt((x - this.x2) ** 2 + (y - this.y2) ** 2)
        const dist4_P = Math.sqrt((x - (this.x1 + this.vectorX)) ** 2 + (y - (this.y1 + this.vectorY)) ** 2)

        const angleP_1_2 = Rad2Deg(
            Acos((dist1_P ** 2 + this.dist1_2 ** 2 - dist2_P ** 2) / (2 * dist1_P * this.dist1_2))
        )
        if (angleP_1_2 > 90) {
            return false
        }

        const angleP_1_4 = Rad2Deg(
            Acos((dist1_P ** 2 + this.vectorLength ** 2 - dist4_P ** 2) / (2 * dist1_P * this.vectorLength))
        )
        if (angleP_1_4 > 90) {
            return false
        }

        // Pon12 is the projection of point P on line 1-2
        const dist_Pon12_P = SinBJ(angleP_1_2) * dist1_P

        // If the distance from P to its projection on line 1-2 is greater than the distance from point3 to line 1-2, then P is outside the region
        if (dist_Pon12_P > this.vectorLength) {
            return false
        }

        // Pon14 is the projection of point P on line 1-4
        const dist_Pon14_P = SinBJ(angleP_1_4) * dist1_P

        // If the distance from P to its projection on line 1-4 is greater than the vector length, then P is outside the region
        if (dist_Pon14_P > this.dist1_2) {
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
