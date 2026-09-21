import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgLevels, getUdgVisibilityTypes } from '../../../../globals'
import { Text } from '../../01_libraries/Text'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { VisibilityType } from '../../04_STRUCTURES/Visibility/VisibilityType'
import { MakeAction } from './MakeAction'

/** `before` is null where the tile held nothing, which is what "untouched" is: no entry at all */
export type ChangingVisibilityTile = {
    tx: number
    ty: number
    before: VisibilityType | null
    after: VisibilityType
}

/**
 * Undo and redo of a visibility stroke, whether it came from two clicks or from a brush.
 *
 * It remembers the previous type of each tile one by one, unlike the old MakeVisibilityModifierAction which only had
 * one rectangle object to put back: a stroke paints over whatever was already there, tile by tile, and only the
 * per-tile record can restore that.
 */
export class MakeVisibilityTileAction extends MakeAction {
    private changes: ChangingVisibilityTile[]

    constructor(level: Level, changes: ChangingVisibilityTile[]) {
        super(level)

        this.changes = MemoryHandler.cloneArray(changes)
    }

    destroy = () => {
        MemoryHandler.destroyArray(this.changes)
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }

        this.applyChanges(false)
        this.isActionMadeB = false
        this.owner && Text.mkP(this.owner.getPlayer(), 'visibility painting cancelled')

        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }

        this.applyChanges(true)
        this.isActionMadeB = true
        this.owner && Text.mkP(this.owner.getPlayer(), 'visibility painting redone')

        return true
    }

    private applyChanges = (redo: boolean) => {
        if (!this.level) {
            return
        }

        const untouched = getUdgVisibilityTypes().getUntouched()

        for (const change of this.changes) {
            const visibilityType = redo ? change.after : change.before

            this.level.visibilityTiles.set(change.tx, change.ty, visibilityType || untouched)
        }

        getUdgLevels().refreshVisibilities()
    }
}
