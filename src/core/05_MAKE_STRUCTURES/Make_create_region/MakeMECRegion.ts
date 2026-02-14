import { MakeBySeveralClicks } from '../Make/MakeBySeveralClicks'
import { MECRegion } from '../../04_STRUCTURES/Region/MECRegion'
import { HorizontalRegionDirection } from '../../04_STRUCTURES/Region/HorizontalRegion'
import { Text } from '../../01_libraries/Text'
import { CircleRegion } from '../../04_STRUCTURES/Region/CircleRegion'
import { LineRegion } from '../../04_STRUCTURES/Region/LineRegion'
import { ServiceManager } from '../../../Services'

export type MakeMECRegionMode = 'horizontal' | 'diagonal' | 'circle' | 'line'

export abstract class MakeMECRegion extends MakeBySeveralClicks {
    protected mode: MakeMECRegionMode
    protected requiredLocsNumber: number
    private directionForHorizontal: HorizontalRegionDirection

    constructor(maker: unit, mode: MakeMECRegionMode, directionForHorizontal: HorizontalRegionDirection = 'up') {
        super(maker, 'mecRegionCreate')

        this.mode = mode
        this.requiredLocsNumber = this.mode === 'diagonal' ? 3 : 2
        this.directionForHorizontal = directionForHorizontal
    }

    doActions = () => {
        if (super.doBaseActions()) {
            this.saveLoc(this.orderX, this.orderY)

            if (this.currentMakingLocIndex === this.requiredLocsNumber - 1) {
                const mecRegionService = ServiceManager.getService('MECRegionService')

                let mecRegion: MECRegion

                if (this.mode === 'horizontal') {
                    mecRegion = mecRegionService.newHorizontalRegionBackupToLine(
                        this.savedX[0],
                        this.savedY[0],
                        this.savedX[1],
                        this.savedY[1],
                        this.directionForHorizontal
                    )
                } else if (this.mode === 'diagonal') {
                    mecRegion = mecRegionService.newRectangleRegionBackupToLine(
                        this.savedX[0],
                        this.savedY[0],
                        this.savedX[1],
                        this.savedY[1],
                        this.savedX[2],
                        this.savedY[2]
                    )
                } else if (this.mode === 'circle') {
                    const centerX = this.savedX[0]
                    const centerY = this.savedY[0]
                    const edgeX = this.savedX[1]
                    const edgeY = this.savedY[1]
                    const radius = Math.sqrt((edgeX - centerX) ** 2 + (edgeY - centerY) ** 2)
                    mecRegion = new CircleRegion(centerX, centerY, radius)
                } else if (this.mode === 'line') {
                    mecRegion = new LineRegion(this.savedX[0], this.savedY[0], this.savedX[1], this.savedY[1])
                } else {
                    throw new Error('MakeMECRegion: unknown mode "' + this.mode + '"')
                }

                this.unsaveLocsDefinitely()

                this.onMECRegionCreated(mecRegion)
            }
        }
    }

    /**
     * This function has to be reimplemented in children to do something with the created MEC region
     * @param mecRegion
     */
    onMECRegionCreated(mecRegion: MECRegion) {
        Text.mkP(this.makerOwner, `MEC "${this.mode}" region created and removed (no usage of it done)`)
        mecRegion.destroy()
    }
}
