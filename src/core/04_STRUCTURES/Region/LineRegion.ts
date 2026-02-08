import { RectangleRegion } from './RectangleRegion'
import {
    END_POINT_OFFSET_AFTER_END_OF_REGION,
    OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT,
    StartAndEndPoints,
} from './MECRegion'
import { IDestroyable, MemoryHandler } from '../../../Utils/MemoryHandler'
import { MonsterSpawn } from '../MonsterSpawn/MonsterSpawn'

const LINE_REGION_WIDTH = 32

export class LineRegion extends RectangleRegion {
    private originalX1: number
    private originalY1: number
    private originalX2: number
    private originalY2: number

    private startAndEndPoints: StartAndEndPoints & IDestroyable

    constructor(x1: number, y1: number, x2: number, y2: number, withEnterAndLeaveZone = false) {
        const directionAngle = Rad2Deg(Math.atan2(y2 - y1, x2 - x1))

        const diagX1offsetAngle = directionAngle + 90
        const diagX1offsetX = Math.cos(Deg2Rad(diagX1offsetAngle)) * (LINE_REGION_WIDTH / 2)
        const diagX1offsetY = Math.sin(Deg2Rad(diagX1offsetAngle)) * (LINE_REGION_WIDTH / 2)

        const diagX1 = x1 + diagX1offsetX
        const diagY1 = y1 + diagX1offsetY
        const diagX2 = x1 - diagX1offsetX
        const diagY2 = y1 - diagX1offsetY
        const diagX3 = x2
        const diagY3 = y2

        super(diagX1, diagY1, diagX2, diagY2, diagX3, diagY3, withEnterAndLeaveZone)

        // End point has to be outside of the region
        const endX = x2 + Math.cos(Deg2Rad(directionAngle)) * END_POINT_OFFSET_AFTER_END_OF_REGION
        const endY = y2 + Math.sin(Deg2Rad(directionAngle)) * END_POINT_OFFSET_AFTER_END_OF_REGION

        this.startAndEndPoints = MemoryHandler.getEmptyObject<StartAndEndPoints>()
        this.startAndEndPoints.startX =
            x1 + OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * Math.cos(Deg2Rad(directionAngle))
        this.startAndEndPoints.startY =
            y1 + OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT * Math.sin(Deg2Rad(directionAngle))
        this.startAndEndPoints.endX = endX
        this.startAndEndPoints.endY = endY
        this.startAndEndPoints.ephemeral = false

        this.originalX1 = x1
        this.originalY1 = y1
        this.originalX2 = x2
        this.originalY2 = y2
    }

    generateStartAndEndPoints(monsterSpawn?: MonsterSpawn) {
        const forcedDistance = monsterSpawn?.getForcedDistance()
        if (forcedDistance === undefined) {
            return this.startAndEndPoints
        } else {
            const startAndEndPoints = MemoryHandler.getEmptyObject<StartAndEndPoints>()
            startAndEndPoints.startX = this.startAndEndPoints.startX
            startAndEndPoints.startY = this.startAndEndPoints.startY
            startAndEndPoints.endX = this.startAndEndPoints.startX + this.directionAngleCos * forcedDistance
            startAndEndPoints.endY = this.startAndEndPoints.startY + this.directionAngleSine * forcedDistance
            startAndEndPoints.ephemeral = true
            return startAndEndPoints
        }
    }

    destroy() {
        MemoryHandler.destroyObject(this.startAndEndPoints)
        super.destroy()
    }

    toJson() {
        const output = MemoryHandler.getEmptyObject<any>()

        output.type = this.constructor.name
        output.originalX1 = R2I(this.originalX1)
        output.originalY1 = R2I(this.originalY1)
        output.originalX2 = R2I(this.originalX2)
        output.originalY2 = R2I(this.originalY2)

        return output
    }
}
