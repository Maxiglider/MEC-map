import { Natives } from '../../wc3_natives_unsecured/Natives'
import { DefineDrawLineType } from '../../01_libraries/Draw_lines'
import { IsHero } from '../Escaper/Escaper_functions'
import { Round32 } from '../../01_libraries/Basic_functions'

const UNIT_TIME_DELAY = 0.1

export abstract class MECRegion {
    private rects: rect[]
    private region: region
    private enterOrLeaveRegionTrigger: trigger
    private unitsConsideredInRegion: Map<number, unit>
    private delayUnitTimers: Map<number, timer>

    private unitEntersCallbacks: Map<number, (unit: unit) => void>
    private unitLeavesCallbacks: Map<number, (unit: unit) => void>

    private lastUnitEntersOrLeavesCallbackId: number = 0

    private debugLightnings: lightning[] = []

    constructor() {
        this.rects = []
        this.region = CreateRegion()
        this.unitsConsideredInRegion = new Map()
        this.delayUnitTimers = new Map()

        this.unitEntersCallbacks = new Map()
        this.unitLeavesCallbacks = new Map()

        this.enterOrLeaveRegionTrigger = CreateTrigger()

        TriggerRegisterEnterRegion(this.enterOrLeaveRegionTrigger, this.region)
        TriggerRegisterLeaveRegion(this.enterOrLeaveRegionTrigger, this.region)

        TriggerAddAction(this.enterOrLeaveRegionTrigger, () => {
            const unit = Natives.UGetTriggerUnit()
            if (!IsHero(unit)) return

            const unitId = GetHandleId(unit)
            const wasInRegion = this.unitsConsideredInRegion.has(unitId)

            const previousTimer = this.delayUnitTimers.get(unitId)
            if (previousTimer) {
                DestroyTimer(previousTimer)
            }
            const timer = CreateTimer()
            this.delayUnitTimers.set(unitId, timer)

            TimerStart(timer, UNIT_TIME_DELAY, false, () => {
                DestroyTimer(timer)
                this.delayUnitTimers.delete(unitId)

                const isInRegion = this.isUnitInRegion(unit)

                print('triggered: ' + GetUnitName(unit) + ' wasInRegion: ' + wasInRegion + ' isInRegion: ' + isInRegion)

                if (wasInRegion !== isInRegion) {
                    if (isInRegion) {
                        this.unitsConsideredInRegion.set(unitId, unit)
                        this.unitEntersCallbacks.forEach(callback => callback(unit))
                    } else {
                        this.unitsConsideredInRegion.delete(unitId)
                        this.unitLeavesCallbacks.forEach(callback => callback(unit))
                    }
                } else {
                    print('Unit pos: ' + Round32(GetUnitX(unit)) + ', ' + Round32(GetUnitY(unit)))
                }
            })
        })
    }

    protected defineRects(rects: rect[]): void {
        for (const rect of this.rects) {
            RegionClearRect(this.region, rect)
            RemoveRect(rect)
        }

        this.rects = rects
        for (const rect of rects) {
            RegionAddRect(this.region, rect)
        }
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

    abstract generateDebugLightnings(): lightning[]

    debugRects(enable: boolean): void {
        if (enable) {
            DefineDrawLineType('green', 2)
            this.debugLightnings = this.generateDebugLightnings()
        } else {
            for (const lightning of this.debugLightnings) {
                DestroyLightning(lightning)
            }
            this.debugLightnings = []
        }
    }
}
