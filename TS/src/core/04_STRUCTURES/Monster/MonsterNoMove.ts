import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import {Monster, udg_monsters} from './Monster'
import {MonsterType} from "./MonsterType";
import {NewImmobileMonster} from "./Monster_creation_functions";

export class MonsterNoMove extends Monster {
    private x: number
    private y: number
    private angle: number

    constructor(mt: MonsterType, x: number, y: number, angle: number) {
        super(mt)

        this.x = x
        this.y = y
        this.angle = angle
    }

    static count = (): number => {
        return udg_monsters.filter(monster => monster instanceof MonsterNoMove).length
    }

    createUnit() {
        super.createUnit(() => (
            NewImmobileMonster(this.mt, this.x, this.y, this.angle)
        ))
    }

    toString(){
        let str = super.toString()
        str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
        str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.angle))
        return str
    }

    destroy(){
        this.level && this.level.monstersNoMove.setMonsterNull(this.id)
        super.destroy()
    }
}
