import { Natives } from '../../wc3_natives_unsecured/Natives'
import { tileToWorldMax, tileToWorldMin } from './TileCoordinates'
import { VisibilityType } from './VisibilityType'

/**
 * One rectangle of the compositor's output, and the single fog modifier that carries it.
 *
 * Always FOG_OF_WAR_VISIBLE: the world bounds black mask is permanently on, so hiding an area is not a modifier of
 * its own but the absence of one. A periodic zone is the same modifier, started and stopped by its type's timer.
 */
export class VisibilityZone {
    readonly tx1: number
    readonly ty1: number
    readonly tx2: number
    readonly ty2: number
    readonly visibilityType: VisibilityType

    private fm: fogmodifier
    private started = false

    constructor(tx1: number, ty1: number, tx2: number, ty2: number, visibilityType: VisibilityType) {
        this.tx1 = tx1
        this.ty1 = ty1
        this.tx2 = tx2
        this.ty2 = ty2
        this.visibilityType = visibilityType

        const rect = Rect(tileToWorldMin(tx1), tileToWorldMin(ty1), tileToWorldMax(tx2), tileToWorldMax(ty2))

        this.fm = Natives.UCreateFogModifierRect(Natives.UPlayer(0), FOG_OF_WAR_VISIBLE, rect, true, false)

        RemoveRect(rect)
    }

    activate = (active: boolean) => {
        if (this.started === active) {
            return
        }

        if (active) {
            FogModifierStart(this.fm)
        } else {
            FogModifierStop(this.fm)
        }

        this.started = active
    }

    isActive = () => this.started

    destroy = () => {
        DestroyFogModifier(this.fm)
    }
}
