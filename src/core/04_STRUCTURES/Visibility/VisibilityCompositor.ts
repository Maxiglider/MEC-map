import { errorHandler } from 'Utils/mapUtils'
import { getUdgVisibilityTypes } from '../../../../globals'
import { arrayPush } from '../../01_libraries/Basic_functions'
import { DefineDrawLineType, DrawLine } from '../../01_libraries/Draw_lines'
import { RefreshHideAllVM } from '../../03_view_all_hide_all/View_all_hide_all'
import type { Level } from '../Level/Level'
import { tileToWorldMax, tileToWorldMin } from './TileCoordinates'
import { partitionTiles } from './VisibilityPartition'
import { VisibilityTileArray } from './VisibilityTileArray'
import { VisibilityType } from './VisibilityType'
import { VisibilityZoneArray, ZoneRequest } from './VisibilityZoneArray'

/** Where a periodic type is in its cycle, shared by every zone of that type so they all blink together */
type Phase = {
    timer: timer
    visible: boolean
}

/**
 * Turns what the levels say about their tiles into the fog modifiers actually on the map.
 *
 * Composition: the active levels are walked from the highest one down and the first type to claim a tile wins, so an
 * "untouched" tile falls through to the level below while a "masked" one overrides it. That is the whole point of the
 * redesign - the old rectangles could only ever reveal.
 *
 * Only what ends up visible produces a modifier: the world bounds black mask is permanently on, so a masked tile is
 * one with no modifier over it, and no FOG_OF_WAR_MASKED modifier is ever created.
 *
 * The old VisibilityModifier rectangles are NOT part of this. They are in arbitrary world coordinates, not aligned on
 * the tile grid, so composing them would mean rasterizing them and moving their borders - and an existing map has to
 * render exactly as it did. They keep being driven by Level.activateVisibilities(). The cost of that choice: a masked
 * tile cannot hide what a level left in legacy mode reveals. -convertVisibilities is the way out.
 */
class Compositor {
    /** The level stack resolved into one layer, reused between recompositions rather than reallocated */
    private composed = new VisibilityTileArray()
    private zones = new VisibilityZoneArray()
    private phases: { [typeId: number]: Phase | undefined } = {}

    private debugEnabled = false
    /**
     * Local, debug only: os.clock() does not give the same reading on two machines, so this must never reach game
     * state. It is written here and read by -debugVisibilityZones, which shows it to the player who asked, nothing
     * else (docs/CAUSES_OF_DESYNCS.md, on local clocks).
     */
    private lastDurationMs = 0

    /** The outlines -debugVisibilityZones draws, destroyed and redrawn at each recomposition while it is on */
    private debugLines: lightning[] = []

    /** @param activeLevelsHighestFirst the levels contributing, highest id first - the order composition depends on */
    refresh = (activeLevelsHighestFirst: Level[]) => {
        const startedAt = this.debugEnabled ? os.clock() : 0

        this.composed.clear()

        for (const level of activeLevelsHighestFirst) {
            level.visibilityTiles.forEachTile((tx, ty, visibilityType) =>
                this.composed.setIfAbsent(tx, ty, visibilityType)
            )
        }

        const requests: ZoneRequest[] = []
        const visibilityTypes = getUdgVisibilityTypes()
        const boxes = this.composed.collectBoxes()

        // By type id, so the rectangles are always requested in the same order whatever the map
        for (let id = 0; id < visibilityTypes.getIdLimit(); id++) {
            const visibilityType = visibilityTypes.get(id)
            const box = boxes[id]

            if (!visibilityType || !box || !visibilityType.needsFogModifier()) {
                continue
            }

            for (const rect of partitionTiles(this.composed.maskFor(visibilityType, box))) {
                arrayPush(requests, { rect, visibilityType })
            }
        }

        const changed = this.zones.applyRequests(requests)

        this.refreshPhases()

        if (changed) {
            // As the old VisibilityModifier did on every creation: the world mask is rebuilt on top of the new set
            RefreshHideAllVM()
        }

        if (this.debugEnabled) {
            this.lastDurationMs = (os.clock() - startedAt) * 1000
        }

        this.drawDebugZones()
    }

    countZones = () => this.zones.count()

    countZonesOfType = (visibilityType: VisibilityType) => this.zones.countOfType(visibilityType)

    getLastDurationMs = () => this.lastDurationMs

    isDebugEnabled = () => this.debugEnabled

    setDebugEnabled = (enabled: boolean) => {
        this.debugEnabled = enabled
        this.drawDebugZones()
    }

    /**
     * Outlines every zone, one colour per kind of visibility type. This is the visual feedback a maker gets while
     * painting: it is redrawn at each recomposition, so once per stroke - a maker usually has -va on anyway, which
     * makes the fog itself show them nothing.
     */
    private drawDebugZones = () => {
        for (const line of this.debugLines) {
            DestroyLightning(line)
        }

        this.debugLines = []

        if (!this.debugEnabled) {
            return
        }

        this.zones.forAll(zone => {
            DefineDrawLineType(zone.visibilityType.isPeriodic() ? 'yellow' : 'green', 2)

            const x1 = tileToWorldMin(zone.tx1)
            const y1 = tileToWorldMin(zone.ty1)
            const x2 = tileToWorldMax(zone.tx2)
            const y2 = tileToWorldMax(zone.ty2)

            this.drawDebugLine(x1, y1, x2, y1)
            this.drawDebugLine(x2, y1, x2, y2)
            this.drawDebugLine(x2, y2, x1, y2)
            this.drawDebugLine(x1, y2, x1, y1)
        })
    }

    private drawDebugLine = (x1: number, y1: number, x2: number, y2: number) => {
        const line = DrawLine(x1, y1, x2, y2)

        if (line) {
            arrayPush(this.debugLines, line)
        }
    }

    /** On -lmfc, the levels are thrown away and rebuilt: the modifiers of the previous game data must go with them */
    destroy = () => {
        const visibilityTypes = getUdgVisibilityTypes()

        for (let id = 0; id < visibilityTypes.getIdLimit(); id++) {
            const phase = this.phases[id]

            if (phase !== undefined) {
                DestroyTimer(phase.timer)
                delete this.phases[id]
            }
        }

        this.zones.destroy()
        this.composed.clear()
    }

    /**
     * Starts what has to be shown, and keeps one timer per periodic type - not one per zone, so every zone of a type
     * blinks in step, and a zone created by this very recomposition joins the cycle where the others already are.
     */
    private refreshPhases = () => {
        const visibilityTypes = getUdgVisibilityTypes()

        for (let id = 0; id < visibilityTypes.getIdLimit(); id++) {
            const visibilityType = visibilityTypes.get(id)
            const hasZones = visibilityType !== null && this.zones.countOfType(visibilityType) > 0
            const phase = this.phases[id]

            if (!visibilityType || !hasZones || !visibilityType.isPeriodic()) {
                if (phase !== undefined) {
                    DestroyTimer(phase.timer)
                    delete this.phases[id]
                }

                // A plain visible type has nothing to drive: its zones are simply on
                if (visibilityType !== null && hasZones) {
                    this.applyPhase(visibilityType, true)
                }

                continue
            }

            if (phase !== undefined) {
                this.applyPhase(visibilityType, phase.visible)
                continue
            }

            // The cycle starts when the type gets its first zone, which is when the level holding it starts
            const started: Phase = {
                timer: CreateTimer(),
                visible: visibilityType.getStartState() === 'visible',
            }

            this.phases[id] = started

            this.applyPhase(visibilityType, started.visible)
            this.scheduleFlip(visibilityType, started)
        }
    }

    private applyPhase = (visibilityType: VisibilityType, visible: boolean) => {
        this.zones.forAllOfType(visibilityType, zone => zone.activate(visible))
    }

    private scheduleFlip = (visibilityType: VisibilityType, phase: Phase) => {
        const duration = phase.visible ? visibilityType.getVisibleTime() : visibilityType.getMaskedTime()

        TimerStart(
            phase.timer,
            duration,
            false,
            errorHandler(() => {
                phase.visible = !phase.visible
                this.applyPhase(visibilityType, phase.visible)
                this.scheduleFlip(visibilityType, phase)
            })
        )
    }
}

export const VisibilityCompositor = new Compositor()
