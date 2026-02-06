import { MECRegion } from './MECRegion'
import { Constants } from '../../01_libraries/Constants'

export class CircleRegion extends MECRegion {
    private centerX: number
    private centerY: number
    private radius: number
    private radiusSquare: number

    constructor(centerX: number, centerY: number, radius: number) {
        super()

        this.centerX = centerX
        this.centerY = centerY
        this.radius = radius
        this.radiusSquare = radius * radius
    }

    areCoordsInRegion(x: number, y: number) {
        const dx = x - this.centerX
        const dy = y - this.centerY
        return dx * dx + dy * dy <= this.radiusSquare
    }

    generateDebugEffects(): effect[] {
        const z =
            -(Constants.COLLISION_LANDMARK_MODEL_BASE_HEIGHT * this.radius) /
            Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS

        const circleEffect = AddSpecialEffect(Constants.COLLISION_LANDMARK_MODEL, this.centerX, this.centerY)
        if (!circleEffect) {
            throw new Error("Couldn't create region circle effect")
        }
        BlzSetSpecialEffectPosition(circleEffect, this.centerX, this.centerY, z)
        const scale = this.radius / Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS
        BlzSetSpecialEffectScale(circleEffect, scale)

        return [circleEffect]
    }
}
