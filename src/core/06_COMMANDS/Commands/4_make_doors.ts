import { getUdgLevels } from '../../../../globals'
import { ServiceManager } from '../../../Services'
import { Text } from '../../01_libraries/Text'
import { DoorType, doorTypes, KeyForDoorType, keyForDoorTypes } from '../../04_STRUCTURES/KeyAndDoor/KeyAndDoorTypes'
import type { Level } from '../../04_STRUCTURES/Level/Level'
import { countInLevels, FORCE_FLAG, USAGE } from '../Helpers/Command_functions'

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

    //-newDoor(newdr) <label> <destructibleTypeId> [<killRectWidth> <killRectHeight>]
    registerCommand({
        name: 'newDoor',
        alias: ['newdr'],
        group,
        argDescription: '<label> <destructibleTypeId> [<killRectWidth> <killRectHeight>]',
        description:
            "Add a kind of door: a destructible (a gate), and the rect around it that kills a hero while it stands closed (width along the door, height across it). Without dimensions, each door's kill rect is where it blocks the ground (its pathing)",
        cb: ({ nbParam, param1, param2, param3, param4 }, escaper) => {
            if (nbParam !== 2 && nbParam !== 4) {
                return USAGE
            }
            if (!isLabelFree(param1)) {
                Text.erP(escaper.getPlayer(), 'label already used by a door or a key')
                return true
            }
            if (!isDestructableType(param2)) {
                Text.erP(escaper.getPlayer(), `unknown destructible type "${param2}"`)
                return true
            }
            const width = nbParam === 4 ? S2I(param3) : null
            const height = nbParam === 4 ? S2I(param4) : null
            if (width !== null && height !== null && (width < 32 || height < 32)) {
                Text.erP(escaper.getPlayer(), 'the kill rectangle dimensions have to be minimum 32x32')
                return true
            }

            doorTypes.add(new DoorType(param1, '', param2, width, height))
            Text.mkP(escaper.getPlayer(), `door "${param1}" added`)
            return true
        },
    })

    //-newKeyForDoor(newkfd) <label> <itemTypeId>
    registerCommand({
        name: 'newKeyForDoor',
        alias: ['newkfd'],
        group,
        argDescription: '<label> <itemTypeId>',
        description: 'Add a kind of key: the item a hero carries to its door to open it',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }
            if (!isLabelFree(param1)) {
                Text.erP(escaper.getPlayer(), 'label already used by a door or a key')
                return true
            }
            if (!isItemType(param2)) {
                Text.erP(escaper.getPlayer(), `unknown item type "${param2}"`)
                return true
            }

            keyForDoorTypes.add(new KeyForDoorType(param1, '', param2))
            Text.mkP(escaper.getPlayer(), `key "${param1}" added`)
            return true
        },
    })

    //-setDoorAlias(setdra) <doorLabel> <alias>
    registerCommand({
        name: 'setDoorAlias',
        alias: ['setdra'],
        group,
        argDescription: '<doorLabel> <alias>',
        description: 'Change the alias of a kind of door',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }
            if (!isLabelFree(param2)) {
                Text.erP(escaper.getPlayer(), 'alias already used by a door or a key')
                return true
            }

            doorType.alias = param2
            Text.mkP(escaper.getPlayer(), 'alias changed to "' + param2 + '"')
            return true
        },
    })

    //-setKeyForDoorAlias(setkfda) <keyForDoorLabel> <alias>
    registerCommand({
        name: 'setKeyForDoorAlias',
        alias: ['setkfda'],
        group,
        argDescription: '<keyForDoorLabel> <alias>',
        description: 'Change the alias of a kind of key',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
                return USAGE
            }
            const keyType = keyForDoorTypes.getByLabel(param1)
            if (!keyType) {
                Text.erP(escaper.getPlayer(), `unknown key "${param1}"`)
                return true
            }
            if (!isLabelFree(param2)) {
                Text.erP(escaper.getPlayer(), 'alias already used by a door or a key')
                return true
            }

            keyType.alias = param2
            Text.mkP(escaper.getPlayer(), 'alias changed to "' + param2 + '"')
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

    //-createDoorAndKey(crdak) <doorLabel> <keyForDoorLabel>
    registerCommand({
        name: 'createDoorAndKey',
        alias: ['crdak'],
        group,
        argDescription: '<doorLabel> <keyForDoorLabel>',
        description: 'Place doors and their keys: a first click for the door, a second for its key',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam !== 2) {
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

            escaper.makeCreateKeyAndDoor(doorType, keyType)
            Text.mkP(escaper.getPlayer(), 'key and door making on: click where the door goes')
            return true
        },
    })

    //-createDoor(crd) <doorLabel>
    registerCommand({
        name: 'createDoor',
        alias: ['crd'],
        group,
        argDescription: '<doorLabel>',
        description:
            'Place doors without a key, one per click until -stop: they stay closed until a map trigger opens them',
        cb: ({ nbParam, param1 }, escaper) => {
            if (nbParam !== 1) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }

            escaper.makeCreateDoor(doorType)
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

    //-removeKeyForDoor(remkfd) <keyForDoorLabel> [--force]
    registerCommand({
        name: 'removeKeyForDoor',
        alias: ['remkfd'],
        group,
        argDescription: '<keyForDoorLabel> [--force]',
        description: 'Removes a kind of key. --force also removes every door and key made with it, in every level',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2 || (nbParam === 2 && param2 !== FORCE_FLAG)) {
                return USAGE
            }
            const keyType = keyForDoorTypes.getByLabel(param1)
            if (!keyType) {
                Text.erP(escaper.getPlayer(), `unknown key "${param1}"`)
                return true
            }

            const usage = countInLevels(level => level.keyAndDoors.countAllOfKeyType(keyType))
            if (usage.count > 0 && nbParam !== 2) {
                Text.erP(
                    escaper.getPlayer(),
                    `key "${param1}" is used by ${usage.count} key(s) and door(s) in ${usage.levels} - add ${FORCE_FLAG} to remove it and them`
                )
                return true
            }

            forAllLevels(level => level.keyAndDoors.removeAllOfKeyType(keyType))
            keyForDoorTypes.remove(keyType)
            Text.mkP(escaper.getPlayer(), `key "${param1}" removed, with ${usage.count} key(s) and door(s)`)
            return true
        },
    })

    //-removeDoor(remd) <doorLabel> [--force]
    registerCommand({
        name: 'removeDoor',
        alias: ['remd'],
        group,
        argDescription: '<doorLabel> [--force]',
        description: 'Remove a kind of door. --force also removes every door and key made with it, in every level',
        cb: ({ nbParam, param1, param2 }, escaper) => {
            if (nbParam < 1 || nbParam > 2 || (nbParam === 2 && param2 !== FORCE_FLAG)) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }

            const usage = countInLevels(level => level.keyAndDoors.countAllOfDoorType(doorType))
            if (usage.count > 0 && nbParam !== 2) {
                Text.erP(
                    escaper.getPlayer(),
                    `door "${param1}" is used by ${usage.count} key(s) and door(s) in ${usage.levels} - add ${FORCE_FLAG} to remove it and them`
                )
                return true
            }

            forAllLevels(level => level.keyAndDoors.removeAllOfDoorType(doorType))
            doorTypes.remove(doorType)
            Text.mkP(escaper.getPlayer(), `door "${param1}" removed, with ${usage.count} key(s) and door(s)`)
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

    //-setDoorKillRectDimensions(setdkrd) <doorLabel> <width> <height> | auto
    registerCommand({
        name: 'setDoorKillRectDimensions',
        alias: ['setdkrd'],
        group,
        argDescription: '<doorLabel> <width> <height> | auto',
        description:
            'Sets the kill rectangle dimensions of a kind of door (width along the door, height across it), or "auto": each door\'s kill rect is where it blocks the ground (its pathing)',
        cb: ({ nbParam, param1, param2, param3 }, escaper) => {
            const isAuto = nbParam === 2 && param2 === 'auto'
            if (nbParam !== 3 && !isAuto) {
                return USAGE
            }
            const doorType = doorTypes.getByLabel(param1)
            if (!doorType) {
                Text.erP(escaper.getPlayer(), `unknown door "${param1}"`)
                return true
            }

            if (isAuto) {
                doorType.setKillRectDimensions(null, null)
            } else {
                const width = S2I(param2)
                const height = S2I(param3)
                if (width < 32 || height < 32) {
                    Text.erP(escaper.getPlayer(), 'the kill rectangle dimensions have to be minimum 32x32')
                    return true
                }
                doorType.setKillRectDimensions(width, height)
            }

            forAllLevels(level => level.keyAndDoors.refreshAllOfDoorType(doorType))
            Text.mkP(
                escaper.getPlayer(),
                isAuto
                    ? "kill rectangle of this kind of door measured from each door's pathing"
                    : 'kill rectangle dimensions changed for this kind of door'
            )
            return true
        },
    })
}
