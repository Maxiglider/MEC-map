import {
    END_POINT_OFFSET_AFTER_END_OF_REGION,
    MECRegion,
    OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT,
    StartAndEndPoints,
} from './MECRegion'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'
import { MemoryHandler } from '../../../Utils/MemoryHandler'

function dot(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * x2 + y1 * y2
}

export class RectangleRegion extends MECRegion {
    private x1: number
    private y1: number
    private x2: number
    private y2: number

    private x1forStartLine: number
    private y1forStartLine: number
    private x2forStartLine: number
    private y2forStartLine: number
    private deltaX2X1forStartLine: number
    private deltaY2Y1forStartLine: number

    private deltaX2X1: number
    private deltaY2Y1: number
    private points1_2_denominator: number

    private vectorX: number
    private vectorY: number

    private vectorXforEndPoint: number
    private vectorYforEndPoint: number

    protected directionAngleCos: number
    protected directionAngleSine: number

    private deltaP4X1: number = 0
    private deltaP4Y1: number = 0
    private dotP1P2: number = 0
    private dotP4: number = 0

    constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, withEnterAndLeaveZone = false) {
        super(withEnterAndLeaveZone)

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

        const vectorLength = Math.sqrt(this.vectorX * this.vectorX + this.vectorY * this.vectorY)

        this.vectorXforEndPoint = (this.vectorX * (vectorLength + END_POINT_OFFSET_AFTER_END_OF_REGION)) / vectorLength
        this.vectorYforEndPoint = (this.vectorY * (vectorLength + END_POINT_OFFSET_AFTER_END_OF_REGION)) / vectorLength

        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2

        const dist1_2 = Math.sqrt(this.points1_2_denominator)

        // start line reduced a little for edge spawn monsters not to instantly disapear because of considered out of the region
        this.x1forStartLine =
            x1 + (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaX2X1) / dist1_2
        this.y1forStartLine =
            y1 + (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaY2Y1) / dist1_2
        this.x2forStartLine =
            x2 - (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaX2X1) / dist1_2
        this.y2forStartLine =
            y2 - (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaY2Y1) / dist1_2

        // start line moved a little towards the end line for edge spawn monsters not to instantly disapear because of considered out of the region
        this.x1forStartLine =
            this.x1forStartLine +
            (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.vectorX) / vectorLength
        this.y1forStartLine =
            this.y1forStartLine +
            (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.vectorY) / vectorLength
        this.x2forStartLine =
            this.x2forStartLine +
            (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.vectorX) / vectorLength
        this.y2forStartLine =
            this.y2forStartLine +
            (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.vectorY) / vectorLength

        this.deltaX2X1forStartLine = this.x2forStartLine - this.x1forStartLine
        this.deltaY2Y1forStartLine = this.y2forStartLine - this.y1forStartLine

        const directionAngle = Math.atan2(this.vectorY, this.vectorX)
        this.directionAngleCos = Math.cos(directionAngle)
        this.directionAngleSine = Math.sin(directionAngle)

        this.areCoordsInRegionPreCalculation()
    }

    /**
     * Pre-calculations for areCoordsInRegion best performance
     */
    private areCoordsInRegionPreCalculation() {
        const P4x = this.x1 + this.vectorX
        const P4y = this.y1 + this.vectorY

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

        this.defineDebugLineTypeForStart()
        arrayPush(lightnings, DrawLine(this.x1, this.y1, this.x2, this.y2))

        this.defineDebugLineType()
        arrayPush(lightnings, DrawLine(this.x2, this.y2, x3, y3))
        arrayPush(lightnings, DrawLine(x4, y4, this.x1, this.y1))

        if (this.isLeaveZoneEnabled) {
            this.defineDebugLineTypeForEnd()
            arrayPush(lightnings, DrawLine(x3, y3, x4, y4))
        }

        return lightnings
    }

    generateStartAndEndPoints(forcedDistance?: number) {
        const startAndEndPoints = MemoryHandler.getEmptyObject<StartAndEndPoints>()

        const randomOffsetValue = GetRandomReal(0, 1)

        startAndEndPoints.startX = this.x1forStartLine + randomOffsetValue * this.deltaX2X1forStartLine
        startAndEndPoints.startY = this.y1forStartLine + randomOffsetValue * this.deltaY2Y1forStartLine

        if (forcedDistance === undefined) {
            startAndEndPoints.endX = startAndEndPoints.startX + this.vectorXforEndPoint
            startAndEndPoints.endY = startAndEndPoints.startY + this.vectorYforEndPoint
        } else {
            startAndEndPoints.endX = startAndEndPoints.startX + this.directionAngleCos * forcedDistance
            startAndEndPoints.endY = startAndEndPoints.startY + this.directionAngleSine * forcedDistance
        }

        startAndEndPoints.ephemeral = true

        return startAndEndPoints
    }
}
