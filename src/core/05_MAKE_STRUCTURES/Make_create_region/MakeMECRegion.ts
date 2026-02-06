import { MakeBySeveralClicks } from '../Make/MakeBySeveralClicks'
import { MECRegion } from '../../04_STRUCTURES/Region/MECRegion'
import { HorizontalRegion } from '../../04_STRUCTURES/Region/HorizontalRegion'
import { Text } from '../../01_libraries/Text'
import { DiagonalRegion } from '../../04_STRUCTURES/Region/DiagonalRegion'
import { CircleRegion } from '../../04_STRUCTURES/Region/CircleRegion'

export type MakeMECRegionMode = 'horizontal' | 'diagonal' | 'circle'

export class MakeMECRegion extends MakeBySeveralClicks {
    private mode: MakeMECRegionMode
    private requiredLocsNumber: number

    constructor(maker: unit, mode: MakeMECRegionMode) {
        super(maker, 'mecRegionCreate')

        this.mode = mode
        this.requiredLocsNumber = this.mode === 'diagonal' ? 3 : 2
    }

    doActions = () => {
        if (super.doBaseActions()) {
            this.saveLoc(this.orderX, this.orderY)

            if (this.currentMakingLocIndex === this.requiredLocsNumber - 1) {
                let mecRegion: MECRegion
                if (this.mode === 'horizontal') {
                    mecRegion = new HorizontalRegion(this.savedX[0], this.savedY[0], this.savedX[1], this.savedY[1])
                } else if (this.mode === 'diagonal') {
                    mecRegion = new DiagonalRegion(
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
                } else {
                    throw new Error('MakeMECRegion: unknown mode "' + this.mode + '"')
                }

                mecRegion.debugRects(true)

                mecRegion.onUnitEnters(unit => {
                    // print(`Unit ${GetUnitName(unit)} (${GetHandleId(unit)}) entered MEC region`)
                    SetUnitColor(unit, PLAYER_COLOR_BLUE)
                })
                mecRegion.onUnitLeaves(unit => {
                    // print(`Unit ${GetUnitName(unit)} (${GetHandleId(unit)}) left MEC region`)
                    SetUnitColor(unit, PLAYER_COLOR_RED)
                })

                this.maker && mecRegion.watchUnit(this.maker)

                Text.mkP(this.makerOwner, `MEC "${this.mode}" region created`)
                this.unsaveLocsDefinitely()
            }
        }
    }
}
