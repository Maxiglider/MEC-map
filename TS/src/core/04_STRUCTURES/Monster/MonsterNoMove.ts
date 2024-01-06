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
