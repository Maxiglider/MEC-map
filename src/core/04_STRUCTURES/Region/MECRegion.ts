import { DefineDrawLineType } from '../../01_libraries/Draw_lines'
import { IDestroyable, MemoryHandler } from '../../../Utils/MemoryHandler'
import type { MonsterSpawn } from '../MonsterSpawn/MonsterSpawn'

const WATCH_TIMER_PERIOD = 0.05

export const OFFSET_FOR_START_LINE_NOT_SPAWNED_MONSTERS_TO_BE_CONSIDERED_OUT = 2
export const END_POINT_OFFSET_AFTER_END_OF_REGION = 50 // to be sure the monster ends their movement out of the region

export type StartAndEndPoints = {
    startX: number
    startY: number
    endX: number
    endY: number
    ephemeral: boolean
}

export abstract class MECRegion {
    private static lastId = -1

    private id: number
    private watchForEventsTimer?: timer
    private watchedUnits: Map<number, unit>
    private unitsConsideredInRegion: Map<number, unit>

    private unitEntersCallbacks: Map<number, (unit: unit) => void>
    private unitLeavesCallbacks: Map<number, (unit: unit) => void>

    private lastUnitEntersOrLeavesCallbackId: number = 0

    private currentlyDebugging = false
    private debugLightnings: lightning[] = MemoryHandler.getEmptyArray<lightning>()
    private debugEffects: effect[] = MemoryHandler.getEmptyArray<effect>()

    protected withEnterAndLeaveZone = false
    protected isLeaveZoneEnabled = true

    private defaultDebugLineColor = 'yellow'
    private defaultDebugLineWidth = 2

    protected constructor() {
        this.id = ++MECRegion.lastId

        this.watchedUnits = new Map()
        this.unitsConsideredInRegion = new Map()

        this.unitEntersCallbacks = new Map()
        this.unitLeavesCallbacks = new Map()
    }

    abstract areCoordsInRegion(x: number, y: number): boolean

    isUnitInRegion(unit: unit): boolean {
        return this.areCoordsInRegion(GetUnitX(unit), GetUnitY(unit))
    }

    enableWatchUnits(enabled: boolean): void {
        if (enabled === !!this.watchForEventsTimer) {
            return
        }

        if (enabled) {
            this.watchForEventsTimer = CreateTimer()
            TimerStart(this.watchForEventsTimer, WATCH_TIMER_PERIOD, true, () => {
                for (const [_, unit] of this.watchedUnits) {
                    const unitId = GetHandleId(unit)
                    const wasInRegion = this.unitsConsideredInRegion.has(unitId)
                    const isInRegion = this.isUnitInRegion(unit)

                    if (wasInRegion !== isInRegion) {
                        if (isInRegion) {
                            this.unitsConsideredInRegion.set(unitId, unit)
                            this.unitEntersCallbacks.forEach(callback => callback(unit))
                        } else {
                            this.unitsConsideredInRegion.delete(unitId)
                            this.unitLeavesCallbacks.forEach(callback => callback(unit))
                        }
                    }
                }
            })
        } else {
            this.watchForEventsTimer && DestroyTimer(this.watchForEventsTimer)
            delete this.watchForEventsTimer
        }
    }

    /**
     * Registers a callback to be called when a unit enters the region.
     * @param callback
     * @returns callbackId
     */
    onUnitEnters(callback: (unit: unit) => void): number {
        const callbackId = ++this.lastUnitEntersOrLeavesCallbackId
        this.unitEntersCallbacks.set(callbackId, callback)
        return callbackId
    }

    /**
     * Registers a callback to be called when a unit leaves the region.
     * @param callback
     * @returns callbackId
     */
    onUnitLeaves(callback: (unit: unit) => void): number {
        const callbackId = ++this.lastUnitEntersOrLeavesCallbackId
        this.unitLeavesCallbacks.set(callbackId, callback)
        return callbackId
    }

    unregisterCallback(callbackId: number): void {
        this.unitEntersCallbacks.delete(callbackId)
        this.unitLeavesCallbacks.delete(callbackId)
    }

    /**
     * Reimplement in children if needed
     */
    generateDebugLightnings(): lightning[] {
        MemoryHandler.destroyArray(this.debugLightnings)
        this.debugLightnings = MemoryHandler.getEmptyArray<lightning>()
        return this.debugLightnings
    }

    /**
     * Reimplement in children if needed
     */
    generateDebugEffects(): effect[] {
        MemoryHandler.destroyArray(this.debugEffects)
        this.debugEffects = MemoryHandler.getEmptyArray<effect>()
        return this.debugEffects
    }

    debugRects(enable: boolean): void {
        if (enable === this.currentlyDebugging) {
            return
        }
        this.currentlyDebugging = enable

        if (enable) {
            this.defineDebugLineType()
            this.debugLightnings = this.generateDebugLightnings()
            this.debugEffects = this.generateDebugEffects()
        } else {
            for (const lightning of this.debugLightnings) {
                DestroyLightning(lightning)
            }
            MemoryHandler.destroyArray(this.debugLightnings)
            for (const effect of this.debugEffects) {
                BlzSetSpecialEffectScale(effect, 0) // hide it because an effect doesn't visually instanstly disappear on destroy
                DestroyEffect(effect)
            }
            MemoryHandler.destroyArray(this.debugEffects)
        }
    }

    watchUnit(unit: unit, initiallyIn = false): void {
        this.watchedUnits.set(GetHandleId(unit), unit)
        if (initiallyIn) {
            this.unitsConsideredInRegion.set(GetHandleId(unit), unit)
        }
    }

    unwatchUnit(unit: unit): void {
        const unitId = GetHandleId(unit)
        this.watchedUnits.delete(unitId)
        this.unitsConsideredInRegion.delete(unitId)
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
        this.watchedUnits.clear()
        this.unitsConsideredInRegion.clear()
        this.unitEntersCallbacks.clear()
        this.unitLeavesCallbacks.clear()
    }

    destroy(): void {
        this.disable()
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
}
