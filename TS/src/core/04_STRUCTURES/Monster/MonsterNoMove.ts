import { udg_monsters } from '../../../../globals'
import { Monster } from './Monster'
import { MonsterType } from './MonsterType'
import { NewImmobileMonster } from './Monster_functions'

export class MonsterNoMove extends Monster {
    private x: number
    private y: number
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
        super.createUnit(() => (this.mt ? NewImmobileMonster(this.mt, this.x, this.y, this.angle) : undefined))
    }

    toJson() {
        if (super.toJson()) {
            return {
                ...super.toJson(),
                x: R2I(this.x),
                y: R2I(this.y),
                angle: R2I(this.angle)
            }
        } else {
            return false
        }
    }
}
