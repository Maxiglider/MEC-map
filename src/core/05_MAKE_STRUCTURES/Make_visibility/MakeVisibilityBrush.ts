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

/** How often the fog is allowed to follow the brush, in seconds */
const REFRESH_PERIOD = 0.3

/** Long enough that no stroke outlives it, the timer only being read for its elapsed time */
const STROKE_TIMER_DURATION = 3600

/**
 * Paints a visibility type by holding the mouse down, as -crt does with a terrain. Right button paints the type,
 * left button erases - the gum, here always the "untouched" type.
 *
 * The fog follows the brush, but at a bounded rate rather than on every mouse move: EVENT_PLAYER_MOUSE_MOVE fires
 * with no throttle at all (MIN_TIME_BETWEEN_ACTIONS is null in MakeHoldClick), and a full recomposition on each of
 * those would stall. Ten times a second is imperceptible on the cost side and live on the eye's side, and the
 * release recomposes once more so the last tiles of a stroke are never left out.
 *
 * The elapsed time comes from a Warcraft III timer, not from os.clock(): a local clock would have the machines of a
 * same game recompose a different number of times, and their fog modifier handle ids drift apart. What this does
 * rely on - as the terrain brush already does - is the mouse events themselves reaching every machine alike.
 */
export class MakeVisibilityBrush extends MakeHoldClick {
    private visibilityType: VisibilityType
    private shape: BrushShape
    private changes?: ChangingVisibilityTile[]

    private strokeTimer?: timer
    private lastRefreshAt = 0
    private nbChangesAtLastRefresh = 0

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

        this.refreshIfDue()

        return true
    }

    doPressActions() {
        this.changes = MemoryHandler.getEmptyArray()

        this.strokeTimer = CreateTimer()
        TimerStart(this.strokeTimer, STROKE_TIMER_DURATION, false, DoNothing)
        this.lastRefreshAt = 0
        this.nbChangesAtLastRefresh = 0

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

        this.destroyStrokeTimer()
    }

    destroy() {
        super.destroy()

        this.destroyStrokeTimer()
    }

    /** Lets the fog catch up with the brush, at most every REFRESH_PERIOD and only if new tiles were painted */
    private refreshIfDue = () => {
        if (!this.changes || !this.strokeTimer || this.changes.length === this.nbChangesAtLastRefresh) {
            return
        }

        const elapsed = TimerGetElapsed(this.strokeTimer)

        if (elapsed - this.lastRefreshAt < REFRESH_PERIOD) {
            return
        }

        this.lastRefreshAt = elapsed
        this.nbChangesAtLastRefresh = this.changes.length

        getUdgLevels().refreshVisibilities()
    }

    private destroyStrokeTimer = () => {
        if (this.strokeTimer) {
            DestroyTimer(this.strokeTimer)
            delete this.strokeTimer
        }
    }
}
