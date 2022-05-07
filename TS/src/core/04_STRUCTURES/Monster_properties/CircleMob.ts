import {arrayPush, ForceAngleBetween0And360} from 'core/01_libraries/Basic_functions'
import { createTimer } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/Monster'
import { MonsterArray } from '../Monster/MonsterArray'
import {globals} from "../../../../globals";

const TIMER_PERIOD = 0.02
const DEFAULT_ROTATION_SPEED = 90


export class CircleMob {
    level?: Level

    private triggerMob: Monster
    private mobs = new MonsterArray()

    private rotationSpeed: number
    private direction: 'cw' | 'ccw'
    private radius: number
    private currentBaseAngle = 0

    id: number = -1

    private circleTimer: Timer | null = null

    constructor(triggerMob: Monster, rotationSpeed: number | null, direction: 'cw' | 'ccw' | null, radius: number) {
        this.triggerMob = triggerMob
        triggerMob.setCircleMob(this)

        this.rotationSpeed = rotationSpeed || DEFAULT_ROTATION_SPEED
        this.direction = direction || 'cw'
        this.radius = radius

        this.activate()
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

        this.getBlockMobs().forAll(monster => {
            monster.createUnit()
        })

        this.removeAllBlockMobs()

        this.circleTimer?.destroy()
        this.triggerMob.u && ShowUnit(this.triggerMob.u, true)

        this.level && this.level.circleMobs.removeCircleMob(this.id)
    }

    activate = () => {
        print("circle activate")
        this.circleTimer?.destroy()

        this.initialize()

        const directionReal = this.direction === 'ccw' ? 1 : -1

        this.circleTimer = createTimer(TIMER_PERIOD, true, () => {
            if (!this.triggerMob.u) {
                return
            }

            const centerX = GetUnitX(this.triggerMob.u)
            const centerY = GetUnitY(this.triggerMob.u)
            // const triggerMobPoint = GetUnitLoc(this.triggerMob.u)

            const mobCount = this.mobs.count()
            const angleDiff = 360.0 / I2R(mobCount)

            let angle = this.currentBaseAngle

            let i = 0
            for (const [_, mob] of pairs(this.mobs.getAll())) {
                if (mob.u) {
                    const unitX = centerX + this.radius * CosBJ(angle)
                    const unitY = centerY + this.radius * SinBJ(angle)

                    const facingAngle = angle + 90 * directionReal

                    if(globals.MAP_MIN_X <= unitX && globals.MAP_MAX_X >= unitX){
                        SetUnitX(mob.u, unitX)
                    }

                    if(globals.MAP_MIN_Y <= unitY && globals.MAP_MAX_Y >= unitY){
                        SetUnitY(mob.u, unitY)
                    }

                    BlzSetUnitFacingEx(mob.u, facingAngle)
                }

                angle += angleDiff
            }

            this.currentBaseAngle = ForceAngleBetween0And360(this.currentBaseAngle + directionReal * this.rotationSpeed * TIMER_PERIOD)
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
            rotationSpeed: this.rotationSpeed,
            direction: this.direction,
            radius: this.radius,
        }
    }
}
