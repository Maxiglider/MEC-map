import { arrayPush } from 'core/01_libraries/Basic_functions'
import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/Monster'
import { MonsterArray } from '../Monster/MonsterArray'

export class CircleMob {
    level?: Level

    private triggerMob: Monster
    private mobs = new MonsterArray()

    private speed: number | null
    private direction: string | null
    private radius: number | null

    id: number = -1

    private circleTimer: Timer | null = null

    constructor(triggerMob: Monster, speed: number | null, direction: string | null, radius: number | null) {
        this.triggerMob = triggerMob
        triggerMob.setCircleMob(this)

        this.speed = speed
        this.direction = direction
        this.radius = radius

        this.activate()
    }

    getTriggerMob = () => this.triggerMob

    getSpeed = () => this.speed

    setSpeed = (speed: number | null) => {
        this.speed = speed
    }

    getDirection = () => this.direction

    setDirection = (direction: string | null) => {
        this.direction = direction
    }

    getRadius = () => this.radius

    setRadius = (radius: number | null) => {
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
        if (this.mobs.containsMonster(monster)) {
            return false
        }

        if (monster.getId() === this.triggerMob.getId()) {
            return false
        }

        this.mobs.new(monster, false)

        return true
    }

    removeLastBlockMob = (): boolean => {
        return this.mobs.removeLast(false)
    }

    removeAllBlockMobs = () => {
        this.mobs.removeAllWithoutDestroy()
    }

    destroy = () => {
        this.close()
        this.triggerMob.removeCircleMob()

        this.removeAllBlockMobs()

        this.circleTimer?.destroy()
        this.triggerMob.u && ShowUnit(this.triggerMob.u, true)

        this.level && this.level.circleMobs.removeCircleMob(this.id)
    }

    activate = () => {
        this.circleTimer?.destroy()

        let circleCounter = 0

        this.initialize()

        this.circleTimer = createTimer(0.02, true, () => {
            if (!this.triggerMob.u) {
                return
            }

            const triggerMobPoint = GetUnitLoc(this.triggerMob.u)

            const mobCount = this.mobs.count()

            const direction = this.direction || 'cw'
            const radius = this.radius || R2I((300 * mobCount) / (Math.PI * 2))
            const distance = R2I(radius * Math.PI * 2)
            const speed = this.speed || (distance / mobCount / radius) * 2

            let i = 0
            for (const [_, mob] of pairs(this.mobs.getAll())) {
                const targetPoint = PolarProjectionBJ(
                    triggerMobPoint,
                    radius,
                    (direction === 'ccw' ? 1 : -1) * ((360.0 / I2R(mobCount)) * I2R(i) + I2R(circleCounter) * speed)
                )

                const facingPoint = PolarProjectionBJ(
                    triggerMobPoint,
                    radius,
                    (direction === 'ccw' ? 1 : -1) *
                        ((360.0 / I2R(mobCount)) * I2R(i) + (I2R(circleCounter) * speed + 0.01))
                )

                mob.u && SetUnitPositionLocFacingLocBJ(mob.u, targetPoint, facingPoint)
                i++

                RemoveLocation(targetPoint)
                RemoveLocation(facingPoint)
            }

            RemoveLocation(triggerMobPoint)

            circleCounter++

            if (circleCounter > 360 / speed) {
                circleCounter = 0
            }
        })
    }

    toJson = () => {
        const blockMobIds: number[] = []

        for (const [_, monster] of pairs(this.mobs.getAll())) {
            arrayPush(blockMobIds, monster.id)
        }

        return {
            id: this.id,
            mainMobId: this.triggerMob.id,
            blockMobsIds: blockMobIds,
            speed: this.speed,
            direction: this.direction,
            radius: this.radius,
        }
    }
}
