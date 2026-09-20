import { arrayPush } from '../../01_libraries/Basic_functions'
import { TileRect } from './VisibilityPartition'
import { VisibilityType } from './VisibilityType'
import { VisibilityZone } from './VisibilityZone'

export type ZoneRequest = {
    rect: TileRect
    visibilityType: VisibilityType
}

/**
 * The fog modifiers currently on the map - the compositor's output, for the whole game rather than for a level.
 *
 * Kept as an ordered list, and only ever walked by index: two machines have to destroy and create the very same fog
 * modifiers in the very same order, or their handle id sequences drift apart (docs/CAUSES_OF_DESYNCS.md).
 */
export class VisibilityZoneArray {
    private zones: VisibilityZone[] = []

    count = () => this.zones.length

    countOfType = (visibilityType: VisibilityType) => {
        let n = 0

        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].visibilityType === visibilityType) {
                n++
            }
        }

        return n
    }

    forAll = (cb: (zone: VisibilityZone) => void) => {
        for (let i = 0; i < this.zones.length; i++) {
            cb(this.zones[i])
        }
    }

    forAllOfType = (visibilityType: VisibilityType, cb: (zone: VisibilityZone) => void) => {
        for (let i = 0; i < this.zones.length; i++) {
            if (this.zones[i].visibilityType === visibilityType) {
                cb(this.zones[i])
            }
        }
    }

    /**
     * Replaces the current zones by the requested ones, touching only what actually changed: a recomposition usually
     * leaves most rectangles exactly where they were, and destroying then recreating them all would churn handles and
     * make the fog blink for nothing.
     *
     * Gives back whether anything changed, so the caller only refreshes the world mask when it has to.
     */
    applyRequests = (requests: ZoneRequest[]): boolean => {
        const keyOf = (typeId: number, rect: TileRect) =>
            typeId + ':' + rect.tx1 + ',' + rect.ty1 + ',' + rect.tx2 + ',' + rect.ty2

        // Membership only, never walked: which zone a key points at cannot depend on any iteration order
        const existing: { [key: string]: number } = {}

        for (let i = 0; i < this.zones.length; i++) {
            const zone = this.zones[i]
            existing[keyOf(zone.visibilityType.id, zone)] = i
        }

        const kept: boolean[] = []

        for (let i = 0; i < this.zones.length; i++) {
            kept[i] = false
        }

        const next: VisibilityZone[] = []
        let changed = false

        for (const request of requests) {
            const index = existing[keyOf(request.visibilityType.id, request.rect)]

            if (index !== undefined && !kept[index]) {
                kept[index] = true
                arrayPush(next, this.zones[index])
                continue
            }

            arrayPush(
                next,
                new VisibilityZone(
                    request.rect.tx1,
                    request.rect.ty1,
                    request.rect.tx2,
                    request.rect.ty2,
                    request.visibilityType
                )
            )
            changed = true
        }

        // By index, so the order the modifiers are destroyed in is the same everywhere
        for (let i = 0; i < this.zones.length; i++) {
            if (!kept[i]) {
                this.zones[i].destroy()
                changed = true
            }
        }

        this.zones = next

        return changed
    }

    destroy = () => {
        for (let i = 0; i < this.zones.length; i++) {
            this.zones[i].destroy()
        }

        this.zones = []
    }
}
