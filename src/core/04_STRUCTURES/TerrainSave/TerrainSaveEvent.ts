import { MemoryHandler } from 'Utils/MemoryHandler'
import { Timer } from 'w3ts'
import { getUdgLevels } from '../../../../globals'
import { createTimer } from '../../../Utils/mapUtils'
import type { TerrainSave } from './TerrainSave'

// Named "condition", not "trigger" - this codebase's "trigger" already means a native WC3 trigger, so reusing
// that word here for something conceptually different (an event's activation condition) would be confusing.
export type TerrainSaveEventCondition =
    | { kind: 'levelStart' | 'levelEnd'; levelNum: number }
    | { kind: 'monsterTouch'; monsterId: number }

export type TerrainSaveEventAction = 'apply' | 'unapply'

export class TerrainSaveEvent {
    private static lastId = 0
    private static getNextId = (): number => ++TerrainSaveEvent.lastId

    private id: number
    terrainSave: TerrainSave
    condition: TerrainSaveEventCondition
    action: TerrainSaveEventAction
    delay?: number
    periodicInterval?: number

    private hookId: number | null = null
    private timer: Timer | null = null

    constructor(
        terrainSave: TerrainSave,
        condition: TerrainSaveEventCondition,
        action: TerrainSaveEventAction,
        delay?: number,
        periodicInterval?: number
    ) {
        this.id = TerrainSaveEvent.getNextId()
        this.terrainSave = terrainSave
        this.condition = condition
        this.action = action
        this.delay = delay
        this.periodicInterval = periodicInterval
    }

    getId = (): number => this.id

    // Level conditions hook directly into Level.hooks_onStart/onEnd. monsterTouch needs no registration here -
    // it's detected by a dedicated branch in onEscaperTouchingMonster instead (see step 5).
    register = (): void => {
        if (this.condition.kind === 'levelStart' || this.condition.kind === 'levelEnd') {
            const level = getUdgLevels().get(this.condition.levelNum)
            if (!level) {
                return
            }

            const hooks = this.condition.kind === 'levelStart' ? level.hooks_onStart : level.hooks_onEnd
            this.hookId = hooks.new(() => this.fire())
        }
    }

    unregister = (): void => {
        if (this.hookId !== null && (this.condition.kind === 'levelStart' || this.condition.kind === 'levelEnd')) {
            const level = getUdgLevels().get(this.condition.levelNum)
            const hooks = this.condition.kind === 'levelStart' ? level?.hooks_onStart : level?.hooks_onEnd
            hooks?.destroy(this.hookId)
        }
        this.hookId = null

        this.timer?.destroy()
        this.timer = null
    }

    fire = (): void => {
        if (this.delay !== undefined) {
            this.timer = createTimer(this.delay, false, () => {
                this.applyOrUnapply()
                if (this.periodicInterval !== undefined) {
                    this.startPeriodic()
                }
            })
        } else {
            this.applyOrUnapply()
            if (this.periodicInterval !== undefined) {
                this.startPeriodic()
            }
        }
    }

    startPeriodic = (): void => {
        if (this.periodicInterval === undefined) {
            return
        }

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

        return output
    }

    destroy = (): void => {
        this.unregister()
    }
}
