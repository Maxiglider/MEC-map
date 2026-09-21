import { getUdgEscapers, udg_spawned_monster_units, udg_spawned_monsters } from '../../../../globals'
import { GetUnitZEx } from '../../../Utils/LocationUtils'
import { Constants } from '../../01_libraries/Constants'
import { Natives } from '../../wc3_natives_unsecured/Natives'

/**
 * The collision landmarks of the units that have no Monster of their own: what a monster spawn puts on the map and
 * what a caster shoots.
 *
 * A level's monsters each carry their landmark (Monster.refreshCollisionLandmark), but a spawned unit is only a
 * unit and its monster type, registered side by side in udg_spawned_monsters - so nothing held a landmark for it,
 * and -debugCollisions showed nothing around a caster's projectile or a spawn's monsters, the very ones whose
 * reach is hardest to judge by eye.
 *
 * They are built and dropped here, from the same walk that moves the others, since a spawned unit appears and goes
 * without telling anyone. As for a monster, the effect is created on every machine and only its alpha is local:
 * a handle made on one machine and not on another is what desyncs a game.
 */
const landmarks: { [handleId: number]: effect } = {}

const scaleOf = (radius: number) => radius / Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS

const drop = (handleId: number) => {
    const landmark = landmarks[handleId]
    if (!landmark) {
        return
    }
    // hidden first: an effect does not visually disappear the instant it is destroyed
    BlzSetSpecialEffectScale(landmark, 0)
    DestroyEffect(landmark)
    delete landmarks[handleId]
}

export const destroySpawnedCollisionLandmarks = () => {
    for (const [handleId, _] of pairs(landmarks)) {
        drop(handleId)
    }
}

/**
 * Walked by handle id and by registration number, both of which only ever decide what a landmark is built for -
 * never what the game does - so the order they come in does not matter here.
 */
export const moveSpawnedCollisionLandmarks = () => {
    const localEscaper = getUdgEscapers().get(GetPlayerId(Natives.UGetLocalPlayer()))
    const displayed = localEscaper?.getDisplayCollisionLandmarks() ?? false

    // the ones whose unit is gone: a spawned unit is unregistered the moment it is removed
    for (const [handleId, _] of pairs(landmarks)) {
        if (!udg_spawned_monsters[handleId]) {
            drop(handleId)
        }
    }

    for (const [_, spawnedUnit] of pairs(udg_spawned_monster_units)) {
        if (!spawnedUnit) {
            continue
        }

        const handleId = GetHandleId(spawnedUnit)
        const radius = udg_spawned_monsters[handleId]?.getImmolationRadius() ?? 0

        // a unit removed or hidden since takes no more contact, and shows no landmark either
        if (GetUnitTypeId(spawnedUnit) === 0 || IsUnitHidden(spawnedUnit) || radius <= 0) {
            drop(handleId)
            continue
        }

        let landmark = landmarks[handleId]

        if (!landmark) {
            const created = AddSpecialEffect(
                Constants.COLLISION_LANDMARK_MODEL,
                GetUnitX(spawnedUnit),
                GetUnitY(spawnedUnit)
            )
            if (!created) {
                continue
            }
            landmark = created
            BlzSetSpecialEffectScale(landmark, scaleOf(radius))
            landmarks[handleId] = landmark
        }

        BlzSetSpecialEffectAlpha(landmark, displayed ? 255 : 0)
        BlzSetSpecialEffectPosition(
            landmark,
            GetUnitX(spawnedUnit),
            GetUnitY(spawnedUnit),
            GetUnitZEx(spawnedUnit) - Constants.COLLISION_LANDMARK_MODEL_BASE_HEIGHT * scaleOf(radius)
        )
    }
}
