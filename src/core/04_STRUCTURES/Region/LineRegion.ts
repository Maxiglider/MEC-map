import { RectangleRegion } from './RectangleRegion'
import {
    END_POINT_OFFSET_AFTER_END_OF_REGION,
    OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT,
    StartAndEndPoints,
} from './MECRegion'
import { IDestroyable, MemoryHandler } from '../../../Utils/MemoryHandler'

const LINE_REGION_WIDTH = 32

export class LineRegion extends RectangleRegion {
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
    }

    generateStartAndEndPoints() {
        return this.startAndEndPoints
    }
}
