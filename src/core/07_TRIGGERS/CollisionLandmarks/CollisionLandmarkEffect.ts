import { getUdgEscapers } from '../../../../globals'
import { Constants } from '../../01_libraries/Constants'
import { Natives } from '../../wc3_natives_unsecured/Natives'

/** Whether any player shows the collision landmarks: the same answer on every machine, set by -debugCollisions */
export const isAnyoneDisplayingCollisionLandmarks = () => {
    let displayed = false
    getUdgEscapers().forMainEscapers(escaper => {
        if (escaper.getDisplayCollisionLandmarks()) {
            displayed = true
        }
    })
    return displayed
}

/** Whether the player of this machine shows the collision landmarks: a local answer, which must decide nothing synced */
export const isLocallyDisplayingCollisionLandmarks = () => {
    return getUdgEscapers().get(GetPlayerId(Natives.UGetLocalPlayer()))?.getDisplayCollisionLandmarks() ?? false
}

/**
 * A landmark of this radius at (x, y), or nothing while no player shows the landmarks: an effect per unit that nobody
 * sees would still be drawn in every game.
 *
 * Whether it is made is decided the same way on every machine, since a handle made on some machines only desyncs
 * the game. Only its model is local: an empty path where the player does not show them, so that machine has nothing
 * to draw - an effect with a null alpha may still weigh on the rendering. Hence a landmark is made again whenever a player switches
 * -debugCollisions.
 */
export const createCollisionLandmark = (x: number, y: number, radius: number): effect | undefined => {
    if (!isAnyoneDisplayingCollisionLandmarks()) {
        return undefined
    }

    const model = isLocallyDisplayingCollisionLandmarks() ? Constants.COLLISION_LANDMARK_MODEL : ''
    const landmark = AddSpecialEffect(model, x, y)
    if (!landmark) {
        throw new Error("Couldn't create collision landmark effect")
    }
    BlzSetSpecialEffectScale(landmark, radius / Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS)

    return landmark
}

/** How far below its unit a landmark of this radius stands, so that its circle lies at the unit's feet */
export const collisionLandmarkZOffset = (radius: number) =>
    (Constants.COLLISION_LANDMARK_MODEL_BASE_HEIGHT * radius) / Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS

export const destroyCollisionLandmark = (landmark: effect) => {
    // hidden first: an effect does not visually disappear the instant it is destroyed
    BlzSetSpecialEffectScale(landmark, 0)
    DestroyEffect(landmark)
}
