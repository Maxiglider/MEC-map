import { RectangleRegion } from './RectangleRegion'

const LINE_REGION_WIDTH = 32

export class LineRegion extends RectangleRegion {
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
    }
}
