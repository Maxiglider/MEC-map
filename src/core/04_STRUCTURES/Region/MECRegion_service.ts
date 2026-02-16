import { HorizontalRectangleRegion, HorizontalRegionDirection } from './HorizontalRectangleRegion'
import { LineRegion } from './LineRegion'
import { MECZoneWidthTooSmallError, ParallelogramRegion } from './ParallelogramRegion'
import { RectangleRegion } from './RectangleRegion'

export const init_MECRegion_service = () => {
    return {
        newLineRegion: (x1: number, y1: number, x2: number, y2: number) => {
            return new LineRegion(x1, y1, x2, y2)
        },
        newParallelogramRegionBackupToLine: (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            x3: number,
            y3: number
        ) => {
            let mecRegion: RectangleRegion | LineRegion
            try {
                mecRegion = new ParallelogramRegion(x1, y1, x2, y2, x3, y3)
            } catch (e: any) {
                if (e instanceof MECZoneWidthTooSmallError) {
                    mecRegion = e.getBackupLineRegion()
                } else {
                    throw e
                }
            }
            return mecRegion
        },
        newRectangleRegionBackupToLine: (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
            let mecRegion: RectangleRegion | LineRegion
            try {
                mecRegion = new RectangleRegion(x1, y1, x2, y2, x3, y3)
            } catch (e: any) {
                if (e instanceof MECZoneWidthTooSmallError) {
                    mecRegion = e.getBackupLineRegion()
                } else {
                    throw e
                }
            }
            return mecRegion
        },
        newHorizontalRegionBackupToLine: (
            x1: number,
            y1: number,
            x2: number,
            y2: number,
            direction: HorizontalRegionDirection = 'up'
        ) => {
            let mecRegion: HorizontalRectangleRegion | LineRegion
            try {
                mecRegion = new HorizontalRectangleRegion(x1, y1, x2, y2, direction)
            } catch (e: any) {
                if (e instanceof MECZoneWidthTooSmallError) {
                    mecRegion = e.getBackupLineRegion()
                } else {
                    throw e
                }
            }
            return mecRegion
        },
    }
}

export type IMECRegionService = ReturnType<typeof init_MECRegion_service>
