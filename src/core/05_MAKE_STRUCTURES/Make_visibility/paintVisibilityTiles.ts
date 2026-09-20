import { arrayPush } from '../../01_libraries/Basic_functions'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { VisibilityType } from '../../04_STRUCTURES/Visibility/VisibilityType'
import { ChangingVisibilityTile } from '../MakeLastActions/MakeVisibilityTileAction'

/**
 * Paints one tile and records what was there, for the undo. Records nothing when the tile already holds that type:
 * a brush passing over the same tile twice must not pile up changes that all say the same thing.
 */
export const paintVisibilityTile = (
    level: Level,
    tx: number,
    ty: number,
    visibilityType: VisibilityType,
    changes: ChangingVisibilityTile[]
) => {
    const before = level.visibilityTiles.get(tx, ty)

    if (before === visibilityType || (before === null && visibilityType.isUntouched())) {
        return
    }

    level.visibilityTiles.set(tx, ty, visibilityType)

    arrayPush(changes, { tx, ty, before, after: visibilityType })
}
