import { Timer } from 'w3ts'
import { udg_monsters } from '../../../../globals'
import { Monster } from './Monster'
import { MonsterType } from './MonsterType'
import { NewImmobileMonster } from './Monster_functions'

export class MonsterNoMove extends Monster {
    x: number
    y: number
    private angle: number

    constructor(mt: MonsterType, x: number, y: number, angle: number, forceId: number | null = null) {
        super(mt, forceId)

        this.x = x
        this.y = y
        this.angle = angle
    }

    static count = () => {
        let n = 0

        for (const [_, monster] of pairs(udg_monsters)) {
            if (monster instanceof MonsterNoMove) {
                n++
            }
        }

        return n
    }

    createUnit = () => {
        super.createUnit(() =>
            this.mt ? NewImmobileMonster(this.mt, this.x, this.y, this.angle, !this.hasAttackGroundPos()) : undefined
        )

        this.wander()
    }

    private moveTimer: Timer | null = null
    private wanderTimer: Timer | null = null
    private wanderEffect: effect | null = null
    private initialWander = true

    removeUnit = () => {
        super.removeUnit()

        if (this.moveTimer) {
            this.moveTimer.destroy()
            this.moveTimer = null
        }

        if (this.wanderTimer) {
            this.wanderTimer.destroy()
            this.wanderTimer = null
        }

        if (this.wanderEffect) {
            DestroyEffect(this.wanderEffect)
            this.wanderEffect = null
        }
    }

    wander = () => {
        const targetUnit = this.u

        if (!this.level || !targetUnit || !this.mt) {
            return
        }

        if (!this.mt.isWanderable()) {
            return
        }

        const region = this.level.regions.getRegionAtWithFlag(this.x, this.y, 'wanderable')

        if (!region) {
            return
        }

        const createTimer = () => {
            this.moveTimer = new Timer().start(Math.random() * 5 + (this.initialWander ? 0 : 7), false, () => {
                if (this.initialWander) {
                    this.initialWander = false
                }

                if (this.wanderEffect) DestroyEffect(this.wanderEffect)
                this.wanderEffect = AddSpecialEffectTargetUnitBJ(
                    'overhead',
                    targetUnit,
                    'AbilitiesSpellsOtherTalkToMeTalkToMe.mdl'
                )

                this.wanderTimer = new Timer().start(Math.random() * 1.5 + 0.5, false, () => {
                    let targetPoint = region.getRandomPoint()

                    for (let i = 0; i < 20; i++) {
                        if (
                            distanceBetweenPoints(
                                GetUnitX(targetUnit),
                                GetUnitY(targetUnit),
                                targetPoint.x,
                                targetPoint.y
                            ) < 1200
                        ) {
                            break
                        }

                        if (targetPoint) targetPoint.__destroy()
                        targetPoint = region.getRandomPoint()
                    }

                    IssuePointOrder(targetUnit, 'move', targetPoint.x, targetPoint.y)

                    this.wanderEffect && DestroyEffect(this.wanderEffect)
                    this.wanderEffect = null

                    this.wanderTimer?.destroy()
                    this.wanderTimer = null

                    targetPoint.__destroy()
                })

                this.moveTimer?.destroy()
                this.moveTimer = null

                createTimer()
            })
        }

        createTimer()
    }

    toJson() {
        const output = super.toJson()
        if (output) {
            output['x'] = R2I(this.x)
            output['y'] = R2I(this.y)
            output['angle'] = R2I(this.angle)
        }
        return output
    }
}

const distanceBetweenPoints = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}
