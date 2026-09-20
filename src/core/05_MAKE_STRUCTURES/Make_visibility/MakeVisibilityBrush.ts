import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgLevels, getUdgVisibilityTypes } from '../../../../globals'
import { outOfBounds, roundCoordinateToCenterOfTile } from '../../01_libraries/Basic_functions'
import { Constants } from '../../01_libraries/Constants'
import { Escaper } from '../../04_STRUCTURES/Escaper/Escaper'
import { worldToTile } from '../../04_STRUCTURES/Visibility/TileCoordinates'
import { VisibilityType } from '../../04_STRUCTURES/Visibility/VisibilityType'
import { BrushShape, isInBrushShape } from '../Make/BrushShape'
import { MakeHoldClick } from '../Make/MakeHoldClick'
import { ChangingVisibilityTile, MakeVisibilityTileAction } from '../MakeLastActions/MakeVisibilityTileAction'
import { paintVisibilityTile } from './paintVisibilityTiles'

/**
 * Paints a visibility type by holding the mouse down, as -crt does with a terrain. Right button paints the type,
 * left button erases - the gum, here always the "untouched" type.
 *
 * The fog is recomposed once, when the button is released, not on every mouse move: EVENT_PLAYER_MOUSE_MOVE fires
 * with no throttle at all (MIN_TIME_BETWEEN_ACTIONS is null in MakeHoldClick), and a full recomposition on each of
 * those would stall. One per stroke is imperceptible.
 */
export class MakeVisibilityBrush extends MakeHoldClick {
    private visibilityType: VisibilityType
    private shape: BrushShape
    private changes?: ChangingVisibilityTile[]

    constructor(escaper: Escaper, visibilityType: VisibilityType, brushSize: number, shape: BrushShape = 'square') {
        super(escaper, 'visibilityCreateBrush', true)

        this.visibilityType = visibilityType
        this.shape = shape

        escaper.setBrushSize(brushSize)
    }

    doMouseMoveActions() {
        if (!super.doMouseMoveActions()) {
            return false
        }

        let visibilityTypeToApply: VisibilityType | null = null
        let shapeToApply: BrushShape = 'square'

        if (this.activeBtn == MOUSE_BUTTON_TYPE_RIGHT) {
            visibilityTypeToApply = this.visibilityType
            shapeToApply = this.shape
        } else if (this.activeBtn == MOUSE_BUTTON_TYPE_LEFT) {
            visibilityTypeToApply = getUdgVisibilityTypes().getUntouched()
        }

        if (!visibilityTypeToApply || !this.changes) {
            return true
        }

        const level = this.escaper.getMakingLevel()
        const sizeToApply = this.escaper.getBrushSize()
        const centerX = roundCoordinateToCenterOfTile(this.escaper.mouseX)
        const centerY = roundCoordinateToCenterOfTile(this.escaper.mouseY)
        const offset = (sizeToApply - 1) * Constants.LARGEUR_CASE

        for (let x = centerX - offset; x <= centerX + offset; x += Constants.LARGEUR_CASE) {
            for (let y = centerY - offset; y <= centerY + offset; y += Constants.LARGEUR_CASE) {
                if (outOfBounds(x, y)) {
                    continue
                }

                if (!isInBrushShape(shapeToApply, x, y, centerX, centerY, offset, sizeToApply)) {
                    continue
                }

                paintVisibilityTile(level, worldToTile(x), worldToTile(y), visibilityTypeToApply, this.changes)
            }
        }

        return true
    }

    doPressActions() {
        this.changes = MemoryHandler.getEmptyArray()

        super.doPressActions()
    }

    doUnpressActions() {
        super.doUnpressActions()

        if (this.changes && this.changes.length > 0) {
            this.escaper.newAction(new MakeVisibilityTileAction(this.escaper.getMakingLevel(), this.changes))
            getUdgLevels().refreshVisibilities()
        }

        this.changes && MemoryHandler.destroyArray(this.changes)
        delete this.changes
    }

    destroy() {
        super.destroy()
    }
}
