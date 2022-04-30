import { Text } from 'core/01_libraries/Text'
import { BaseArray } from '../BaseArray'
import type { Level } from '../Level/Level'
import type { Monster } from '../Monster/Monster'
import { MONSTER_NEAR_DIFF_MAX } from '../Monster/MonsterArray'
import { CircleMob } from './CircleMob'

export class CircleMobArray extends BaseArray<CircleMob> {
    private level: Level

    constructor(level: Level) {
        super(true)
        this.level = level
    }

    new = (triggerMob: Monster, speed: number | null, direction: string | null, radius: number | null): CircleMob => {
        if (triggerMob.getCircleMob()) {
            throw 'Monster is already a circle'
        }

        const circleMob = new CircleMob(triggerMob, speed, direction, radius)

        circleMob.level = this.level

        const id = this._new(circleMob)
        circleMob.id = id

        return circleMob
    }

    newFromJson = (circleMobsJson: { [x: string]: any }[]) => {
        for (let cm of circleMobsJson) {
            const mt = this.level.monsters.get(cm.triggerMobId)

            if (!mt) {
                Text.erA(`Monster label "${cm.triggerMobId}" unknown`)
            } else {
                const circleMob = this.new(mt, cm.speed, cm.direction, cm.radius)

                for (const [_, blockMobId] of pairs(cm.blockMobsIds)) {
                    const mt = this.level.monsters.get(blockMobId)

                    if (!mt) {
                        Text.erA(`Monster label "${cm.blockMobsIds}" unknown`)
                    } else {
                        circleMob.addBlockMob(mt)
                    }
                }
            }
        }
    }

    removeCircleMob = (circleMobArrayId: number) => {
        delete this.data[circleMobArrayId]
    }

    circleCircleMob = (circleMobId: number): boolean => {
        if (this.data[circleMobId]) {
            this.data[circleMobId].destroy()
            delete this.data[circleMobId]
            return true
        } else {
            return false
        }
    }

    getCircleMobNear(x: number, y: number) {
        let xMob: number
        let yMob: number
        let i = 0

        while (i <= this.lastInstanceId) {
            if (this.data[i]) {
                const unit = this.data[i].getTriggerMob().u

                if (unit) {
                    xMob = GetUnitX(unit)
                    yMob = GetUnitY(unit)
                    if (RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX) {
                        return this.data[i]
                    }
                }
            }
            i++
        }

        return null
    }

    initializeCircleMobs = () => {
        for (const [_, circleMob] of pairs(this.data)) {
            circleMob.initialize()
        }
    }

    closeCircleMobs = () => {
        for (const [_, circleMob] of pairs(this.data)) {
            circleMob.close()
        }
    }
}
