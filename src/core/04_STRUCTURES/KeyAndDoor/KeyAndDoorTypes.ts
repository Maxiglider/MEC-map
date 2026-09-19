import { MemoryHandler } from 'Utils/MemoryHandler'
import { Round32 } from '../../01_libraries/Basic_functions'

/**
 * A kind of door (-newDoor): the destructable it is, and the rect around it that kills a hero while it stands
 * closed, as a monster's killRectDimensions (width along the door, height across it, turned with its angle).
 */
export class DoorType {
    label: string
    alias: string
    destructableTypeId: string
    killRectWidth: number
    killRectHeight: number

    constructor(
        label: string,
        alias: string,
        destructableTypeId: string,
        killRectWidth: number,
        killRectHeight: number
    ) {
        this.label = label
        this.alias = alias
        this.destructableTypeId = destructableTypeId
        this.killRectWidth = Round32(killRectWidth)
        this.killRectHeight = Round32(killRectHeight)
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()
        output['label'] = this.label
        output['alias'] = this.alias
        output['destructableTypeId'] = this.destructableTypeId
        output['killRectWidth'] = this.killRectWidth
        output['killRectHeight'] = this.killRectHeight
        return output
    }
}

/** A kind of key (-newKeyForDoor): the item it is. A key opens the one door it was made with. */
export class KeyForDoorType {
    label: string
    alias: string
    itemTypeId: string

    constructor(label: string, alias: string, itemTypeId: string) {
        this.label = label
        this.alias = alias
        this.itemTypeId = itemTypeId
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()
        output['label'] = this.label
        output['alias'] = this.alias
        output['itemTypeId'] = this.itemTypeId
        return output
    }
}

/** The kinds of a map, in the order they were made (which is the order they are saved in) */
class TypeList<T extends { label: string; alias: string; toJson: () => any }> {
    private types: T[] = []

    add = (type: T) => {
        this.types.push(type)
        return type
    }

    getByLabel = (labelOrAlias: string): T | undefined =>
        this.types.find(t => t.label === labelOrAlias) ?? this.types.find(t => t.alias === labelOrAlias)

    isLabelOrAliasUsed = (labelOrAlias: string) =>
        this.types.some(t => t.label === labelOrAlias || t.alias === labelOrAlias)

    remove = (type: T) => {
        const index = this.types.indexOf(type)
        if (index === -1) return false
        this.types.splice(index, 1)
        return true
    }

    getAll = () => this.types

    clear = () => {
        this.types = []
    }

    toJson = () => this.types.map(t => t.toJson())
}

export const doorTypes = new TypeList<DoorType>()
export const keyForDoorTypes = new TypeList<KeyForDoorType>()

export const doorTypesFromJson = (json: { [x: string]: any }[]) => {
    for (const t of json) {
        doorTypes.add(new DoorType(t.label, t.alias ?? '', t.destructableTypeId, t.killRectWidth, t.killRectHeight))
    }
}

export const keyForDoorTypesFromJson = (json: { [x: string]: any }[]) => {
    for (const t of json) {
        keyForDoorTypes.add(new KeyForDoorType(t.label, t.alias ?? '', t.itemTypeId))
    }
}
