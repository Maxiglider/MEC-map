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
 *
 * Keyed by the registration number of the unit (udg_spawned_monster_units), never by its handle id. Lua recycles
 * handle ids at the pace of each machine's garbage collector: a caster shot removed and a new one fired in the
 * same tick could take the old one's id on one machine only, which then kept the old landmark while the others
 * destroyed it and made a new one - an effect made on some machines only, and the game desynced a few seconds
 * after -debc 1 (Slide Is Magic, 2026-09-22). A registration number is given on every machine alike, and a
 * recycled unit gets a new one.
 */
const landmarks: { [spawnedMonsterId: number]: effect } = {}

const scaleOf = (radius: number) => radius / Constants.COLLISION_LANDMARK_MODEL_BASE_RADIUS

const drop = (spawnedMonsterId: number) => {
    const landmark = landmarks[spawnedMonsterId]
    if (!landmark) {
        return
    }
    // hidden first: an effect does not visually disappear the instant it is destroyed
    BlzSetSpecialEffectScale(landmark, 0)
    DestroyEffect(landmark)
    delete landmarks[spawnedMonsterId]
}

export const destroySpawnedCollisionLandmarks = () => {
    for (const [spawnedMonsterId, _] of pairs(landmarks)) {
        drop(spawnedMonsterId)
    }
}

export const moveSpawnedCollisionLandmarks = () => {
    const localEscaper = getUdgEscapers().get(GetPlayerId(Natives.UGetLocalPlayer()))
    const displayed = localEscaper?.getDisplayCollisionLandmarks() ?? false

    // the ones whose unit is gone: its number is cleared the moment it is unregistered or recycled
    for (const [spawnedMonsterId, _] of pairs(landmarks)) {
        if (!udg_spawned_monster_units[spawnedMonsterId]) {
            drop(spawnedMonsterId)
        }
    }

    for (const [spawnedMonsterId, spawnedUnit] of pairs(udg_spawned_monster_units)) {
        if (!spawnedUnit) {
            continue
        }

        // a lookup of this unit on this machine, which decides nothing by itself
        const radius = udg_spawned_monsters[GetHandleId(spawnedUnit)]?.getImmolationRadius() ?? 0

        // a unit removed or hidden since takes no more contact, and shows no landmark either
        if (GetUnitTypeId(spawnedUnit) === 0 || IsUnitHidden(spawnedUnit) || radius <= 0) {
            drop(spawnedMonsterId)
            continue
        }

        let landmark = landmarks[spawnedMonsterId]

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
            landmarks[spawnedMonsterId] = landmark
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
