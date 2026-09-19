import { getUdgLevels } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { Text } from '../../01_libraries/Text'
import { DoorType, doorTypes, KeyForDoorType, keyForDoorTypes } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import type { Level } from '../../04_STRUCTURES/Level/Level'
import { USAGE } from '../Helpers/Command_functions'

/** Whether a destructable type exists: made and removed at once */
const isDestructableType = (id: string) => {
    if (id.length !== 4) return false
    const d = CreateDestructable(FourCC(id), 0, 0, 0, 1, 0)
    if (!d) return false
    RemoveDestructable(d)
    return true
}

/** Whether an item type exists: made and removed at once */
const isItemType = (id: string) => {
    if (id.length !== 4) return false
    const i = CreateItem(FourCC(id), 0, 0)
    if (!i) return false
    RemoveItem(i)
    return true
}

const isLabelFree = (labelOrAlias: string) =>
    !doorTypes.isLabelOrAliasUsed(labelOrAlias) && !keyForDoorTypes.isLabelOrAliasUsed(labelOrAlias)

const forAllLevels = (cb: (level: Level) => void) => {
    getUdgLevels().forAll(level => cb(level))
}

export const initExecuteCommandMake_doors = () => {
    const { registerCommand } = ServiceManager.getService('Cmd')
    const group = 'make'

    //-newDoor(newdr) <label> <alias> <destructibleTypeId> <killRectWidth> <killRectHeight>
    registerCommand({
        name: 'newDoor',
        alias: ['newdr'],
        group,
        argDescription: '<label> <alias> <destructibleTypeId> <killRectWidth> <killRectHeight>',
        description:
            'Add a kind of door: a destructible (a gate), and the rect around it that kills a hero while it stands closed (width along the door, height across it)',
        cb: ({ nbParam, param1, param2, param3, param4, param5 }, escaper) => {
            if (nbParam !== 5) {
                return USAGE
            }
            if (!isLabelFree(param1) || !isLabelFree(param2)) {
                Text.erP(escaper.getPlayer(), 'label or alias already used by a door or a key')
                return true
            }
            if (!isDestructableType(param3)) {
                Text.erP(escaper.getPlayer(), `unknown destructible type "${param3}"`)
                return true
            }
            const width = S2I(param4)
            const height = S2I(param5)
            if (width < 32 || height < 32) {
                Text.erP(escaper.getPlayer(), 'the kill rectangle dimensions have to be minimum 32x32')
                return true
            }

            doorTypes.add(new DoorType(param1, param2, param3, width, height))
            Text.mkP(escaper.getPlayer(), `door "${param1}" added`)
            return true
        },
    })

    //-newKeyForDoor(newkfd) <label> <alias> <itemTypeId>
    registerCommand({
        name: 'newKeyForDoor',
        alias: ['newkfd'],
        group,
        argDescription: '<label> <alias> <itemTypeId>',
        description: 'Add a kind of key: the item a hero carries to its door to open it',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam !== 3) {
                return USAGE
            }
            if (!isLabelFree(param1) || !isLabelFree(param2)) {
                Text.erP(escaper.getPlayer(), 'label or alias already used by a door or a key')
                return true
            }
            if (!isItemType(param3)) {
                Text.erP(escaper.getPlayer(), `unknown item type "${param3}"`)
                return true
            }

            keyForDoorTypes.add(new KeyForDoorType(param1, param2, param3))
            Text.mkP(escaper.getPlayer(), `key "${param1}" added`)
            return true
        },
    })

    //-displayDoors(ddr) [<doorLabel>] [page]
    registerCommand({
        name: 'displayDoors',
        alias: ['ddr'],
        group,
        argDescription: '[<doorLabel>] [page]',
        description: 'Displays the kinds of doors (-newDoor): destructable and kill rect',
        cb: ({ cmd }, escaper) => {
            doorTypes.displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-displayKeys(dk) [<keyForDoorLabel>] [page]
    registerCommand({
        name: 'displayKeys',
        alias: ['dk'],
        group,
        argDescription: '[<keyForDoorLabel>] [page]',
        description: 'Displays the kinds of keys for doors (-newKeyForDoor): their item',
        cb: ({ cmd }, escaper) => {
            keyForDoorTypes.displayPaginatedForPlayer(escaper.getPlayer(), cmd)
            return true
        },
    })

    //-createDoorAndKey(crdak) <doorLabel> <keyForDoorLabel> [<doorAngle>]   --> random angles if not specified
    registerCommand({
        name: 'createDoorAndKey',
        alias: ['crdak'],
        group,
        argDescription: '<doorLabel> <keyForDoorLabel> [<doorAngle>]',
        description:
            'Place doors and their keys: a first click for the door, a second for its key. The door faces the angle given, or a random one',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam < 2 || nbParam > 3) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            const keyType = keyForDoorTypes.getByLabel(param2)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }
            if (!keyType) {
                Text.erP(escaper.getPlayer(), `unknown key "${param2}"`)
                return true
            }

            let doorAngle = -1
            if (nbParam === 3) {
                if (S2R(param3) === 0 && param3 !== '0') {
                    Text.erP(escaper.getPlayer(), 'wrong angle value ; should be a real (-1 for random angle)')
                    return true
                }
                doorAngle = S2R(param3)
            }

            escaper.makeCreateKeyAndDoor(doorType, keyType, doorAngle)
            Text.mkP(escaper.getPlayer(), 'key and door making on: click where the door goes')
            return true
        },
    })

    //-createDoor(crd) <doorLabel> [<doorAngle>]   --> random angles if not specified
    registerCommand({
        name: 'createDoor',
        alias: ['crd'],
        group,
        argDescription: '<doorLabel> [<doorAngle>]',
        description:
            'Place doors without a key, one per click until -stop: they stay closed until a map trigger opens them. The door faces the angle given, or a random one',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }

            let doorAngle = -1
            if (nbParam === 2) {
                if (S2R(param2) === 0 && param2 !== '0') {
                    Text.erP(escaper.getPlayer(), 'wrong angle value ; should be a real (-1 for random angle)')
                    return true
                }
                doorAngle = S2R(param2)
            }

            escaper.makeCreateDoor(doorType, doorAngle)
            Text.mkP(escaper.getPlayer(), 'door making on: click where each door goes, -stop to end')
            return true
        },
    })

    //-moveDoor(mvdr)   --> click a door, then where it goes
    registerCommand({
        name: 'moveDoor',
        alias: ['mvdr'],
        group,
        argDescription: '',
        description: 'Move doors: click a door, then where it goes (its key stays where it is), until -stop',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return USAGE
            }
            escaper.makeMoveKeyOrDoor('door')
            Text.mkP(escaper.getPlayer(), 'door moving on: click a door')
            return true
        },
    })

    //-moveKey(mvk)   --> click a key, then where it goes
    registerCommand({
        name: 'moveKey',
        alias: ['mvk'],
        group,
        argDescription: '',
        description: 'Move the keys of doors: click a key, then where it goes, until -stop',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return USAGE
            }
            escaper.makeMoveKeyOrDoor('key')
            Text.mkP(escaper.getPlayer(), 'key moving on: click a key')
            return true
        },
    })

    //-deleteKeyAndDoor(delkad)   --> click a door or its key
    registerCommand({
        name: 'deleteKeyAndDoor',
        alias: ['delkad'],
        group,
        argDescription: '',
        description: 'Delete a door and its key (if it has one) by clicking one of them',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return USAGE
            }
            escaper.makeDeleteKeyAndDoor('oneByOne')
            Text.mkP(escaper.getPlayer(), 'key and door deleting on')
            return true
        },
    })

    //-deleteKeyAndDoorBetweenPoints(delkadbp)   --> two clicks
    registerCommand({
        name: 'deleteKeyAndDoorBetweenPoints',
        alias: ['delkadbp'],
        group,
        argDescription: '',
        description:
            'Delete the doors and keys between two clicked points (a door or its key between them deletes both)',
        cb: ({ noParam }, escaper) => {
            if (!noParam) {
                return USAGE
            }
            escaper.makeDeleteKeyAndDoor('twoClics')
            Text.mkP(escaper.getPlayer(), 'key and door deleting on: click the two corners')
            return true
        },
    })

    //-removeKeyForDoor(remkfd) <keyForDoorLabel>
    registerCommand({
        name: 'removeKeyForDoor',
        alias: ['remkfd'],
        group,
        argDescription: '<keyForDoorLabel>',
        description: 'Remove a kind of key, and every door and key made with it in every level',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }
            const keyType = keyForDoorTypes.getByLabel(param1)
            if (!keyType) {
                Text.erP(escaper.getPlayer(), `unknown key "${param1}"`)
                return true
            }

            let n = 0
            forAllLevels(level => (n += level.keyAndDoors.removeAllOfKeyType(keyType)))
            keyForDoorTypes.remove(keyType)
            Text.mkP(escaper.getPlayer(), `key "${param1}" removed, with ${n} key(s) and door(s)`)
            return true
        },
    })

    //-removeDoor(remd) <doorLabel>
    registerCommand({
        name: 'removeDoor',
        alias: ['remd'],
        group,
        argDescription: '<doorLabel>',
        description: 'Remove a kind of door, and every door and key made with it in every level',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }

            let n = 0
            forAllLevels(level => (n += level.keyAndDoors.removeAllOfDoorType(doorType)))
            doorTypes.remove(doorType)
            Text.mkP(escaper.getPlayer(), `door "${param1}" removed, with ${n} key(s) and door(s)`)
            return true
        },
    })

    //-changeKeyForDoorItem(chkfdi) <keyForDoorLabel> <itemTypeId>
    registerCommand({
        name: 'changeKeyForDoorItem',
        alias: ['chkfdi'],
        group,
        argDescription: '<keyForDoorLabel> <itemTypeId>',
        description: 'Change the item of a kind of key',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }
            const keyType = keyForDoorTypes.getByLabel(param1)
            if (!keyType) {
                Text.erP(escaper.getPlayer(), `unknown key "${param1}"`)
                return true
            }
            if (!isItemType(param2)) {
                Text.erP(escaper.getPlayer(), `unknown item type "${param2}"`)
                return true
            }

            keyType.itemTypeId = param2
            forAllLevels(level => level.keyAndDoors.refreshAllOfKeyType(keyType))
            Text.mkP(escaper.getPlayer(), `key "${param1}" item changed`)
            return true
        },
    })

    //-changeDoorDestructible(chdd) <doorLabel> <destructibleTypeId>
    registerCommand({
        name: 'changeDoorDestructible',
        alias: ['chdd'],
        group,
        argDescription: '<doorLabel> <destructibleTypeId>',
        description: 'Change the destructible of a kind of door',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }
            if (!isDestructableType(param2)) {
                Text.erP(escaper.getPlayer(), `unknown destructible type "${param2}"`)
                return true
            }

            doorType.destructableTypeId = param2
            forAllLevels(level => level.keyAndDoors.refreshAllOfDoorType(doorType))
            Text.mkP(escaper.getPlayer(), `door "${param1}" destructible changed`)
            return true
        },
    })

    //-setDoorKillRect(setdkr) <doorLabel> <width> <height>
    registerCommand({
        name: 'setDoorKillRect',
        alias: ['setdkr'],
        group,
        argDescription: '<doorLabel> <width> <height>',
        description: 'Change the kill rect of a kind of door (width along the door, height across it)',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            if (nbParam !== 3) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }
            const width = S2I(param2)
            const height = S2I(param3)
            if (width < 32 || height < 32) {
                Text.erP(escaper.getPlayer(), 'the kill rectangle dimensions have to be minimum 32x32')
                return true
            }

            const replaced = new DoorType(doorType.label, doorType.alias, doorType.destructableTypeId, width, height)
            doorType.killRectWidth = replaced.killRectWidth
            doorType.killRectHeight = replaced.killRectHeight
            forAllLevels(level => level.keyAndDoors.refreshAllOfDoorType(doorType))
            Text.mkP(escaper.getPlayer(), `door "${param1}" kill rect changed`)
            return true
        },
    })
}
