import { MemoryHandler } from 'Utils/MemoryHandler'
import { Timer } from 'w3ts'
import { getUdgLevels } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'
import type { TerrainSave } from './TerrainSave'

export type TerrainSaveEventCondition =
    | { kind: 'levelStart' | 'levelEnd'; levelNum: number }
    | { kind: 'monsterTouch'; monsterId: number }

export type TerrainSaveEventAction = 'apply' | 'unapply'

// What to do, if anything, when the owning terrainSave's own level ends. 'stop' cancels any running delay/periodic
// timer without applying or unapplying. Only valid (and only ever fires) when terrainSave isn't global.
export type TerrainSaveEventOnLvlEnd = 'apply' | 'unapply' | 'stop'

export class TerrainSaveEvent {
    private static lastId = 0
    private static getNextId = (): number => ++TerrainSaveEvent.lastId

    private id: number
    terrainSave: TerrainSave
    condition: TerrainSaveEventCondition
    action: TerrainSaveEventAction
    delay?: number
    periodicInterval?: number
    // Seconds after the (first) fire to automatically perform the opposite action once, independently of period.
    duration?: number
    onLvlEnd?: TerrainSaveEventOnLvlEnd

    private hookId: number | null = null
    private timer: Timer | null = null
    // Separate from `timer`: duration's revert fires once, independently, alongside a periodic loop, so it
    // can't share the same slot as the delay/periodic timer without the two clobbering each other.
    private durationTimer: Timer | null = null
    // Only set when onLvlEnd is defined - hooks into the terrainSave's own level's hooks_onEnd.
    private onLvlEndHookId: number | null = null

    constructor(
        terrainSave: TerrainSave,
        condition: TerrainSaveEventCondition,
        action: TerrainSaveEventAction,
        delay?: number,
        periodicInterval?: number,
        duration?: number,
        onLvlEnd?: TerrainSaveEventOnLvlEnd
    ) {
        this.id = TerrainSaveEvent.getNextId()
        this.terrainSave = terrainSave
        this.condition = condition
        this.action = action
        this.delay = delay
        this.periodicInterval = periodicInterval
        this.duration = duration
        this.onLvlEnd = onLvlEnd
    }

    getId = (): number => this.id

    // Level conditions hook directly into Level.hooks_onStart/onEnd. monsterTouch needs no registration here -
    // it's detected by a dedicated branch in onEscaperTouchingMonster instead (see step 5). Independently of the
    // condition, onLvlEnd (if set) hooks into the terrainSave's own level's hooks_onEnd.
    register = (): void => {
        if (this.condition.kind === 'levelStart' || this.condition.kind === 'levelEnd') {
            const level = getUdgLevels().get(this.condition.levelNum)
            if (!level) {
                return
            }

            const hooks = this.condition.kind === 'levelStart' ? level.hooks_onStart : level.hooks_onEnd
            this.hookId = hooks.new(() => this.fire())
        }

        if (this.onLvlEnd !== undefined) {
            const level = this.terrainSave.getLevel()
            this.onLvlEndHookId = level?.hooks_onEnd.new(() => this.fireOnLvlEnd()) ?? null
        }
    }

    unregister = (): void => {
        if (this.hookId !== null && (this.condition.kind === 'levelStart' || this.condition.kind === 'levelEnd')) {
            const level = getUdgLevels().get(this.condition.levelNum)
            const hooks = this.condition.kind === 'levelStart' ? level?.hooks_onStart : level?.hooks_onEnd
            hooks?.destroy(this.hookId)
        }
        this.hookId = null

        if (this.onLvlEndHookId !== null) {
            this.terrainSave.getLevel()?.hooks_onEnd.destroy(this.onLvlEndHookId)
            this.onLvlEndHookId = null
        }

        this.destroyTimer()
        this.destroyDurationTimer()
    }

    // Destroys any timer already running for this event before starting a new one. Without this, calling
    // fire() again while a previous delay/periodic timer is still active (very possible for monsterTouch,
    // which can be re-triggered on every touch) would silently overwrite `this.timer`, orphaning the old
    // handle - it keeps running forever, since unregister() can then only ever see the newest one.
    private destroyTimer = (): void => {
        this.timer?.destroy()
        this.timer = null
    }

    private destroyDurationTimer = (): void => {
        this.durationTimer?.destroy()
        this.durationTimer = null
    }

    fire = (): void => {
        this.destroyTimer()

        if (this.delay !== undefined) {
            this.timer = createTimer(this.delay, false, () => {
                this.applyOrUnapply()
                this.scheduleDurationRevert()
                if (this.periodicInterval !== undefined) {
                    this.startPeriodic()
                }
            })
        } else {
            this.applyOrUnapply()
            this.scheduleDurationRevert()
            if (this.periodicInterval !== undefined) {
                this.startPeriodic()
            }
        }
    }

    private performDurationRevert = (): void => {
        if (this.action === 'apply') {
            this.terrainSave.unapply()
        } else {
            this.terrainSave.apply()
        }
    }

    // Independent of delay/period: once the (possibly delayed) main action has fired, automatically perform
    // the opposite action once - e.g. apply, then auto-unapply - `duration` seconds later.
    private scheduleDurationRevert = (): void => {
        this.destroyDurationTimer()

        if (this.duration === undefined) {
            return
        }

        this.durationTimer = createTimer(this.duration, false, () => this.performDurationRevert())
    }

    // Fires once when the owning terrainSave's own level ends (only ever registered for a non-global
    // terrainSave, see register()). 'stop' just cancels any running delay/periodic timer; 'apply'/'unapply'
    // additionally force that action, regardless of the event's own delay/period/duration state.
    private fireOnLvlEnd = (): void => {
        this.destroyTimer()
        this.destroyDurationTimer()

        if (this.onLvlEnd === 'apply') {
            this.terrainSave.apply()
        } else if (this.onLvlEnd === 'unapply') {
            this.terrainSave.unapply()
        }
    }

    startPeriodic = (): void => {
        if (this.periodicInterval === undefined) {
            return
        }

        this.destroyTimer()
        this.timer = createTimer(this.periodicInterval, true, () => this.toggleApplyUnapply())
    }

    applyOrUnapply = (): void => {
        if (this.action === 'apply') {
            this.terrainSave.apply()
        } else {
            this.terrainSave.unapply()
        }
    }

    toggleApplyUnapply = (): void => {
        if (this.terrainSave.isApplied()) {
            this.terrainSave.unapply()
        } else {
            this.terrainSave.apply()
        }
    }

    // hookId/timer are runtime-only, never persisted - reconstruction calls register() again instead.
    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()

        output.id = this.id
        output.condition = this.condition
        output.action = this.action
        output.delay = this.delay
        output.periodicInterval = this.periodicInterval
        output.duration = this.duration
        output.onLvlEnd = this.onLvlEnd

        return output
    }

    destroy = (): void => {
        this.unregister()
    }
}
