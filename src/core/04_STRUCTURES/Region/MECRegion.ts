import { DefineDrawLineType } from '../../01_libraries/Draw_lines'
import { Timer } from 'w3ts'
import { createTimer } from '../../../Utils/mapUtils'

const WATCH_TIMER_PERIOD = 0.05

export abstract class MECRegion {
    private watchForEventsTimer: Timer
    private watchedUnits: Map<number, unit>
    private unitsConsideredInRegion: Map<number, unit>

    private unitEntersCallbacks: Map<number, (unit: unit) => void>
    private unitLeavesCallbacks: Map<number, (unit: unit) => void>

    private lastUnitEntersOrLeavesCallbackId: number = 0

    private debugLightnings: lightning[] = []
    private debugEffects: effect[] = []

    constructor() {
        this.watchedUnits = new Map()
        this.unitsConsideredInRegion = new Map()

        this.unitEntersCallbacks = new Map()
        this.unitLeavesCallbacks = new Map()

        this.watchForEventsTimer = createTimer(WATCH_TIMER_PERIOD, true, () => {
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
    }

    abstract areCoordsInRegion(x: number, y: number): boolean

    isUnitInRegion(unit: unit): boolean {
        return this.areCoordsInRegion(GetUnitX(unit), GetUnitY(unit))
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
        for (const lightning of this.debugLightnings) {
            DestroyLightning(lightning)
        }
        for (const effect of this.debugEffects) {
            BlzSetSpecialEffectScale(effect, 0) // hide it because an effect doesn't visually instanstly disappear on destroy
            DestroyEffect(effect)
        }

        if (enable) {
            DefineDrawLineType('green', 2)
            this.debugLightnings = this.generateDebugLightnings()
            this.debugEffects = this.generateDebugEffects()
        } else {
            this.debugLightnings = []
            this.debugEffects = []
        }
    }

    watchUnit(unit: unit): void {
        this.watchedUnits.set(GetHandleId(unit), unit)
    }

    unwatchUnit(unit: unit): void {
        const unitId = GetHandleId(unit)
        this.watchedUnits.delete(unitId)
        this.unitsConsideredInRegion.delete(unitId)
    }
}
