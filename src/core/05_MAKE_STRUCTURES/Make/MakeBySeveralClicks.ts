import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { LandmarkForMake } from './LandmarkForMake'

export abstract class MakeBySeveralClicks extends Make {
    protected savedX: number[] = []
    protected savedY: number[] = []
    protected currentMakingLocIndex = -1

    private landmarkForMake?: LandmarkForMake

    constructor(maker: unit, kind: string, forSpecificLevel = true) {
        super(maker, kind, forSpecificLevel)
    }

    saveLoc = (x: number, y: number) => {
        this.currentMakingLocIndex++

        this.savedX[this.currentMakingLocIndex] = x
        this.savedY[this.currentMakingLocIndex] = y

        // Remove next saved locs cancelled with ctrl + Z before this saveLoc
        this.savedX.length = this.currentMakingLocIndex + 1
        this.savedY.length = this.currentMakingLocIndex + 1

        if (this.landmarkForMake) {
            this.landmarkForMake.move(x, y)
        } else {
            this.landmarkForMake = new LandmarkForMake(this.escaper, x, y)
        }

        this.escaper.destroyCancelledActions()
    }

    unsaveLoc = () => {
        if (this.currentMakingLocIndex < 0) {
            return false
        }

        this.currentMakingLocIndex--

        if (this.currentMakingLocIndex >= 0) {
            this.landmarkForMake &&
                this.landmarkForMake.move(
                    this.savedX[this.currentMakingLocIndex],
                    this.savedY[this.currentMakingLocIndex]
                )
        } else {
            this.landmarkForMake && this.landmarkForMake.destroy()
            delete this.landmarkForMake
        }

        return true
    }

    unsaveLocsDefinitely = () => {
        this.savedX.length = 0
        this.savedY.length = 0
        this.currentMakingLocIndex = -1
        this.landmarkForMake && this.landmarkForMake.destroy()
        delete this.landmarkForMake
    }

    cancelLastAction = () => {
        return this.unsaveLoc()
    }

    redoLastAction = () => {
        if (this.currentMakingLocIndex < this.savedX.length - 1) {
            this.currentMakingLocIndex++
            if (this.landmarkForMake) {
                this.landmarkForMake.move(
                    this.savedX[this.currentMakingLocIndex],
                    this.savedY[this.currentMakingLocIndex]
                )
            } else {
                this.landmarkForMake = new LandmarkForMake(
                    this.escaper,
                    this.savedX[this.currentMakingLocIndex],
                    this.savedY[this.currentMakingLocIndex]
                )
            }
            return true
        }
        return false
    }

    destroy = () => {
        super.destroy()

        this.landmarkForMake && this.landmarkForMake.destroy()
        delete this.landmarkForMake
    }
}
