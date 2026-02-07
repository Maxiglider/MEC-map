import { MakeBySeveralClicks } from '../Make/MakeBySeveralClicks'
import { MECRegion } from '../../04_STRUCTURES/Region/MECRegion'
import { HorizontalRegion, HorizontalRegionDirection } from '../../04_STRUCTURES/Region/HorizontalRegion'
import { Text } from '../../01_libraries/Text'
import { RectangleRegion } from '../../04_STRUCTURES/Region/RectangleRegion'
import { CircleRegion } from '../../04_STRUCTURES/Region/CircleRegion'

export type MakeMECRegionMode = 'horizontal' | 'diagonal' | 'circle'

export class MakeMECRegion extends MakeBySeveralClicks {
    private mode: MakeMECRegionMode
    private requiredLocsNumber: number
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
                let mecRegion: MECRegion

                try {
                    if (this.mode === 'horizontal') {
                        mecRegion = new HorizontalRegion(
                            this.savedX[0],
                            this.savedY[0],
                            this.savedX[1],
                            this.savedY[1],
                            this.directionForHorizontal,
                            true
                        )
                    } else if (this.mode === 'diagonal') {
                        mecRegion = new RectangleRegion(
                            this.savedX[0],
                            this.savedY[0],
                            this.savedX[1],
                            this.savedY[1],
                            this.savedX[2],
                            this.savedY[2],
                            true
                        )
                    } else if (this.mode === 'circle') {
                        const centerX = this.savedX[0]
                        const centerY = this.savedY[0]
                        const edgeX = this.savedX[1]
                        const edgeY = this.savedY[1]
                        const radius = Math.sqrt((edgeX - centerX) ** 2 + (edgeY - centerY) ** 2)
                        mecRegion = new CircleRegion(centerX, centerY, radius)
                    } else {
                        throw new Error('MakeMECRegion: unknown mode "' + this.mode + '"')
                    }

                    mecRegion.debugRects(true)
                } catch (e: any) {
                    Text.mkP(this.makerOwner, `Error creating MEC region: ${e.message}`)
                    return
                }

                mecRegion.onUnitEnters(unit => {
                    SetUnitColor(unit, PLAYER_COLOR_BLUE)
                })
                mecRegion.onUnitLeaves(unit => {
                    SetUnitColor(unit, PLAYER_COLOR_RED)
                })

                this.maker && mecRegion.watchUnit(this.maker)

                Text.mkP(this.makerOwner, `MEC "${this.mode}" region created`)
                this.unsaveLocsDefinitely()
            }
        }
    }
}
