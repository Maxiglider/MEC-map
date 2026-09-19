import { MemoryHandler } from 'Utils/MemoryHandler'
import { Constants } from 'core/01_libraries/Constants'
import { Text } from 'core/01_libraries/Text'
import { Round32 } from '../../01_libraries/Basic_functions'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { handlePaginationArgs, handlePaginationObj } from '../../06_COMMANDS/Helpers/Pagination'

const labelText = (label: string, alias: string) =>
    udg_colorCode[Constants.RED] + label + (alias !== '' ? ' ' + alias : '') + udg_colorCode[Constants.GREY] + ' : '

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

    toText = () =>
        labelText(this.label, this.alias) +
        `destructable('${this.destructableTypeId}') killRect(${this.killRectWidth} x ${this.killRectHeight})`

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

    toText = () => labelText(this.label, this.alias) + `item('${this.itemTypeId}')`

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()
        output['label'] = this.label
        output['alias'] = this.alias
        output['itemTypeId'] = this.itemTypeId
        return output
    }
}

/** The kinds of a map, in the order they were made (which is the order they are saved in) */
class TypeList<T extends { label: string; alias: string; toText: () => string; toJson: () => any }> {
    private types: T[] = []
    /** What they are, for the messages: "door", "key" */
    private kind: string

    constructor(kind: string) {
        this.kind = kind
    }

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

    /** -displayDoors / -displayKeys [<label>] [page] */
    displayPaginatedForPlayer = (p: player, cmd: string) => {
        const { searchTerms, pageNum } = handlePaginationArgs(cmd)
        const searchTerm = searchTerms.join(' ')

        if (searchTerm.length !== 0) {
            const type = this.getByLabel(searchTerm)
            type
                ? Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, type.toText())
                : Text.erP(p, `unknown ${this.kind}`)
            return
        }

        const pag = handlePaginationObj(this.types, pageNum)
        if (pag.cmds.length === 0) {
            Text.erP(p, `no ${this.kind} saved`)
            return
        }

        Text.P_timed(
            p,
            Constants.TERRAIN_DATA_DISPLAY_TIME,
            `|cff00ff00${this.kind === 'door' ? 'Doors' : 'Keys for doors'} (page |cff00ccff${pageNum}|r|cff00ff00/|cff00ccff${pag.totalPages}|r|cff00ff00)|r`
        )
        for (const l of pag.cmds) {
            Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, l)
        }
    }
}

export const doorTypes = new TypeList<DoorType>('door')
export const keyForDoorTypes = new TypeList<KeyForDoorType>('key')

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
