import { RectangleRegion } from './RectangleRegion'

export type HorizontalRegionDirection = 'up' | 'down' | 'left' | 'right'

export class HorizontalRegion extends RectangleRegion {
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    constructor(
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        direction: HorizontalRegionDirection = 'up',
        withEnterAndLeaveZone = false
    ) {
        const minX = Math.min(x1, x2)
        const maxX = Math.max(x1, x2)
        const minY = Math.min(y1, y2)
        const maxY = Math.max(y1, y2)

        let diagX1 = 0
        let diagY1 = 0
        let diagX2 = 0
        let diagY2 = 0
        let diagX3 = 0
        let diagY3 = 0

        switch (direction) {
            case 'right':
                diagX1 = minX
                diagY1 = minY
                diagX2 = minX
                diagY2 = maxY
                diagX3 = maxX
                diagY3 = maxY
                break
            case 'left':
                diagX1 = maxX
                diagY1 = minY
                diagX2 = maxX
                diagY2 = maxY
                diagX3 = minX
                diagY3 = maxY
                break
            case 'up':
                diagX1 = minX
                diagY1 = minY
                diagX2 = maxX
                diagY2 = minY
                diagX3 = maxX
                diagY3 = maxY
                break
            case 'down':
                diagX1 = minX
                diagY1 = maxY
                diagX2 = maxX
                diagY2 = maxY
                diagX3 = maxX
                diagY3 = minY
                break
        }

        super(diagX1, diagY1, diagX2, diagY2, diagX3, diagY3, withEnterAndLeaveZone)

        this.minX = minX
        this.maxX = maxX
        this.minY = minY
        this.maxY = maxY
    }

    areCoordsInRegion(x: number, y: number) {
        return x >= this.minX && x <= this.maxX && y >= this.minY && y <= this.maxY
    }
}
