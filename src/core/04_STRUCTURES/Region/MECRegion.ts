import { DefineDrawLineType } from '../../01_libraries/Draw_lines'
import { IDestroyable, MemoryHandler } from '../../../Utils/MemoryHandler'
import type { MonsterSpawn } from '../MonsterSpawn/MonsterSpawn'
import { emptyOject } from '../../01_libraries/Basic_functions'

export const OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT = 4
export const END_POINT_OFFSET_AFTER_END_OF_REGION = 200 // to be sure the monster ends their movement out of the region and doesn't reach the end point

export type StartAndEndPoints = {
    startX: number
    startY: number
    endX: number
    endY: number
    ephemeral: boolean
}

const WATCH_TIMER_PERIOD = 0.05

const WatchForEventsTimerCallback = () => {
    for (const [_, mecRegion] of pairs(MECRegion.allMecRegions)) {
        mecRegion.watchForEventsTimerCallback()
    }
}

// One single timer for all MECRegions for optimization, instead of one timer per MECRegion
export const init_MECRegions = () => {
    TimerStart(CreateTimer(), WATCH_TIMER_PERIOD, true, WatchForEventsTimerCallback)
}

export abstract class MECRegion {
    private static lastId = -1

    static allMecRegions: { [x: number]: MECRegion } = {}

    private id: number
    private watchForEventsEnabled = false
    private watchedUnits: { [x: number]: unit } = MemoryHandler.getEmptyObject()
    private unitsConsideredInRegion: { [x: number]: unit } = MemoryHandler.getEmptyObject()

    private unitEntersCallbacks: { [x: number]: (unit: unit) => void } = MemoryHandler.getEmptyObject()
    private unitLeavesCallbacks: { [x: number]: (unit: unit) => void } = MemoryHandler.getEmptyObject()

    private lastUnitEntersOrLeavesCallbackId: number = 0

    private currentlyDebugging = false
    protected debugLightnings: lightning[] = MemoryHandler.getEmptyArray<lightning>()
    protected debugEffects: effect[] = MemoryHandler.getEmptyArray<effect>()

    protected withEnterAndLeaveZone = false
    protected isLeaveZoneEnabled = true

    private defaultDebugLineColor = 'yellow'
    private defaultDebugLineWidth = 2

    protected constructor() {
        this.id = ++MECRegion.lastId
        MECRegion.allMecRegions[this.id] = this
    }

    abstract areCoordsInRegion(x: number, y: number): boolean

    isUnitInRegion(unit: unit): boolean {
        return this.areCoordsInRegion(GetUnitX(unit), GetUnitY(unit))
    }

    enableWatchUnits(enabled: boolean): void {
        if (enabled === this.watchForEventsEnabled) {
            return
        }
        this.watchForEventsEnabled = enabled
    }

    watchForEventsTimerCallback() {
        if (!this.watchForEventsEnabled) {
            return
        }

        for (const [_, unit] of pairs(this.watchedUnits)) {
            const unitId = GetHandleId(unit)
            const wasInRegion = this.unitsConsideredInRegion[unitId] !== undefined
            const isInRegion = this.isUnitInRegion(unit)

            if (wasInRegion !== isInRegion) {
                if (isInRegion) {
                    this.unitsConsideredInRegion[unitId] = unit
                    for (const [_, callback] of pairs(this.unitEntersCallbacks)) {
                        callback(unit)
                    }
                } else {
                    delete this.unitsConsideredInRegion[unitId]
                    for (const [_, callback] of pairs(this.unitLeavesCallbacks)) {
                        callback(unit)
                    }
                }
            }
        }
    }

    /**
     * Registers a callback to be called when a unit enters the region.
     * @param callback
     * @returns callbackId
     */
    onUnitEnters(callback: (this: any, unit: unit) => void): number {
        const callbackId = ++this.lastUnitEntersOrLeavesCallbackId
        this.unitEntersCallbacks[callbackId] = callback
        return callbackId
    }

    /**
     * Registers a callback to be called when a unit leaves the region.
     * @param callback
     * @returns callbackId
     */
    onUnitLeaves(callback: (this: any, unit: unit) => void): number {
        const callbackId = ++this.lastUnitEntersOrLeavesCallbackId
        this.unitLeavesCallbacks[callbackId] = callback
        return callbackId
    }

    unregisterCallback(callbackId: number): void {
        delete this.unitEntersCallbacks[callbackId]
        delete this.unitLeavesCallbacks[callbackId]
    }

    /**
     * Reimplement in children if needed
     */
    generateDebugLightnings(): lightning[] {
        return this.debugLightnings
    }

    /**
     * Reimplement in children if needed
     */
    generateDebugEffects(): effect[] {
        return this.debugEffects
    }

    debugRects(enable: boolean): void {
        if (enable === this.currentlyDebugging) {
            return
        }
        this.currentlyDebugging = enable

        if (enable) {
            this.defineDebugLineType()
            this.generateDebugLightnings()
            this.generateDebugEffects()
        } else {
            for (const lightning of this.debugLightnings) {
                DestroyLightning(lightning)
            }
            this.debugLightnings.length = 0

            for (const effect of this.debugEffects) {
                BlzSetSpecialEffectScale(effect, 0) // hide it because an effect doesn't visually instanstly disappear on destroy
                DestroyEffect(effect)
            }
            this.debugEffects.length = 0
        }
    }

    watchUnit(unit: unit, initiallyIn = false): void {
        this.watchedUnits[GetHandleId(unit)] = unit
        if (initiallyIn) {
            this.unitsConsideredInRegion[GetHandleId(unit)] = unit
        }
    }

    unwatchUnit(unit: unit): void {
        const unitId = GetHandleId(unit)
        delete this.watchedUnits[unitId]
        delete this.unitsConsideredInRegion[unitId]
    }

    protected defineDebugLineTypeForStart() {
        if (this.withEnterAndLeaveZone) {
            DefineDrawLineType('red', 4)
        } else {
            this.defineDebugLineType()
        }
    }

    protected defineDebugLineTypeForEnd() {
        if (this.withEnterAndLeaveZone) {
            DefineDrawLineType('blue', 2)
        } else {
            this.defineDebugLineType()
        }
    }

    protected defineDebugLineType() {
        DefineDrawLineType(this.defaultDebugLineColor, this.defaultDebugLineWidth)
    }

    isWithEnterAndLeaveZone() {
        return this.withEnterAndLeaveZone
    }

    setWithEnterAndLeaveZone(withEnterAndLeaveZone: boolean): void {
        if (withEnterAndLeaveZone === this.withEnterAndLeaveZone) {
            return
        }

        this.withEnterAndLeaveZone = withEnterAndLeaveZone
        this.refreshDebuggingRects()
    }

    disable() {
        this.enableWatchUnits(false)
        this.debugRects(false)

        emptyOject(this.watchedUnits)
        emptyOject(this.unitsConsideredInRegion)
        emptyOject(this.unitEntersCallbacks)
        emptyOject(this.unitLeavesCallbacks)
    }

    destroy(): void {
        this.disable()

        MemoryHandler.destroyArray(this.debugLightnings)
        MemoryHandler.destroyArray(this.debugEffects)

        MemoryHandler.destroyObject(this.watchedUnits)
        MemoryHandler.destroyObject(this.unitsConsideredInRegion)
        MemoryHandler.destroyObject(this.unitEntersCallbacks)
        MemoryHandler.destroyObject(this.unitLeavesCallbacks)

        delete MECRegion.allMecRegions[this.id]
    }

    generateStartAndEndPoints(monsterSpawn?: MonsterSpawn): StartAndEndPoints & IDestroyable {
        throw new Error('generateStartAndEndPoints method not implemented for this region type')
    }

    refreshDebuggingRects(): void {
        if (this.currentlyDebugging) {
            this.debugRects(false)
            this.debugRects(true)
        }
    }

    setIsLeaveZoneEnabled(enabled: boolean): void {
        if (enabled === this.isLeaveZoneEnabled) {
            return
        }

        this.isLeaveZoneEnabled = enabled
        this.refreshDebuggingRects()
    }

    setDefaultDebugLineColor(color: string): void {
        this.defaultDebugLineColor = color
        this.refreshDebuggingRects()
    }

    setDefaultDebugLineWidth(width: number): void {
        this.defaultDebugLineWidth = width
        this.refreshDebuggingRects()
    }

    getId(): number {
        return this.id
    }

    toJson() {
        const output = MemoryHandler.getEmptyObject<any>()
        output.type = this.constructor.name
        return output
    }

    toText(detailled = false): string {
        return this.constructor.name
    }
}
