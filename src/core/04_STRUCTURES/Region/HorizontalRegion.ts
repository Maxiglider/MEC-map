import { MECRegion } from './MECRegion'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'

export class HorizontalRegion extends MECRegion {
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    constructor(x1: number, y1: number, x2: number, y2: number) {
        super()

        this.minX = RMinBJ(x1, x2)
        this.maxX = RMaxBJ(x1, x2)
        this.minY = RMinBJ(y1, y2)
        this.maxY = RMaxBJ(y1, y2)

        print(`HorizontalRegion created with coords: (${this.minX}, ${this.minY}), (${this.maxX}, ${this.maxY})`)
    }

    areCoordsInRegion(x: number, y: number) {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
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
