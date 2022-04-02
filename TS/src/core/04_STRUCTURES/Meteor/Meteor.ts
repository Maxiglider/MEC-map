import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { udg_terrainTypes } from '../../../../globals'
import { Level } from '../Level/Level'

export const METEOR_NORMAL = FourCC('MND1')
export const METEOR_CHEAT = FourCC('MCD1')

export const udg_meteors: Meteor[] = []


export class Meteor {
    private id: number
    private x: number
    private y: number
    private item?: item
    level?: Level
    arrayId?: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y

        this.id = udg_meteors.length
        udg_meteors[this.id] = this
    }

    getId(){
        return this.id
    }

    getItem() {
        return this.item
    }

    removeMeteorItem = () => {
        if (this.item) {
            RemoveItem(this.item)
        }
    }

    createMeteorItem = () => {
        if (this.item) {
            this.removeMeteorItem()
        }

        this.item = CreateItem(METEOR_NORMAL, this.x, this.y)
        if (udg_terrainTypes.getTerrainType(this.x, this.y).getKind() == 'slide') {
            SetItemDroppable(this.item, false)
        }
        SetItemUserData(this.item, this.id)
    }

    destroy = () => {
        if (this.item !== null) {
            this.removeMeteorItem()
        }

        this.level && this.level.meteors.removeMeteor(this.id)

        delete udg_meteors[this.id]
    }

    replace = () => {
        this.item && SetItemPosition(this.item, this.x, this.y)
    }

    toString = (): string => {
        return I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
    }
}
