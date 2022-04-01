import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { udg_terrainTypes } from '../../../../globals'
import { Level } from '../Level/Level'

export const METEOR_NORMAL = FourCC('MND1')
export const METEOR_CHEAT = FourCC('MCD1')

export class Meteor {
    private x: number
    private y: number
    private meteor?: item
    level?: Level
    arrayId?: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    getItem() {
        return this.meteor
    }

    removeMeteor = () => {
        if (this.meteor) {
            RemoveItem(this.meteor)
        }
    }

    createMeteor = () => {
        if (this.meteor) {
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
        }
        this.level.meteors.setMeteorNull(this.arrayId)
    }

    replace = () => {
        this.meteor && SetItemPosition(this.meteor, this.x, this.y)
    }

    toString = (): string => {
        return I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
    }
}
