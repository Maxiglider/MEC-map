import { ServiceManager } from '../../../Services'
import { MemoryHandler } from '../../../Utils/MemoryHandler'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DrawLine } from '../../01_libraries/Draw_lines'
import { MonsterSpawn } from '../MonsterSpawn/MonsterSpawn'
import { LineRegion } from './LineRegion'
import {
    END_POINT_OFFSET_AFTER_END_OF_REGION,
    MECRegion,
    OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT,
    StartAndEndPoints,
} from './MECRegion'

function dot(x1: number, y1: number, x2: number, y2: number): number {
    return x1 * x2 + y1 * y2
}

const RECTANGLE_REGION_MINIMUM_SIZE = 31 // LINE_REGION_WIDTH is 32 but because of float imprecision we need to set it a bit lower than 32

function GetTriangleArea(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number): number {
    return Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2)
}

export class MECZoneWidthTooSmallError extends Error {
    private readonly backupLineRegion: LineRegion
    constructor(message: string, lineRegion: LineRegion) {
        super(message)
        this.backupLineRegion = lineRegion
    }

    getBackupLineRegion() {
        return this.backupLineRegion
    }
}

export class ParallelogramRegion extends MECRegion {
    private x1: number
    private y1: number
    private x2: number
    private y2: number
    private x3: number
    private y3: number
    private x4: number = 0
    private y4: number = 0

    private x1forStartLine: number = 0
    private y1forStartLine: number = 0
    private x2forStartLine: number = 0
    private y2forStartLine: number = 0
    private deltaX2X1forStartLine: number = 0
    private deltaY2Y1forStartLine: number = 0
    private startLineLength: number = 0

    private deltaX2X1: number = 0
    private deltaY2Y1: number = 0
    private points1_2_denominator: number = 0

    private vectorX: number = 0
    private vectorY: number = 0

    private vectorXforEndPoint: number = 0
    private vectorYforEndPoint: number = 0

    private endLineX1: number = 0
    private endLineY1: number = 0
    private endLineX2: number = 0
    private endLineY2: number = 0
    private endLineDeltaX: number = 0
    private endLineDeltaY: number = 0

    protected directionAngleCos: number = 0
    protected directionAngleSine: number = 0

    private area: number = 0

    constructor(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        super()

        this.x1 = x1
        this.y1 = y1
        this.x2 = x2
        this.y2 = y2
        this.x3 = x3
        this.y3 = y3

        this.redefineZone()
    }

    redefineZone() {
        this.deltaX2X1 = this.x2 - this.x1
        this.deltaY2Y1 = this.y2 - this.y1

        this.points1_2_denominator = this.deltaX2X1 * this.deltaX2X1 + this.deltaY2Y1 * this.deltaY2Y1

        // Make sure the region has a minimal width, or fallbacks to a line region
        const zoneWidth = Math.sqrt(this.deltaX2X1 * this.deltaX2X1 + this.deltaY2Y1 * this.deltaY2Y1)
        if (zoneWidth < RECTANGLE_REGION_MINIMUM_SIZE) {
            const middleX2X1 = (this.x1 + this.x2) / 2
            const middleY2Y1 = (this.y1 + this.y2) / 2
            const backupLineRegion = ServiceManager.getService('MECRegionService').newLineRegion(
                middleX2X1,
                middleY2Y1,
                this.x3,
                this.y3
            )

            throw new MECZoneWidthTooSmallError(
                `ParallelogramRegion: The width of the zone region is too small (width: ${zoneWidth}, minimum: ${RECTANGLE_REGION_MINIMUM_SIZE}) ; use LineRegion instead`,
                backupLineRegion
            )
        }

        this.vectorX = this.x3 - this.x1
        this.vectorY = this.y3 - this.y1
        this.x4 = this.x2 + this.vectorX
        this.y4 = this.y2 + this.vectorY

        // Make sure the Region has a minimal length
        let vectorLength = Math.sqrt(this.vectorX * this.vectorX + this.vectorY * this.vectorY)
        if (vectorLength < 1) {
            vectorLength = RECTANGLE_REGION_MINIMUM_SIZE
            const angle = Rad2Deg(Math.atan2(this.deltaY2Y1, this.deltaX2X1)) + 90
            this.vectorX = Math.cos(Deg2Rad(angle)) * vectorLength
            this.vectorY = Math.sin(Deg2Rad(angle)) * vectorLength
        } else if (vectorLength < RECTANGLE_REGION_MINIMUM_SIZE) {
            this.vectorX = (this.vectorX * RECTANGLE_REGION_MINIMUM_SIZE) / vectorLength
            this.vectorY = (this.vectorY * RECTANGLE_REGION_MINIMUM_SIZE) / vectorLength
            vectorLength = RECTANGLE_REGION_MINIMUM_SIZE
        }

        this.vectorXforEndPoint = (this.vectorX * (vectorLength + END_POINT_OFFSET_AFTER_END_OF_REGION)) / vectorLength
        this.vectorYforEndPoint = (this.vectorY * (vectorLength + END_POINT_OFFSET_AFTER_END_OF_REGION)) / vectorLength

        this.endLineX1 = this.x1 + this.vectorXforEndPoint
        this.endLineY1 = this.y1 + this.vectorYforEndPoint
        this.endLineX2 = this.x2 + this.vectorXforEndPoint
        this.endLineY2 = this.y2 + this.vectorYforEndPoint
        this.endLineDeltaX = this.endLineX2 - this.endLineX1
        this.endLineDeltaY = this.endLineY2 - this.endLineY1

        const dist1_2 = Math.sqrt(this.points1_2_denominator)

        // start line reduced a little for edge spawn monsters not to instantly disapear because of considered out of the region
        this.x1forStartLine =
            this.x1 + (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaX2X1) / dist1_2
        this.y1forStartLine =
            this.y1 + (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaY2Y1) / dist1_2
        this.x2forStartLine =
            this.x2 - (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaX2X1) / dist1_2
        this.y2forStartLine =
            this.y2 - (OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * this.deltaY2Y1) / dist1_2

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
        this.startLineLength = Math.sqrt(
            this.deltaX2X1forStartLine * this.deltaX2X1forStartLine +
                this.deltaY2Y1forStartLine * this.deltaY2Y1forStartLine
        )

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
        const xCenter = this.getCenterX()
        const yCenter = this.getCenterY()

        this.area =
            GetTriangleArea(this.x1, this.y1, this.x2, this.y2, xCenter, yCenter) +
            GetTriangleArea(this.x2, this.y2, this.x4, this.y4, xCenter, yCenter) +
            GetTriangleArea(this.x4, this.y4, this.x3, this.y3, xCenter, yCenter) +
            GetTriangleArea(this.x3, this.y3, this.x1, this.y1, xCenter, yCenter)
    }

    moveTo(newCenterX: number, newCenterY: number): void {
        const currentCenterX = (this.x1 + this.x2) / 2 + this.vectorX / 2
        const currentCenterY = (this.y1 + this.y2) / 2 + this.vectorY / 2

        const deltaX = newCenterX - currentCenterX
        const deltaY = newCenterY - currentCenterY

        this.x1 += deltaX
        this.y1 += deltaY
        this.x2 += deltaX
        this.y2 += deltaY
        this.x3 += deltaX
        this.y3 += deltaY

        this.redefineZone()

        this.refreshDebuggingRects()
    }

    areCoordsInRegion(x: number, y: number) {
        // Let's say (x, y) is point P
        const areaIfPWouldBeIn =
            GetTriangleArea(this.x1, this.y1, this.x2, this.y2, x, y) +
            GetTriangleArea(this.x2, this.y2, this.x4, this.y4, x, y) +
            GetTriangleArea(this.x4, this.y4, this.x3, this.y3, x, y) +
            GetTriangleArea(this.x3, this.y3, this.x1, this.y1, x, y)

        return Math.abs(areaIfPWouldBeIn - this.area) < 1 // allow some margin of error because of float imprecision
    }

    generateDebugLightnings(): lightning[] {
        const x3 = this.x2 + this.vectorX
        const y3 = this.y2 + this.vectorY
        const x4 = this.x1 + this.vectorX
        const y4 = this.y1 + this.vectorY

        this.defineDebugLineTypeForStart()
        arrayPush(this.debugLightnings, DrawLine(this.x1, this.y1, this.x2, this.y2))

        this.defineDebugLineType()
        arrayPush(this.debugLightnings, DrawLine(this.x2, this.y2, x3, y3))
        arrayPush(this.debugLightnings, DrawLine(x4, y4, this.x1, this.y1))

        if (this.isLeaveZoneEnabled) {
            this.defineDebugLineTypeForEnd()
            arrayPush(this.debugLightnings, DrawLine(x3, y3, x4, y4))
        }

        return this.debugLightnings
    }

    generateStartAndEndPoints(monsterSpawn?: MonsterSpawn) {
        if (monsterSpawn?.getFixedSpawnOffset() !== undefined) {
            return this.generateStartAndEndPointsWithFixedSpawnOffset(monsterSpawn)
        }

        const startAndEndPoints = MemoryHandler.getEmptyObject<StartAndEndPoints>()

        const randomOffsetValue = GetRandomReal(0, 1)

        startAndEndPoints.startX = this.x1forStartLine + randomOffsetValue * this.deltaX2X1forStartLine
        startAndEndPoints.startY = this.y1forStartLine + randomOffsetValue * this.deltaY2Y1forStartLine

        const forcedDistance = monsterSpawn?.getForcedDistance()
        if (forcedDistance === undefined) {
            if (monsterSpawn?.getMonsterDirectionMode() === 'random') {
                const randomReal = GetRandomReal(0, 1)
                startAndEndPoints.endX = this.endLineX1 + randomReal * this.endLineDeltaX
                startAndEndPoints.endY = this.endLineY1 + randomReal * this.endLineDeltaY
            } else {
                startAndEndPoints.endX = startAndEndPoints.startX + this.vectorXforEndPoint
                startAndEndPoints.endY = startAndEndPoints.startY + this.vectorYforEndPoint
            }
        } else {
            let directionAngleCos = this.directionAngleCos
            let directionAngleSine = this.directionAngleSine
            if (monsterSpawn?.getMonsterDirectionMode() === 'random') {
                const randomReal = GetRandomReal(0, 1)
                const baseEndX = this.endLineX1 + randomReal * this.endLineDeltaX
                const baseEndY = this.endLineY1 + randomReal * this.endLineDeltaY
                const directionAngle = Math.atan2(
                    baseEndY - startAndEndPoints.startY,
                    baseEndX - startAndEndPoints.startX
                )
                directionAngleCos = Math.cos(directionAngle)
                directionAngleSine = Math.sin(directionAngle)
            }
            startAndEndPoints.endX = startAndEndPoints.startX + directionAngleCos * forcedDistance
            startAndEndPoints.endY = startAndEndPoints.startY + directionAngleSine * forcedDistance
        }

        startAndEndPoints.ephemeral = true

        return startAndEndPoints
    }

    private generateStartAndEndPointsWithFixedSpawnOffset(monsterSpawn: MonsterSpawn) {
        const spawnVal = this.calcValOffset(monsterSpawn)

        const startAndEndPoints = MemoryHandler.getEmptyObject<StartAndEndPoints>()
        startAndEndPoints.startX = this.x1forStartLine + (spawnVal / this.startLineLength) * this.deltaX2X1forStartLine
        startAndEndPoints.startY = this.y1forStartLine + (spawnVal / this.startLineLength) * this.deltaY2Y1forStartLine

        const forcedDistance = monsterSpawn?.getForcedDistance()
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

    private calcValOffset = (monsterSpawn: MonsterSpawn) => {
        const lastSpawnVal = monsterSpawn.getLastSpawnVal() ?? 0

        const spawnOffset = monsterSpawn.getSpawnOffset()
        const spawnIndex = monsterSpawn.getSpawnIndex()
        const spawnAmount = monsterSpawn.getSpawnAmount()

        let newSpawnVal: number

        if (monsterSpawn.getFixedSpawnOffsetMirrored() && monsterSpawn.getMirrored()) {
            newSpawnVal = this.startLineLength - lastSpawnVal
        } else {
            newSpawnVal = lastSpawnVal
            while (true) {
                const bouncingBefore = monsterSpawn.getBouncing()
                newSpawnVal = this.calculateNextNewSpawnVal(monsterSpawn, newSpawnVal)

                if (
                    !monsterSpawn.getFixedSpawnOffsetBounce() ||
                    bouncingBefore !== monsterSpawn.getBouncing() ||
                    spawnIndex !== 0 ||
                    spawnAmount === 1
                ) {
                    break
                }

                // check if other spawnIndex mobs would be out of the start line
                const spawnValOfLastSpawnIndex =
                    newSpawnVal + spawnOffset * (spawnAmount - 1) * (monsterSpawn.getBouncing() ? -1 : 1)
                if (!this.isSpawnValOutOfBounds(spawnValOfLastSpawnIndex)) {
                    break
                }
            }
        }

        if (monsterSpawn.getFixedSpawnOffsetMirrored()) {
            if ((spawnOffset === 0 || spawnIndex % 2 === 0) && !monsterSpawn.getMirrored()) {
                monsterSpawn.setLastSpawnVal(newSpawnVal)
            }

            monsterSpawn.setMirrored(!monsterSpawn.getMirrored())
        } else if (spawnOffset === 0 || spawnIndex === 0) {
            monsterSpawn.setLastSpawnVal(newSpawnVal)
        }

        return newSpawnVal
    }

    private calculateNextNewSpawnVal(monsterSpawn: MonsterSpawn, lastSpawnVal: number) {
        const fixedSpawnOffset = monsterSpawn.getFixedSpawnOffset()
        if (fixedSpawnOffset === undefined) {
            throw new Error('fixedSpawnOffset is required for RectangleRegion calcValOffset')
        }

        let newSpawnVal
        if (fixedSpawnOffset === 'auto') {
            const spawnAmount = monsterSpawn.getSpawnAmount()

            if (spawnAmount === 1) {
                // One monster, always centered
                newSpawnVal = this.startLineLength / 2
            } else {
                // More than one monster, evenly distibuted on the line, with the first one on the start and the last one on the end
                const distanceBetweenMonsters = this.startLineLength / (spawnAmount - 1)
                newSpawnVal = monsterSpawn.getSpawnIndex() * distanceBetweenMonsters
            }
        } else {
            if (monsterSpawn.getSpawnOffset() === 0 || monsterSpawn.getSpawnIndex() === 0) {
                newSpawnVal = lastSpawnVal + fixedSpawnOffset * (monsterSpawn.getBouncing() ? -1 : 1)
            } else {
                newSpawnVal =
                    lastSpawnVal +
                    monsterSpawn.getSpawnOffset() *
                        monsterSpawn.getSpawnIndex() *
                        (monsterSpawn.getBouncing() ? -1 : 1) *
                        (monsterSpawn.getFixedSpawnOffsetMirrored() ? 0.5 : 1)
            }

            if (this.isSpawnValOutOfBounds(newSpawnVal)) {
                newSpawnVal = this.loopSpawnValToBounds(newSpawnVal, monsterSpawn.getFixedSpawnOffsetBounce())
                if (
                    monsterSpawn.getFixedSpawnOffsetBounce() &&
                    (monsterSpawn.getSpawnOffset() === 0 || monsterSpawn.getSpawnIndex() === 0)
                ) {
                    monsterSpawn.setBouncing(!monsterSpawn.getBouncing())
                }
            }
        }

        return newSpawnVal
    }

    private isSpawnValOutOfBounds(spawnVal: number): boolean {
        return spawnVal > this.startLineLength || spawnVal < 0
    }

    private loopSpawnValToBounds(spawnVal: number, fixedSpawnOffsetBounce = false): number {
        let newSpawnVal = spawnVal
        if (fixedSpawnOffsetBounce) {
            if (newSpawnVal > this.startLineLength) {
                const delta = newSpawnVal - this.startLineLength
                newSpawnVal = Math.max(0, this.startLineLength - delta)
            } else if (newSpawnVal < 0) {
                newSpawnVal = Math.min(this.startLineLength, -newSpawnVal)
            }

            return newSpawnVal
        } else {
            if (newSpawnVal > this.startLineLength) {
                newSpawnVal -= this.startLineLength
            } else if (newSpawnVal < 0) {
                newSpawnVal += this.startLineLength
            } else {
                return newSpawnVal
            }

            return this.loopSpawnValToBounds(newSpawnVal)
        }
    }

    toJson() {
        const output = MemoryHandler.getEmptyObject<any>()

        output.type = this.constructor.name
        output.x1 = R2I(this.x1)
        output.y1 = R2I(this.y1)
        output.x2 = R2I(this.x2)
        output.y2 = R2I(this.y2)
        output.x3 = R2I(this.x3)
        output.y3 = R2I(this.y3)

        return output
    }

    getLength() {
        return Math.round(Math.sqrt(this.vectorX * this.vectorX + this.vectorY * this.vectorY))
    }

    getWidth() {
        return Math.round(Math.sqrt(this.deltaX2X1 * this.deltaX2X1 + this.deltaY2Y1 * this.deltaY2Y1))
    }

    getDirectionAngleDegrees() {
        return Math.round(Rad2Deg(Math.atan2(this.vectorY, this.vectorX)))
    }

    getArea(): number {
        return this.area
    }

    getCenterX(): number {
        return this.x1 + this.deltaX2X1 / 2 + this.vectorX / 2
    }

    getCenterY(): number {
        return this.y1 + this.deltaY2Y1 / 2 + this.vectorY / 2
    }

    toText(detailled = false) {
        const width = this.getWidth()
        const isLine = width <= RECTANGLE_REGION_MINIMUM_SIZE
        return (
            super.toText() +
            (detailled
                ? ': len(' +
                  this.getLength() +
                  ')' +
                  (!isLine ? ' wid(' + width + ')' : '') +
                  ' dir(' +
                  this.getDirectionAngleDegrees() +
                  '°)'
                : '')
        )
    }
}
