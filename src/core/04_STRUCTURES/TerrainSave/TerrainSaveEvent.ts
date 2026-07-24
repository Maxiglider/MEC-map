import { MemoryHandler } from 'Utils/MemoryHandler'
import { Timer } from 'w3ts'
import { getUdgLevels, udg_monsters } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'
import { MecHook } from '../../API/MecHook'
import type { Level } from '../Level/Level'
import type { TerrainSave } from './TerrainSave'

// How transparent (0 opaque - 100 fully invisible) a monsterTouch event's target monster becomes while its
// event is considered triggered (see TerrainSaveEvent.running) - a visual cue that touching it again won't do
// anything right now.
const RUNNING_MONSTER_TRANSPARENCY = 60

export type TerrainSaveEventCondition =
    | { kind: 'levelStart' | 'levelEnd'; levelNum: number }
    | { kind: 'monsterTouch'; monsterId: number }

export type TerrainSaveEventAction = 'apply' | 'unapply'

// What to do, if anything, when the owning terrainSave's own level ends. 'stop' cancels any running delay/periodic
// timer without applying or unapplying. Only valid (and only ever fires) when there's a level to hook into:
// the terrainSave's own level if it's level-scoped, otherwise the condition's own level for a levelStart/levelEnd
// event - see getOnLvlEndLevel().
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
    // Only set when onLvlEnd is defined - hooks into getOnLvlEndLevel()'s hooks_onEnd.
    private onLvlEndHookId: number | null = null
    // True from fire() until the event's cycle has fully played out (the delayed action has fired and there's
    // no periodic loop or pending duration revert left) - a repeat trigger (e.g. touching the same monster
    // again) while true is ignored instead of restarting/interrupting the cycle. Cleared by performDurationRevert
    // and fireOnLvlEnd, the two ways a periodic/pending cycle can conclusively end.
    private running = false
    // While false, fire()/fireOnLvlEnd() are no-ops - toggled via enable()/disable(), not persisted-optional
    // (defaults true so events saved before this field existed stay enabled).
    private enabled = true

    constructor(
        terrainSave: TerrainSave,
        condition: TerrainSaveEventCondition,
        action: TerrainSaveEventAction,
        delay?: number,
        periodicInterval?: number,
        duration?: number,
        onLvlEnd?: TerrainSaveEventOnLvlEnd,
        enabled = true
    ) {
        this.id = TerrainSaveEvent.getNextId()
        this.terrainSave = terrainSave
        this.condition = condition
        this.action = action
        this.delay = delay
        this.periodicInterval = periodicInterval
        this.duration = duration
        this.onLvlEnd = onLvlEnd
        this.enabled = enabled
    }

    getId = (): number => this.id

    isEnabled = (): boolean => this.enabled

    // Freezes the event in its current state: cancels any running delay/periodic/duration timer (and clears the
    // monsterTouch "running" transparency tint) without forcing an apply/unapply - same semantics as
    // `onLvlEnd: 'stop'`. Re-enabling just resumes listening for the next trigger, nothing auto-fires.
    disable = (): void => {
        if (!this.enabled) {
            return
        }
        this.enabled = false
        this.destroyTimer()
        this.destroyDurationTimer()
        this.setRunning(false)
    }

    enable = (): void => {
        this.enabled = true
    }

    // Also toggles the target monster's transparency for a monsterTouch event, as a visual cue that it's
    // currently triggered and won't react to another touch.
    private setRunning = (running: boolean): void => {
        this.running = running

        if (this.condition.kind === 'monsterTouch') {
            const monster = udg_monsters[this.condition.monsterId]
            monster?.setUnitTransparency(running ? RUNNING_MONSTER_TRANSPARENCY : 0)
        }
    }

    // Level conditions hook directly into Level.hooks_onStart/onEnd. monsterTouch needs no registration here -
    // it's detected by a dedicated branch in onEscaperTouchingMonster instead (see step 5). Independently of the
    // condition, onLvlEnd (if set) hooks into whichever level getOnLvlEndLevel() resolves to.
    register = (): void => {
        if (this.condition.kind === 'levelStart' || this.condition.kind === 'levelEnd') {
            const level = getUdgLevels().get(this.condition.levelNum)
            if (level) {
                const hooks = this.condition.kind === 'levelStart' ? level.hooks_onStart : level.hooks_onEnd
                this.hookId = hooks.new(() => this.fire())
            }
        }

        if (this.onLvlEnd !== undefined) {
            this.onLvlEndHookId = this.getOnLvlEndLevel()?.hooks_onEnd.new(() => this.fireOnLvlEnd()) ?? null
        }
    }

    // The level whose hooks_onEnd onLvlEnd hooks into: the terrainSave's own level if it's level-scoped,
    // otherwise the condition's own level for a levelStart/levelEnd event - so onLvlEnd also works on a global
    // terrainSave as long as the event itself is tied to a specific level.
    getOnLvlEndLevel = (): Level | null => {
        const terrainSaveLevel = this.terrainSave.getLevel()
        if (terrainSaveLevel !== null) {
            return terrainSaveLevel
        }

        if (this.condition.kind === 'levelStart' || this.condition.kind === 'levelEnd') {
            return getUdgLevels().get(this.condition.levelNum)
        }

        return null
    }

    unregister = (): void => {
        if (this.hookId !== null) {
            MecHook.destroy(this.hookId)
        }
        this.hookId = null

        if (this.onLvlEndHookId !== null) {
            MecHook.destroy(this.onLvlEndHookId)
            this.onLvlEndHookId = null
        }

        this.destroyTimer()
        this.destroyDurationTimer()
        this.setRunning(false)
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

    // Ignored while disabled, or already running (e.g. a repeat monsterTouch mid-delay/periodic/duration).
    fire = (): void => {
        if (!this.enabled || this.running) {
            return
        }
        this.setRunning(true)

        this.destroyTimer()

        const onFired = () => {
            this.applyOrUnapply()
            this.scheduleDurationRevert()
            if (this.periodicInterval !== undefined) {
                this.startPeriodic()
            }
            // No periodic loop and no pending duration revert left to wait on - the cycle has, or hasn't,
            // conclusively ended:
            // - a levelStart/levelEnd condition must always be free to fire again the next time that level
            //   genuinely starts/ends (e.g. the level is replayed) - only monsterTouch's repeat-trigger case
            //   below can stay locked.
            // - action === 'unapply' leaves nothing applied, so it's free to fire again right away.
            // - action === 'apply' with onLvlEnd === 'unapply' will still be reverted later at level end
            //   (fireOnLvlEnd clears `running` then) - stays locked until that happens.
            // - action === 'apply' with no such mechanism left would apply and never get unapplied again -
            //   stays locked forever instead, so a repeat touch can't just keep re-applying it for nothing.
            if (this.periodicInterval === undefined && this.duration === undefined) {
                if (
                    this.condition.kind !== 'monsterTouch' ||
                    this.action === 'unapply' ||
                    this.onLvlEnd === 'unapply'
                ) {
                    this.setRunning(false)
                }
            }
        }

        if (this.delay !== undefined) {
            this.timer = createTimer(this.delay, false, onFired)
        } else {
            onFired()
        }
    }

    private performDurationRevert = (): void => {
        this.destroyTimer()
        this.setRunning(false)

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

    // Fires once when getOnLvlEndLevel() ends. 'stop' just cancels any running delay/periodic timer;
    // 'apply'/'unapply' additionally force that action, regardless of the event's own delay/period/duration state.
    private fireOnLvlEnd = (): void => {
        if (!this.enabled) {
            return
        }

        this.destroyTimer()
        this.destroyDurationTimer()
        this.setRunning(false)

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
        output.enabled = this.enabled

        return output
    }

    destroy = (): void => {
        this.unregister()
    }
}
