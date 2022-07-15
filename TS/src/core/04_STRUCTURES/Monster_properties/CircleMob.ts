import { arrayPush, ForceAngleBetween0And360 } from 'core/01_libraries/Basic_functions'
import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { globals } from '../../../../globals'
import { ObjectHandler } from '../../../Utils/ObjectHandler'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/Monster'

const TIMER_PERIOD = 0.02
const DEFAULT_ROTATION_SPEED = 90
const DEFAULT_DIRECTION = 'cw'
const DEFAULT_FACING = 'cw'

export class CircleMob {
    level?: Level

    private triggerMob: Monster
    private mobs: number[] = []

    private rotationSpeed: number
    private direction: 'cw' | 'ccw'
    private facing: 'cw' | 'ccw' | 'in' | 'out'
    private radius: number
    private currentBaseAngle = 0

    id: number = -1

    private circleTimer: Timer | null = null

    constructor(
        triggerMob: Monster,
        rotationSpeed: number | null,
        direction: 'cw' | 'ccw' | null,
        facing: 'cw' | 'ccw' | 'in' | 'out' | null,
        radius: number
    ) {
        this.triggerMob = triggerMob
        triggerMob.setCircleMob(this)

        this.rotationSpeed = rotationSpeed || DEFAULT_ROTATION_SPEED
        this.direction = direction || DEFAULT_DIRECTION
        this.facing = facing || DEFAULT_FACING
        this.radius = radius
    }

    getTriggerMob = () => this.triggerMob

    getSpeed = () => this.rotationSpeed

    setSpeed = (rotationSpeed: number) => {
        this.rotationSpeed = rotationSpeed
    }

    getDirection = () => this.direction

    setDirection = (direction: 'cw' | 'ccw') => {
        this.direction = direction
    }

    getFacing = () => this.facing

    setFacing = (facing: 'cw' | 'ccw' | 'in' | 'out') => {
        this.facing = facing
    }

    getRadius = () => this.radius

    setRadius = (radius: number) => {
        this.radius = radius
    }

    getBlockMobs = () => {
        return this.mobs
    }

    initialize = () => {
        this.triggerMob.u && ShowUnit(this.triggerMob.u, false)
    }

    close = () => {}

    redoMainMobPermanentEffect = () => {}

    addBlockMob = (monster: Monster): boolean => {
        if (this.mobs.includes(monster.getId())) {
            return false
        }

        if (monster.getId() === this.triggerMob.getId()) {
            return false
        }

        arrayPush(this.mobs, monster.getId())
        monster.setCircleMobParent(this)

        if (!this.circleTimer) this.activate()

        return true
    }

    removeLastBlockMob = (): boolean => {
        return !!this.mobs.splice(-1, 1)
    }

    removeAllBlockMobs = () => {
        this.mobs.length = 0
    }

    removeMob = (monsterId: number) => {
        this.mobs.splice(this.mobs.indexOf(monsterId), 1)
    }

    destroy = () => {
        this.close()
        this.triggerMob.removeCircleMob()

        this.getBlockMobs().forEach(monsterId => {
            this.level?.monsters.get(monsterId)?.createUnit()
        })

        this.removeAllBlockMobs()

        this.circleTimer?.destroy()
        this.triggerMob.u && ShowUnit(this.triggerMob.u, true)

        this.level && this.level.circleMobs.removeCircleMob(this.id)
    }

    activate = () => {
        this.circleTimer?.destroy()

        this.initialize()

        const directionReal = this.direction === 'ccw' ? 1 : -1

        this.circleTimer = createTimer(TIMER_PERIOD, true, () => {
            if (!this.triggerMob.u) {
                return
            }

            const centerX = GetUnitX(this.triggerMob.u)
            const centerY = GetUnitY(this.triggerMob.u)

            const mobCount = this.mobs.length
            const angleDiff = 360.0 / I2R(mobCount)

            let angle = this.currentBaseAngle

            for (const monsterId of this.mobs) {
                const mob = this.level?.monsters.get(monsterId)

                if (mob?.u) {
                    const unitX = centerX + this.radius * CosBJ(angle)
                    const unitY = centerY + this.radius * SinBJ(angle)

                    const facingAngle = angle + 90 * directionReal

                    if (globals.MAP_MIN_X <= unitX && globals.MAP_MAX_X >= unitX) {
                        SetUnitX(mob.u, unitX)
                    }

                    if (globals.MAP_MIN_Y <= unitY && globals.MAP_MAX_Y >= unitY) {
                        SetUnitY(mob.u, unitY)
                    }

                    BlzSetUnitFacingEx(mob.u, facingAngle)
                }

                angle += angleDiff
            }

            this.currentBaseAngle = ForceAngleBetween0And360(
                this.currentBaseAngle + directionReal * this.rotationSpeed * TIMER_PERIOD
            )
        })
    }

    toJson = () => {
        const blockMobIds: number[] = []

        for (const monsterId of this.mobs) {
            if (!this.level?.monsters.get(monsterId)?.isDeleted()) {
                arrayPush(blockMobIds, monsterId)
            }
        }

        const output = ObjectHandler.getNewObject<any>()

        output['id'] = this.id
        output['mainMobId'] = this.triggerMob.id
        output['blockMobsIds'] = blockMobIds
        output['rotationSpeed'] = this.rotationSpeed
        output['direction'] = this.direction
        output['facing'] = this.facing
        output['radius'] = this.radius

        return output
    }
}
