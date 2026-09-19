import { MemoryHandler } from 'Utils/MemoryHandler'
import { getUdgEscapers, getUdgTerrainTypes } from '../../../../globals'
import { Constants } from '../../01_libraries/Constants'
import type { Level } from '../Level/Level'
import { DoorType, KeyForDoorType } from './KeyAndDoorTypes'

/**
 * How near to its door a hero carrying the key opens it: measured from the door's long sides (its kill rect's),
 * across the door only. Past its ends, it doesn't open.
 */
export const DOOR_OPEN_DISTANCE = 128 * 3
/** How near to a door or a key a click picks it (to delete it) */
export const KEY_AND_DOOR_NEAR_DISTANCE = 128
const CHECK_PERIOD = 0.05

type Rect = { minX: number; minY: number; maxX: number; maxY: number }
const inside = (r: Rect, x: number, y: number) => x >= r.minX && x <= r.maxX && y >= r.minY && y <= r.maxY
/** Where a hero carrying the key opens the door: as long as the door, and DOOR_OPEN_DISTANCE out from its long sides */
const openZoneOf = (killRect: Rect, runsAlongY: boolean): Rect =>
    !runsAlongY
        ? { ...killRect, minY: killRect.minY - DOOR_OPEN_DISTANCE, maxY: killRect.maxY + DOOR_OPEN_DISTANCE }
        : { ...killRect, minX: killRect.minX - DOOR_OPEN_DISTANCE, maxX: killRect.maxX + DOOR_OPEN_DISTANCE }

/**
 * Which way a door stands, from where it blocks the ground: gates have a fixed rotation (an iron gate stands
 * horizontal or vertical whatever angle it is made with), so doors have no angle of their own. An item put on the
 * ground at a few distances on both sides of the door, along x then along y, is pushed away where the closed door
 * blocks: the door stands along the axis where it blocks the most.
 */
const PROBE_DISTANCES = [64, 128, 192]
/** The angle doors are made with: the one the World Editor gives gates (their fixed rotation shows them anyway) */
const DOOR_FACING = 270
const PROBE_ITEM_TYPE = FourCC('wolg')
let probe: item | null = null

const isBlockedGround = (x: number, y: number) => {
    probe = probe ?? CreateItem(PROBE_ITEM_TYPE, x, y) ?? null
    if (!probe) return false
    SetItemVisible(probe, true)
    SetItemPosition(probe, x, y)
    const dx = GetItemX(probe) - x
    const dy = GetItemY(probe) - y
    SetItemVisible(probe, false)
    return dx * dx + dy * dy > 16 * 16
}

/** true when the door stands along y, false along x (also when its pathing doesn't tell) */
const doorRunsAlongY = (x: number, y: number) => {
    let blockedAlongX = 0
    let blockedAlongY = 0
    for (const d of PROBE_DISTANCES) {
        blockedAlongX += (isBlockedGround(x - d, y) ? 1 : 0) + (isBlockedGround(x + d, y) ? 1 : 0)
        blockedAlongY += (isBlockedGround(x, y - d) ? 1 : 0) + (isBlockedGround(x, y + d) ? 1 : 0)
    }
    return blockedAlongY > blockedAlongX
}

/**
 * A door's kill rect when its kind has no dimensions: along the door, from its centre to the death terrain on each
 * side (reaching into it, rounded out to 16), AUTO_KILL_RECT_HEIGHT across; AUTO_KILL_RECT_FALLBACK on a side with no
 * death terrain within AUTO_KILL_RECT_REACH, as the slide map conversion measures gates.
 */
export const AUTO_KILL_RECT_HEIGHT = 96
const AUTO_KILL_RECT_REACH = 4096
const AUTO_KILL_RECT_FALLBACK = 256
const AUTO_KILL_RECT_STEP = 16

const isDeathGround = (x: number, y: number) => getUdgTerrainTypes().getTerrainType(x, y)?.getKind() === 'death'

const reachToDeath = (x: number, y: number, dx: number, dy: number) => {
    for (let t = 0; t <= AUTO_KILL_RECT_REACH; t += AUTO_KILL_RECT_STEP) {
        if (isDeathGround(x + dx * t, y + dy * t)) return t
    }
    return AUTO_KILL_RECT_FALLBACK
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
    keyX: number
    keyY: number

    private door: destructable | null = null
    private key: item | null = null
    private killRect: Rect | null = null
    private openZone: Rect | null = null
    private opened = false
    /** The escaper carrying the key, shown in its hand as a meteor is */
    private carrierId: number | null = null

    constructor(
        doorType: DoorType,
        keyType: KeyForDoorType | null,
        doorX: number,
        doorY: number,
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
        this.keyX = keyX
        this.keyY = keyY
    }

    getId = () => this.id

    isOnMap = () => this.door !== null

    create = () => {
        this.remove()

        this.door =
            CreateDestructable(FourCC(this.doorType.destructableTypeId), this.doorX, this.doorY, DOOR_FACING, 1, 0) ??
            null
        this.key = this.keyType ? (CreateItem(FourCC(this.keyType.itemTypeId), this.keyX, this.keyY) ?? null) : null
        this.opened = false

        // the kill rect along the door (width along it, height across it): the way the door blocks the ground
        const runsAlongY = doorRunsAlongY(this.doorX, this.doorY)
        const { killRectWidth, killRectHeight } = this.doorType
        // along the door: the kind's width centred on it, else up to the death terrain on each side
        const [alongMin, alongMax] =
            killRectWidth !== null
                ? [-killRectWidth / 2, killRectWidth / 2]
                : runsAlongY
                  ? [-reachToDeath(this.doorX, this.doorY, 0, -1), reachToDeath(this.doorX, this.doorY, 0, 1)]
                  : [-reachToDeath(this.doorX, this.doorY, -1, 0), reachToDeath(this.doorX, this.doorY, 1, 0)]
        const halfAcross = (killRectHeight ?? AUTO_KILL_RECT_HEIGHT) / 2
        this.killRect = runsAlongY
            ? {
                  minX: this.doorX - halfAcross,
                  maxX: this.doorX + halfAcross,
                  minY: this.doorY + alongMin,
                  maxY: this.doorY + alongMax,
              }
            : {
                  minX: this.doorX + alongMin,
                  maxX: this.doorX + alongMax,
                  minY: this.doorY - halfAcross,
                  maxY: this.doorY + halfAcross,
              }

        this.openZone = openZoneOf(this.killRect, runsAlongY)

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
        this.openZone = null
        delete standing[this.id]
    }

    /** Made again with what its types say now (after a type changed) */
    refresh = () => {
        if (this.isOnMap()) {
            this.create()
            this.level?.updateDebugRegions()
        }
    }

    isOpened = () => this.opened

    /** The escaper carrying the key, if any */
    getCarrierId = () => this.carrierId

    /** The key item on the map (or in a hero's hands), null for a door without a key or off the map */
    getKeyItem = () => this.key

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
        if (this.opened || !this.door || !this.killRect || !this.openZone) {
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
                } else if (inside(this.openZone, GetUnitX(hero), GetUnitY(hero))) {
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
    moveDoor = (x: number, y: number) => {
        this.doorX = x
        this.doorY = y
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

    /** Gone for good: off the map and its level, and its kill rect no longer drawn (-debugRegions) */
    destroy = () => {
        this.remove()
        this.level?.keyAndDoors.removeKeyAndDoor(this.id)
        this.level?.updateDebugRegions()
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()
        output['id'] = this.id
        output['doorTypeLabel'] = this.doorType.label
        output['keyForDoorTypeLabel'] = this.keyType ? this.keyType.label : null
        output['doorX'] = R2I(this.doorX)
        output['doorY'] = R2I(this.doorY)
        if (this.keyType) {
            output['keyX'] = R2I(this.keyX)
            output['keyY'] = R2I(this.keyY)
        }
        return output
    }
}
