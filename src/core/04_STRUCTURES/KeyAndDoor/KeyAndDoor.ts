import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgEscapers } from '../../../../globals'
import { Constants } from '../../01_libraries/Constants'
import type { Level } from '../Level/Level'
import { DoorType, KeyForDoorType } from './KeyAndDoorTypes'

/**
 * How near to its door a hero carrying the key opens it: measured from the door itself (its kill rect), so from its
 * long side along the door, and from its nearest corner past its ends - not from its centre
 */
export const DOOR_OPEN_DISTANCE = 128 * 3
/** How near to a door or a key a click picks it (to delete it) */
export const KEY_AND_DOOR_NEAR_DISTANCE = 128
const CHECK_PERIOD = 0.05

type Rect = { minX: number; minY: number; maxX: number; maxY: number }
const inside = (r: Rect, x: number, y: number) => x >= r.minX && x <= r.maxX && y >= r.minY && y <= r.maxY
/** From a point to the nearest point of a rect, 0 inside it */
const distanceToRect = (r: Rect, x: number, y: number) => {
    const dx = Math.max(r.minX - x, 0, x - r.maxX)
    const dy = Math.max(r.minY - y, 0, y - r.maxY)
    return SquareRoot(dx * dx + dy * dy)
}

/** The key and door pairs standing on the map, by id: gone through in id order, the same on every machine */
const standing: { [id: number]: KeyAndDoor } = {}
let checkTimer: timer | null = null

const checkAll = () => {
    const ids: number[] = []
    for (const [id] of pairs(standing)) {
        ids.push(id)
    }
    ids.sort((a, b) => a - b)
    for (const id of ids) {
        standing[id]?.check()
    }
}

let lastId = 0

/**
 * A door and the one key that opens it, as the old Polar Escape maps had them. The key is an item a hero picks up
 * and carries; carried near its door, it opens it (the door's opening animation, as a gate) and is used up. A
 * hero who dies carrying it drops it back where it was. While the door stands closed, its kill rect kills the
 * heroes in it, and the door blocks the way as any gate does. Both are made again, the door closed and the key in
 * place, each time the level starts.
 *
 * A door can also have no key (-createDoor): it stands closed until something opens it, a map's trigger say
 * (open()).
 *
 * Heroes are read from their units, which every machine places alike, and gone through by id.
 */
export class KeyAndDoor {
    private id: number
    level?: Level

    doorType: DoorType
    /** null for a door without a key */
    keyType: KeyForDoorType | null
    doorX: number
    doorY: number
    /** -1 for a random angle, drawn each time the door is made */
    doorAngle: number
    keyX: number
    keyY: number

    private door: destructable | null = null
    private key: item | null = null
    private killRect: Rect | null = null
    private opened = false
    /** The escaper carrying the key, shown in its hand as a meteor is */
    private carrierId: number | null = null

    constructor(
        doorType: DoorType,
        keyType: KeyForDoorType | null,
        doorX: number,
        doorY: number,
        doorAngle: number,
        keyX: number,
        keyY: number,
        forceId: number | null = null
    ) {
        this.id = forceId ?? ++lastId
        lastId = Math.max(lastId, this.id)
        this.doorType = doorType
        this.keyType = keyType
        this.doorX = doorX
        this.doorY = doorY
        this.doorAngle = doorAngle
        this.keyX = keyX
        this.keyY = keyY
    }

    getId = () => this.id

    isOnMap = () => this.door !== null

    create = () => {
        this.remove()

        const angle = this.doorAngle === -1 ? GetRandomReal(0, 360) : this.doorAngle
        this.door =
            CreateDestructable(FourCC(this.doorType.destructableTypeId), this.doorX, this.doorY, angle, 1, 0) ?? null
        this.key = this.keyType ? (CreateItem(FourCC(this.keyType.itemTypeId), this.keyX, this.keyY) ?? null) : null
        this.opened = false

        // the kill rect turned with the door, as a monster's: width along it, height across it
        const rounded = (Math.round(angle / 90) * 90) % 360
        const alongX = rounded % 180 === 0
        const halfX = (alongX ? this.doorType.killRectHeight : this.doorType.killRectWidth) / 2
        const halfY = (alongX ? this.doorType.killRectWidth : this.doorType.killRectHeight) / 2
        this.killRect = {
            minX: this.doorX - halfX,
            minY: this.doorY - halfY,
            maxX: this.doorX + halfX,
            maxY: this.doorY + halfY,
        }

        standing[this.id] = this
        if (!checkTimer) {
            checkTimer = CreateTimer()
            TimerStart(checkTimer, CHECK_PERIOD, true, checkAll)
        }
    }

    /** The key in the hand of the one carrying it, as a meteor: the key item's own model */
    private setCarrier = (escaperId: number | null) => {
        if (escaperId === this.carrierId) return

        const escapers = getUdgEscapers()
        this.carrierId !== null && escapers.get(this.carrierId)?.removeEffectMeteor()
        this.carrierId = escaperId

        if (escaperId !== null && this.key) {
            const model = BlzGetItemStringField(this.key, ITEM_SF_MODEL_USED)
            model && escapers.get(escaperId)?.addEffectMeteor(model)
        }
    }

    remove = () => {
        this.setCarrier(null)
        this.door && RemoveDestructable(this.door)
        this.key && RemoveItem(this.key)
        this.door = null
        this.key = null
        this.killRect = null
        delete standing[this.id]
    }

    /** Made again with what its types say now (after a type changed) */
    refresh = () => {
        this.isOnMap() && this.create()
    }

    isOpened = () => this.opened

    /** The rect killing heroes while the door stands closed (-debugRegions draws it), null once opened or off the map */
    getKillRect = () => (this.opened ? null : this.killRect)

    /** Opens the door as a gate opens (its key, if any, used up): from its key, or from a map's trigger */
    open = () => {
        if (!this.door || this.opened) return

        ModifyGateBJ(bj_GATEOPERATION_OPEN, this.door)
        this.setCarrier(null)
        this.key && RemoveItem(this.key)
        this.key = null
        this.opened = true
        this.level?.updateDebugRegions()

        const sound = CreateSound('Sound\\Interface\\BattleNetDoorsStereo2.wav', false, true, true, 10, 10, 'SpellsEAX')
        if (sound) {
            SetSoundParamsFromLabel(sound, 'GlueScreenBNetSlam')
            SetSoundPosition(sound, this.doorX, this.doorY, 0)
            StartSound(sound)
            KillSoundWhenDone(sound)
        }
    }

    check = () => {
        if (this.opened || !this.door || !this.killRect) {
            return
        }

        const escapers = getUdgEscapers()

        // the key: in the hand of its carrier, back where it was when its carrier died, and its door opened when
        // brought near it
        if (this.key) {
            let carrierId: number | null = null
            for (let id = 0; id < Constants.NB_ESCAPERS; id++) {
                const escaper = escapers.get(id)
                const hero = escaper?.getHero()
                if (!escaper || !hero || !UnitHasItem(hero, this.key)) continue

                if (!escaper.isAlive()) {
                    SetItemPosition(this.key, this.keyX, this.keyY)
                } else if (distanceToRect(this.killRect, GetUnitX(hero), GetUnitY(hero)) <= DOOR_OPEN_DISTANCE) {
                    this.open()
                    return
                } else {
                    carrierId = id
                }
            }
            this.setCarrier(carrierId)
        }

        // the closed door kills the heroes in its kill rect
        for (let id = 0; id < Constants.NB_ESCAPERS; id++) {
            const escaper = escapers.get(id)
            const hero = escaper?.getHero()
            if (
                escaper &&
                hero &&
                escaper.isAlive() &&
                !escaper.isGodModeOn() &&
                inside(this.killRect, GetUnitX(hero), GetUnitY(hero))
            ) {
                escaper.kill()
            }
        }
    }

    distanceToDoor = (x: number, y: number) =>
        SquareRoot((this.doorX - x) * (this.doorX - x) + (this.doorY - y) * (this.doorY - y))

    /** Infinite for a door without a key */
    distanceToKey = (x: number, y: number) =>
        this.keyType ? SquareRoot((this.keyX - x) * (this.keyX - x) + (this.keyY - y) * (this.keyY - y)) : Infinity

    distanceTo = (x: number, y: number) => Math.min(this.distanceToDoor(x, y), this.distanceToKey(x, y))

    /** Where the door stands (-moveDoor), made again there if it is on the map */
    /** angle: the one it gets (-1 random), else it keeps its own */
    moveDoor = (x: number, y: number, angle?: number) => {
        this.doorX = x
        this.doorY = y
        if (angle !== undefined) this.doorAngle = angle
        this.refresh()
        this.level?.updateDebugRegions()
    }

    /**
     * Its key and where it lies at start (-createDoorAndKey's second click, -moveKey): only the key is made again, so
     * that a door with a random angle keeps the one it has
     */
    setKey = (keyType: KeyForDoorType, x: number, y: number) => {
        this.keyType = keyType
        this.keyX = x
        this.keyY = y
        if (this.isOnMap() && !this.opened) {
            this.setCarrier(null)
            this.key && RemoveItem(this.key)
            this.key = CreateItem(FourCC(keyType.itemTypeId), x, y) ?? null
        }
    }

    moveKey = (x: number, y: number) => {
        this.keyType && this.setKey(this.keyType, x, y)
    }

    isBetweenLocs = (x1: number, y1: number, x2: number, y2: number) => {
        const r = { minX: Math.min(x1, x2), minY: Math.min(y1, y2), maxX: Math.max(x1, x2), maxY: Math.max(y1, y2) }
        return inside(r, this.doorX, this.doorY) || (!!this.keyType && inside(r, this.keyX, this.keyY))
    }

    destroy = () => {
        this.remove()
        this.level?.keyAndDoors.removeKeyAndDoor(this.id)
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()
        output['id'] = this.id
        output['doorTypeLabel'] = this.doorType.label
        output['keyForDoorTypeLabel'] = this.keyType ? this.keyType.label : null
        output['doorX'] = R2I(this.doorX)
        output['doorY'] = R2I(this.doorY)
        output['doorAngle'] = this.doorAngle === -1 ? -1 : R2I(this.doorAngle)
        if (this.keyType) {
            output['keyX'] = R2I(this.keyX)
            output['keyY'] = R2I(this.keyY)
        }
        return output
    }
}
