import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { Level } from '../Level/Level'

export const METEOR_NORMAL = FourCC('MND1')
export const METEOR_CHEAT = FourCC('MCD1')

export class Meteor {
    private x: number
    private y: number
    private meteor: item
    level: Level
    arrayId: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    getItem = (): item => {
        return this.meteor
    }

    removeMeteor = () => {
        if (this.meteor !== null) {
            RemoveItem(this.meteor)
            this.meteor = null
        }
    }

    createMeteor = () => {
        if (this.meteor !== null) {
            this.removeMeteor()
        }
        this.meteor = CreateItem(METEOR_NORMAL, this.x, this.y)
        if (udg_terrainTypes.getTerrainType(this.x, this.y).getKind() == 'slide') {
            SetItemDroppable(this.meteor, false)
        }
        SetItemUserData(this.meteor, integer(this))
    }

    destroy = () => {
        if (this.meteor !== null) {
            this.removeMeteor()
            this.meteor = null
        }
        this.level.meteors.setMeteorNull(this.arrayId)
    }

    replace = () => {
        SetItemPosition(this.meteor, this.x, this.y)
    }

    toString = (): string => {
        return I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
    }
}
