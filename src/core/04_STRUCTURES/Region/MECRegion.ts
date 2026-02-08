import { DefineDrawLineType } from '../../01_libraries/Draw_lines'
import { IDestroyable } from '../../../Utils/MemoryHandler'
import { MonsterDirectionMode } from '../MonsterSpawn/MonsterSpawn'

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

export type GenerateStartAndEndPointsOptions = {
    forcedDistance?: number
    monsterDirectionMode: MonsterDirectionMode
}

export abstract class MECRegion {
    private watchForEventsTimer?: timer
    private watchedUnits: Map<number, unit>
    private unitsConsideredInRegion: Map<number, unit>

    private unitEntersCallbacks: Map<number, (unit: unit) => void>
    private unitLeavesCallbacks: Map<number, (unit: unit) => void>

    private lastUnitEntersOrLeavesCallbackId: number = 0

    private currentlyDebugging = false
    private debugLightnings: lightning[] = []
    private debugEffects: effect[] = []

    protected withEnterAndLeaveZone: boolean
    protected isLeaveZoneEnabled: boolean

    constructor(withEnterAndLeaveZone = false, isLeaveZoneEnabled = true) {
        this.withEnterAndLeaveZone = withEnterAndLeaveZone
        this.isLeaveZoneEnabled = isLeaveZoneEnabled

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
        return []
    }

    /**
     * Reimplement in children if needed
     */
    generateDebugEffects(): effect[] {
        return []
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
            for (const effect of this.debugEffects) {
                BlzSetSpecialEffectScale(effect, 0) // hide it because an effect doesn't visually instanstly disappear on destroy
                DestroyEffect(effect)
            }
            this.debugLightnings = []
            this.debugEffects = []
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
        DefineDrawLineType('yellow', 2)
    }

    isWithEnterAndLeaveZone() {
        return this.withEnterAndLeaveZone
    }

    destroy(): void {
        this.watchForEventsTimer && DestroyTimer(this.watchForEventsTimer)
        this.debugRects(false)
        this.watchedUnits.clear()
        this.unitsConsideredInRegion.clear()
        this.unitEntersCallbacks.clear()
        this.unitLeavesCallbacks.clear()
        this.debugRects(false)
    }

    generateStartAndEndPoints(
        options?: GenerateStartAndEndPointsOptions & IDestroyable
    ): StartAndEndPoints & IDestroyable {
        throw new Error('generateStartAndEndPoints method not implemented for this region type')
    }

    setIsLeaveZoneEnabled(enabled: boolean): void {
        if (enabled === this.isLeaveZoneEnabled) {
            return
        }

        this.isLeaveZoneEnabled = enabled
        if (this.currentlyDebugging) {
            // refresh the debug lines
            this.debugRects(false)
            this.debugRects(true)
        }
    }
}
