import { MECRegion } from './MECRegion'
import { arrayPush, Round32 } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'

export class HorizontalRegion extends MECRegion {
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super()

        this.minX = Round32(RMinBJ(x1, x2))
        this.maxX = Round32(RMaxBJ(x1, x2))
        this.minY = Round32(RMinBJ(y1, y2))
        this.maxY = Round32(RMaxBJ(y1, y2))

        const rect = Rect(this.minX, this.minY, this.maxX, this.maxY)
        this.defineRects([rect])

        print(`HorizontalRegion created with coords: (${this.minX}, ${this.minY}), (${this.maxX}, ${this.maxY})`)
        print(`Generate rect: ${GetRectMinX(rect)}, ${GetRectMinY(rect)}, ${GetRectMaxX(rect)}, ${GetRectMaxY(rect)}`)
    }

    areCoordsInRegion(x: number, y: number) {
        const roundedX = Round32(x)
        const roundedY = Round32(y)
        return roundedX >= this.minX && roundedX <= this.maxX && roundedY >= this.minY && roundedY <= this.maxY
    }

    generateDebugLightnings(): lightning[] {
        const lightnings: lightning[] = []

        arrayPush(lightnings, DrawLine(this.minX, this.minY, this.minX, this.maxY))
        arrayPush(lightnings, DrawLine(this.minX, this.maxY, this.maxX, this.maxY))
        arrayPush(lightnings, DrawLine(this.maxX, this.maxY, this.maxX, this.minY))
        arrayPush(lightnings, DrawLine(this.maxX, this.minY, this.minX, this.minY))

        return lightnings
    }
}
