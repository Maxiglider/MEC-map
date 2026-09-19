import { Text } from '../../01_libraries/Text'
import type { Level } from '../Level/Level'
import { KEY_AND_DOOR_NEAR_DISTANCE, KeyAndDoor } from './KeyAndDoor'
import { DoorType, doorTypes, KeyForDoorType, keyForDoorTypes } from './KeyAndDoorTypes'

/** The key and door pairs of a level, by id */
export class KeyAndDoorArray {
    private level: Level
    private data: { [id: number]: KeyAndDoor } = {}

    constructor(level: Level) {
        this.level = level
    }

    /** In id order, the same on every machine */
    getAll = (): KeyAndDoor[] => {
        const all: KeyAndDoor[] = []
        for (const [_, kad] of pairs(this.data)) {
            all.push(kad)
        }
        return all.sort((a, b) => a.getId() - b.getId())
    }

    new = (keyAndDoor: KeyAndDoor, create: boolean) => {
        this.data[keyAndDoor.getId()] = keyAndDoor
        keyAndDoor.level = this.level
        create && keyAndDoor.create()
    }

    removeKeyAndDoor = (id: number) => {
        delete this.data[id]
    }

    /** The pair whose door or key is nearest to a point, near enough to be the one clicked */
    getNear = (x: number, y: number): KeyAndDoor | null => {
        let nearest: KeyAndDoor | null = null
        for (const kad of this.getAll()) {
            const d = kad.distanceTo(x, y)
            if (d <= KEY_AND_DOOR_NEAR_DISTANCE && (!nearest || d < nearest.distanceTo(x, y))) {
                nearest = kad
            }
        }
        return nearest
    }

    /** The pair whose key is that item */
    getByKeyItem = (keyItem: item): KeyAndDoor | null => this.getAll().find(kad => kad.getKeyItem() === keyItem) ?? null

    /** The pair whose door (or key) is nearest to a point, near enough to be the one clicked */
    getNearPart = (part: 'door' | 'key', x: number, y: number): KeyAndDoor | null => {
        const distance = (kad: KeyAndDoor) => (part === 'door' ? kad.distanceToDoor(x, y) : kad.distanceToKey(x, y))
        let nearest: KeyAndDoor | null = null
        for (const kad of this.getAll()) {
            const d = distance(kad)
            if (d <= KEY_AND_DOOR_NEAR_DISTANCE && (!nearest || d < distance(nearest))) {
                nearest = kad
            }
        }
        return nearest
    }

    getBetweenLocs = (x1: number, y1: number, x2: number, y2: number) =>
        this.getAll().filter(kad => kad.isBetweenLocs(x1, y1, x2, y2))

    activate = (activ: boolean) => {
        for (const kad of this.getAll()) {
            activ ? kad.create() : kad.remove()
        }
    }

    removeAllOfDoorType = (doorType: DoorType) => {
        let n = 0
        for (const kad of this.getAll()) {
            if (kad.doorType === doorType) {
                kad.destroy()
                n++
            }
        }
        return n
    }

    removeAllOfKeyType = (keyType: KeyForDoorType) => {
        let n = 0
        for (const kad of this.getAll()) {
            if (kad.keyType === keyType) {
                kad.destroy()
                n++
            }
        }
        return n
    }

    refreshAllOfDoorType = (doorType: DoorType) => {
        for (const kad of this.getAll()) {
            kad.doorType === doorType && kad.refresh()
        }
    }

    refreshAllOfKeyType = (keyType: KeyForDoorType) => {
        for (const kad of this.getAll()) {
            kad.keyType === keyType && kad.refresh()
        }
    }

    destroy = () => {
        for (const kad of this.getAll()) {
            kad.remove()
        }
        this.data = {}
    }

    toJson = () => this.getAll().map(kad => kad.toJson())

    /** The door standing exactly at a point (as it was made), to open it from a map's trigger */
    getDoorAt = (x: number, y: number): KeyAndDoor | null =>
        this.getAll().find(kad => kad.doorX === x && kad.doorY === y) ?? null

    newFromJson = (json: { [x: string]: any }[]) => {
        for (const k of json) {
            const doorType = doorTypes.getByLabel(k.doorTypeLabel)
            // a door without a key has none
            const keyType = k.keyForDoorTypeLabel ? keyForDoorTypes.getByLabel(k.keyForDoorTypeLabel) : null

            if (!doorType || (k.keyForDoorTypeLabel && !keyType)) {
                Text.erA(`key and door ${k.id}: unknown door "${k.doorTypeLabel}" or key "${k.keyForDoorTypeLabel}"`)
                continue
            }

            this.new(
                new KeyAndDoor(
                    doorType,
                    keyType ?? null,
                    k.doorX,
                    k.doorY,
                    k.doorAngle ?? -1,
                    k.keyX ?? 0,
                    k.keyY ?? 0,
                    k.id
                ),
                false
            )
        }
    }
}
