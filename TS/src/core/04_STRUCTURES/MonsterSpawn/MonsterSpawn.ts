import { IDestroyable, MemoryHandler } from 'Utils/MemoryHandler'
import { IPoint, createPoint } from 'Utils/Point'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { CombineHooks } from 'core/API/MecHookArray'
import { Timer } from 'w3ts'
import { GetCurrentMonsterPlayer, arrayPush, convertAngleToDirection } from '../../01_libraries/Basic_functions'
import { ENNEMY_PLAYER, GREY, MOBS_VARIOUS_COLORS, TERRAIN_DATA_DISPLAY_TIME } from '../../01_libraries/Constants'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { hooks } from '../../API/GeneralHooks'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/Monster'
import { MonsterType } from '../Monster/MonsterType'
import { NewImmobileMonsterForPlayer } from '../Monster/Monster_functions'
import { initSimpleUnitRecycler } from './SimpleUnitRecycler'

const DECALAGE_UNSPAWN = 200
const DELAY_BETWEEN_SPAWN_AND_MOVEMENT = 0.5

export const createDiagonalRegions = (startX: number, startY: number, endX: number, endY: number, size: number) => {
    const regions = MemoryHandler.getEmptyArray<{ topLeft: IPoint; bottomRight: IPoint }>()
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2))
    const numRegions = Math.floor(distance / size)
    const xStep = (endX - startX) / numRegions
    const yStep = (endY - startY) / numRegions

    for (let i = 0; i < numRegions; i++) {
        const topLeft = createPoint(startX + i * xStep, startY + i * yStep)
        const bottomRight = createPoint(topLeft.x + size, topLeft.y + size)

        regions.push({ topLeft, bottomRight })
    }

    return regions
}

const expand = (v: number, d: number) => v + d * Math.sign(v)

/**
 * class MonsterSpawn
 */
export class MonsterSpawn {
    static anyTrigId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyTimerId2Unit = new Map<number, unit>()
    static anyTimerId2SpawnIndex = new Map<number, number>()
    static anyTimerId2SpawnAmount = new Map<number, number>()
    static anyTimerId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyUnit2TimedUnspawnTimer = new Map<number, timer>()
    static anyTimedUnspawnTimerId2Unit = new Map<number, unit>()
    static anyTimedUnspawnTimerId2MonsterSpawn = new Map<number, MonsterSpawn>()
    private static lastInstanceId = -1

    public static getNextId = () => {
        return ++MonsterSpawn.lastInstanceId
    }

    private label: string
    private mt: MonsterType
    private frequence: number
    private spawnAmount = 1
    private spawnOffset = 0
    private initialDelay = 0
    private timedUnspawn: number | undefined

    private minX: number
    private minY: number
    private maxX: number
    private maxY: number

    private tSpawn?: trigger
    private tUnspawn?: trigger
    private unspawnReg?: region
    public unspawnregpoints: number[][] = []
    monsters?: group

    private rotation: number
    private points: IPoint[] & IDestroyable
    private anchor: { x: number; y: number }

    public multiRegionPatrols = false
    private multiRegionDx: number = 0
    private multiRegionDy: number = 0
    public x1: number[] = []
    public y1: number[] = []
    public x2: number[] = []
    public y2: number[] = []
    private r: region[] = []
    private t: trigger[] = []

    private fixedSpawnOffset: number | undefined
    private fixedSpawnOffsetBounce = false
    private fixedSpawnOffsetMirrored = false
    private lastSpawnVal: number | undefined
    private lastSpawnValMirrored: number | undefined

    private bouncing = false
    private mirrored = false

    private _futureBouncing: boolean | undefined = undefined

    level?: Level
    id: number

    private initialDelayTimer: Timer | undefined

    private simpleUnitRecycler = initSimpleUnitRecycler()
    private _active = false

    constructor(
        label: string,
        mt: MonsterType,
        rotation: number,
        frequence: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) {
        this.rotation = rotation

        this.id = MonsterSpawn.getNextId()
        this.label = label
        this.mt = mt
        this.frequence = frequence
        this.minX = Math.round(RMinBJ(x1, x2))
        this.minY = Math.round(RMinBJ(y1, y2))
        this.maxX = Math.round(RMaxBJ(x1, x2))
        this.maxY = Math.round(RMaxBJ(y1, y2))

        this.points = MemoryHandler.getEmptyArray()

        arrayPush(this.points, createPoint(Math.round(RMinBJ(x1, x2)), Math.round(RMinBJ(y1, y2))))
        arrayPush(this.points, createPoint(Math.round(RMaxBJ(x1, x2)), Math.round(RMinBJ(y1, y2))))
        arrayPush(this.points, createPoint(Math.round(RMaxBJ(x1, x2)), Math.round(RMaxBJ(y1, y2))))
        arrayPush(this.points, createPoint(Math.round(RMinBJ(x1, x2)), Math.round(RMaxBJ(y1, y2))))

        this.anchor = this.calculateCenterPoint(this.minX, this.minY, this.maxX, this.maxY)
    }

    getId() {
        return this.id
    }

    getLabel = (): string => {
        return this.label
    }

    getMonsterType = () => {
        return this.mt
    }

    getMinX = () => this.minX
    getMaxX = () => this.maxX
    getMinY = () => this.minY
    getMaxY = () => this.maxY

    getRotatedPoints = () => {
        const rotatedPoints = MemoryHandler.getEmptyArray<IPoint>()

        for (const point of this.points) {
            arrayPush(
                rotatedPoints,
                this.applyRotation(
                    point.x,
                    point.y,
                    this.rotation === 90 || this.rotation === 270 ? this.rotation + 90 : this.rotation
                )
            )
        }

        return rotatedPoints
    }

    deactivate = () => {
        this._active = false
        this.initialDelayTimer?.pause().destroy()

        if (this.multiRegionPatrols) {
            for (let i = 0; i < this.x1.length; i++) {
                DestroyTrigger(this.t[i])
                RemoveRegion(this.r[i])

                delete this.t[i]
                delete this.r[i]
                delete this.x1[i]
                delete this.y1[i]
                delete this.x2[i]
                delete this.y2[i]
            }
        }

        if (this.tSpawn) {
            DestroyTrigger(this.tSpawn)
            delete this.tSpawn
        }

        if (this.tUnspawn) {
            DestroyTrigger(this.tUnspawn)
            delete this.tUnspawn
        }

        if (this.monsters) {
            ForGroup(this.monsters, () => {
                const u = GetEnumUnit()
                const timer = MonsterSpawn.anyUnit2TimedUnspawnTimer.get(GetHandleId(u))
                if (timer) {
                    MonsterSpawn.anyTimedUnspawnTimerId2Unit.delete(GetHandleId(timer))
                    MonsterSpawn.anyTimedUnspawnTimerId2MonsterSpawn.delete(GetHandleId(timer))
                    MonsterSpawn.anyUnit2TimedUnspawnTimer.delete(GetHandleId(u))
                    DestroyTimer(timer)
                }
                this.simpleUnitRecycler.removeUnit(u)
            })
            DestroyGroup(this.monsters)
            delete this.monsters
        }
    }

    private createUnspawnReg = () => {
        let x1: number
        let y1: number
        let x2: number
        let y2: number

        if (this.rotation === 90 || this.rotation === 270) {
            x1 = this.minX - DECALAGE_UNSPAWN
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = this.minY
            y2 = this.minY

            const { x: nx1, y: ny1 } = this.applyRotation(x1, y1, this.rotation + 90)
            const { x: nx2, y: ny2 } = this.applyRotation(x2, y2, this.rotation + 90)

            x1 = nx1
            y1 = ny1
            x2 = nx2
            y2 = ny2
        } else {
            x1 = this.maxX
            x2 = this.maxX
            y1 = this.minY - DECALAGE_UNSPAWN
            y2 = this.maxY + DECALAGE_UNSPAWN

            const { x: nx1, y: ny1 } = this.applyRotation(x1, y1, this.rotation)
            const { x: nx2, y: ny2 } = this.applyRotation(x2, y2, this.rotation)

            x1 = nx1
            y1 = ny1
            x2 = nx2
            y2 = ny2
        }

        this.unspawnReg = CreateRegion()

        const isDiagonal = this.rotation % 90 !== 0

        if (isDiagonal) {
            this.unspawnregpoints = []

            const regions = createDiagonalRegions(x1, y1, x2, y2, 32)

            for (const region of regions) {
                const r = Rect(region.topLeft.x, region.topLeft.y, region.bottomRight.x, region.bottomRight.y)
                RegionAddRect(this.unspawnReg, r)
                RemoveRect(r)

                this.unspawnregpoints.push([
                    region.topLeft.x,
                    region.topLeft.y,
                    region.bottomRight.x,
                    region.bottomRight.y,
                ])
            }

            regions.__destroy(true)
        } else {
            const r = Rect(x1, y1, x2, y2)
            RegionAddRect(this.unspawnReg, r)
            RemoveRect(r)

            this.unspawnregpoints = [[x1, y1, x2, y2]]
        }

        const maxDistance = Math.abs(
            this.rotation === 0 || this.rotation === 180 ? this.minX - this.maxX : this.minY - this.maxY
        )

        // Multi region patrols does not work with rotation yet
        const maxTiles = 6 * 128
        this.multiRegionPatrols = !isDiagonal && maxDistance >= maxTiles

        if (this.multiRegionPatrols) {
            const amountOfPatrols = Math.ceil(maxDistance / maxTiles)
            const dx = Math.floor((this.minX - this.maxX) / amountOfPatrols)
            const dy = Math.floor((this.minY - this.maxY) / amountOfPatrols)

            this.multiRegionDx = dx
            this.multiRegionDy = dy

            // Ignore first and last
            for (let n = 0; n < amountOfPatrols - 1; n++) {
                const reg = CreateRegion()

                const ddx = (n + 1) * dx
                const ddy = (n + 1) * dy

                const calcX = x1 === x2
                const calcY = y1 === y2

                let nx1 = this.minX - (calcX ? ddx : 0)
                let ny1 = this.minY - (calcY ? ddy : 0)
                let nx2 = calcX ? nx1 - 16 : this.maxX
                let ny2 = calcY ? ny1 - 16 : this.maxY

                if (this.rotation === 90 || this.rotation === 270) {
                    nx1 = nx1 - DECALAGE_UNSPAWN
                    nx2 = nx2 + DECALAGE_UNSPAWN
                } else {
                    ny1 = ny1 - DECALAGE_UNSPAWN
                    ny2 = ny2 + DECALAGE_UNSPAWN
                }

                const r = Rect(nx1, ny1, nx2, ny2)
                RegionAddRect(reg, r)
                RemoveRect(r)

                this.unspawnregpoints.push([nx1, ny1, nx2, ny2])

                const t = CreateTrigger()
                MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(t), this)
                TriggerRegisterEnterRegion(t, reg, null)
                TriggerAddAction(t, () => {
                    // DON'T USE `n` HERE, LUA USES A VARIABLE REFERENCE CAUSING IT TO ALWAYS BE THE LAST VALUE
                    const ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))
                    if (ms && ms.monsters && IsUnitInGroup(GetTriggerUnit(), ms.monsters)) {
                        const u = GetTriggerUnit()

                        let x = Math.floor(GetUnitX(u))
                        let y = Math.floor(GetUnitY(u))

                        const ndx = expand(dx, DECALAGE_UNSPAWN)
                        const ndy = expand(dy, DECALAGE_UNSPAWN)

                        if (this.rotation === 0) {
                            x = x - ndx
                        } else if (this.rotation === 270) {
                            y = y + ndy
                        } else if (this.rotation === 180) {
                            x = x + ndx
                        } else {
                            y = y - ndy
                        }

                        IssuePointOrder(u, 'move', x, y)
                    }
                })

                this.x1[n] = nx1
                this.y1[n] = ny1
                this.x2[n] = nx2
                this.y2[n] = ny2
                this.r[n] = reg
                this.t[n] = t
            }
        }
    }

    private MonsterStartMovement: (this: void) => void = () => {
        if (!this._active) {
            return
        }

        const mobTimer = GetExpiredTimer()
        const ms = MonsterSpawn.anyTimerId2MonsterSpawn.get(GetHandleId(mobTimer))
        MonsterSpawn.anyTimerId2MonsterSpawn.delete(GetHandleId(mobTimer))

        if (ms) {
            const mobUnit = MonsterSpawn.anyTimerId2Unit.get(GetHandleId(mobTimer))
            MonsterSpawn.anyTimerId2Unit.delete(GetHandleId(mobTimer))

            if (mobUnit) {
                const spawnIndex = MonsterSpawn.anyTimerId2SpawnIndex.get(GetHandleId(mobTimer))
                MonsterSpawn.anyTimerId2SpawnIndex.delete(GetHandleId(mobTimer))

                if (spawnIndex !== undefined) {
                    const spawnAmount = MonsterSpawn.anyTimerId2SpawnAmount.get(GetHandleId(mobTimer))
                    MonsterSpawn.anyTimerId2SpawnAmount.delete(GetHandleId(mobTimer))

                    if (spawnAmount !== undefined) {
                        ms.startMobMovement(mobUnit, ms, spawnIndex, spawnAmount)
                        UnitAddAbility(mobUnit, FourCC('Aloc'))
                        DestroyTimer(mobTimer)
                    }
                }
            }
        }
    }

    private MonsterSpawn_Actions = errorHandler(() => {
        const ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))

        if (ms) {
            if (ms.monsters && BlzGroupGetSize(ms.monsters) + ms.getSpawnAmount() > 500) {
                return
            }

            for (let spawnIndex = 0; spawnIndex < ms.getSpawnAmount(); spawnIndex++) {
                const mobUnit = ms.createMob()

                if (mobUnit) {
                    const mobTimer = CreateTimer()
                    MonsterSpawn.anyTimerId2MonsterSpawn.set(GetHandleId(mobTimer), ms)
                    MonsterSpawn.anyTimerId2Unit.set(GetHandleId(mobTimer), mobUnit)
                    MonsterSpawn.anyTimerId2SpawnIndex.set(GetHandleId(mobTimer), spawnIndex)
                    MonsterSpawn.anyTimerId2SpawnAmount.set(GetHandleId(mobTimer), ms.getSpawnAmount())

                    TimerStart(mobTimer, DELAY_BETWEEN_SPAWN_AND_MOVEMENT, false, this.MonsterStartMovement)
                    SetUnitOwner(mobUnit, ENNEMY_PLAYER, false)
                    ShowUnit(mobUnit, false)
                    UnitRemoveAbility(mobUnit, FourCC('Aloc'))
                    ms.monsters && GroupAddUnit(ms.monsters, mobUnit)

                    // Start timed unspawn timer if configured
                    if (ms.timedUnspawn !== undefined && ms.timedUnspawn > 0) {
                        const unspawnTimer = CreateTimer()
                        MonsterSpawn.anyTimedUnspawnTimerId2Unit.set(GetHandleId(unspawnTimer), mobUnit)
                        MonsterSpawn.anyTimedUnspawnTimerId2MonsterSpawn.set(GetHandleId(unspawnTimer), ms)
                        MonsterSpawn.anyUnit2TimedUnspawnTimer.set(GetHandleId(mobUnit), unspawnTimer)
                        TimerStart(unspawnTimer, ms.timedUnspawn, false, ms.TimedUnspawn_Actions)
                    }
                }
            }

            if (this._futureBouncing !== undefined) {
                this.bouncing = this._futureBouncing
                this._futureBouncing = undefined
            }
        }
    })

    activate = () => {
        this._active = true
        this.monsters = CreateGroup()

        if (this.initialDelay === 0) {
            this.tSpawn = CreateTrigger()
            MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
            TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
            TriggerAddAction(this.tSpawn, this.MonsterSpawn_Actions)
        } else {
            this.initialDelayTimer = createTimer(this.initialDelay, false, () => {
                this.tSpawn = CreateTrigger()
                MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
                TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
                TriggerAddAction(this.tSpawn, this.MonsterSpawn_Actions)
            })
        }

        const UnspawMonster_Actions = () => {
            const ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))
            const u = GetTriggerUnit()
            if (ms && ms.monsters && IsUnitInGroup(u, ms.monsters)) {
                // Clear timed unspawn timer if it exists
                const timer = MonsterSpawn.anyUnit2TimedUnspawnTimer.get(GetHandleId(u))
                if (timer) {
                    MonsterSpawn.anyTimedUnspawnTimerId2Unit.delete(GetHandleId(timer))
                    MonsterSpawn.anyTimedUnspawnTimerId2MonsterSpawn.delete(GetHandleId(timer))
                    MonsterSpawn.anyUnit2TimedUnspawnTimer.delete(GetHandleId(u))
                    DestroyTimer(timer)
                }
                GroupRemoveUnit(ms.monsters, u)
                this.simpleUnitRecycler.removeUnit(u)
            }
        }

        this.createUnspawnReg()
        this.tUnspawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tUnspawn), this)
        this.unspawnReg && TriggerRegisterEnterRegion(this.tUnspawn, this.unspawnReg, null)
        TriggerAddAction(this.tUnspawn, UnspawMonster_Actions)
    }

    private TimedUnspawn_Actions: (this: void) => void = () => {
        const unspawnTimer = GetExpiredTimer()
        const u = MonsterSpawn.anyTimedUnspawnTimerId2Unit.get(GetHandleId(unspawnTimer))
        const ms = MonsterSpawn.anyTimedUnspawnTimerId2MonsterSpawn.get(GetHandleId(unspawnTimer))

        if (u && ms && ms.monsters && IsUnitInGroup(u, ms.monsters)) {
            MonsterSpawn.anyTimedUnspawnTimerId2Unit.delete(GetHandleId(unspawnTimer))
            MonsterSpawn.anyTimedUnspawnTimerId2MonsterSpawn.delete(GetHandleId(unspawnTimer))
            MonsterSpawn.anyUnit2TimedUnspawnTimer.delete(GetHandleId(u))
            DestroyTimer(unspawnTimer)

            GroupRemoveUnit(ms.monsters, u)
            ms.simpleUnitRecycler.removeUnit(u)
        }
    }

    destroy = () => {
        this.deactivate()
        this.level && this.level.monsterSpawns.removeMonsterSpawn(this.id)
        this.simpleUnitRecycler.destroy()
        this.points.__destroy(true)
    }

    calcValOffset = (a: number, b: number, spawnIndex: number, spawnAmount: number) => {
        if (this.fixedSpawnOffset !== undefined) {
            if (this.lastSpawnVal === undefined) {
                this.lastSpawnVal = a
            }

            if (this.lastSpawnValMirrored === undefined) {
                this.lastSpawnValMirrored = b
            }

            if (this.spawnOffset !== 0) {
                if (spawnIndex === 0) {
                    this.lastSpawnVal += (this.bouncing ? -1 : 1) * this.fixedSpawnOffset
                    this.lastSpawnValMirrored -= (this.bouncing ? -1 : 1) * this.fixedSpawnOffset
                }
            } else {
                this.lastSpawnVal += (this.bouncing ? -1 : 1) * this.fixedSpawnOffset
                this.lastSpawnValMirrored -= (this.bouncing ? -1 : 1) * this.fixedSpawnOffset
            }

            let minX = this.lastSpawnVal
            let maxX = this.lastSpawnVal

            if (this.spawnOffset !== 0) {
                minX = this.lastSpawnVal
                maxX = this.lastSpawnVal + this.spawnOffset * (spawnAmount - 1)
            }

            if (maxX + this.fixedSpawnOffset > b) {
                if (this.fixedSpawnOffsetBounce) {
                    this._futureBouncing = true
                } else {
                    this.lastSpawnVal = a
                    this.lastSpawnValMirrored = b
                }
            } else if (minX - this.fixedSpawnOffset < a) {
                if (this.fixedSpawnOffsetBounce) {
                    this._futureBouncing = false
                } else {
                    this.lastSpawnVal = b
                    this.lastSpawnValMirrored = a
                }
            }

            let spawnVal = this.lastSpawnVal
            let spawnValMirrored = this.lastSpawnValMirrored

            if (this.spawnOffset !== 0) {
                spawnVal += this.spawnOffset * spawnIndex
                spawnValMirrored -= this.spawnOffset * spawnIndex
            }

            if (this.fixedSpawnOffsetMirrored) {
                if (this.mirrored) {
                    this.mirrored = false
                    return spawnValMirrored
                } else {
                    this.mirrored = true
                    return spawnVal
                }
            } else {
                return spawnVal
            }
        } else {
            return GetRandomInt(a, b)
        }
    }

    startMobMovement = (mobUnit: unit, ms: MonsterSpawn, spawnIndex: number, spawnAmount: number) => {
        let p: player
        let x1: number
        let y1: number
        let x2: number
        let y2: number
        let facing: number

        if (this.rotation === 90 || this.rotation === 270) {
            x1 = this.calcValOffset(this.minX, this.maxX, spawnIndex, spawnAmount)
            x2 = x1
            y1 = this.maxY
            y2 = this.minY - DECALAGE_UNSPAWN

            if (this.multiRegionPatrols) {
                y2 = this.maxY + this.multiRegionDy - 16
            }
        } else {
            x1 = this.minX
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = this.calcValOffset(this.minY, this.maxY, spawnIndex, spawnAmount)
            y2 = y1

            if (this.multiRegionPatrols) {
                x2 = this.minX - this.multiRegionDx + 16
            }
        }

        if (this.rotation === 0) {
            facing = 0
        } else if (this.rotation === 270) {
            facing = 270
        } else if (this.rotation === 180) {
            facing = 180
        } else {
            facing = 90
        }

        let nx1, ny1
        let nx2, ny2

        if (this.rotation === 90 || this.rotation === 270) {
            {
                const rot = this.applyRotation(x1, y1, this.rotation + 90)
                nx1 = rot.x
                ny1 = rot.y
                rot.__destroy()
            }

            {
                const rot = this.applyRotation(x2, y2, this.rotation + 90)
                nx2 = rot.x
                ny2 = rot.y
                rot.__destroy()
            }
        } else {
            {
                const rot = this.applyRotation(x1, y1, this.rotation)
                nx1 = rot.x
                ny1 = rot.y
                rot.__destroy()
            }

            {
                const rot = this.applyRotation(x2, y2, this.rotation)
                nx2 = rot.x
                ny2 = rot.y
                rot.__destroy()
            }
        }

        BlzSetUnitFacingEx(mobUnit, facing)
        SetUnitX(mobUnit, nx1)
        SetUnitY(mobUnit, ny1)

        if (ms.getMonsterType().isClickable()) {
            p = ENNEMY_PLAYER
        } else {
            p = GetCurrentMonsterPlayer()
        }

        SetUnitOwner(mobUnit, p, MOBS_VARIOUS_COLORS)
        ShowUnit(mobUnit, true)
        IssuePointOrder(mobUnit, 'move', nx2, ny2)
    }

    createMob = () => {
        let angle: number

        if (this.rotation === 0) {
            angle = 180
        } else if (this.rotation === 270) {
            angle = 90
        } else if (this.rotation === 180) {
            angle = 0
        } else {
            angle = -90
        }

        let monster = this.simpleUnitRecycler.getUnit()

        if (!monster) {
            //hook onBeforeCreateMonsterUnit

            const hookArray = CombineHooks(
                this.level?.monsters.hooks_onBeforeCreateMonsterUnit,
                hooks.hooks_onBeforeCreateMonsterUnit
            )

            if (hookArray) {
                let forceUnitTypeId = 0
                let quit = false

                for (const hook of hookArray) {
                    const unitData = MemoryHandler.getEmptyObject<{ mt: MonsterType }>()
                    unitData.mt = this.mt
                    const output = hook.execute(unitData)
                    MemoryHandler.destroyObject(unitData)

                    if (output === false) {
                        quit = true
                    } else if (output && output.unitTypeId) {
                        forceUnitTypeId = output.unitTypeId
                    }
                }

                if (quit) {
                    MemoryHandler.destroyArray(hookArray)
                    return
                }

                if (forceUnitTypeId > 0) {
                    Monster.forceUnitTypeIdForNextMonster = forceUnitTypeId
                }
            }
            MemoryHandler.destroyArray(hookArray)

            monster = NewImmobileMonsterForPlayer(
                this.mt,
                ENNEMY_PLAYER,
                (this.minX + this.maxX) / 2,
                (this.minY + this.maxY) / 2,
                angle
            )
        }

        //hook after create unit
        const hookArray2 = CombineHooks(
            this.level?.monsters.hooks_onAfterCreateMonsterUnit,
            hooks.hooks_onAfterCreateMonsterUnit
        )

        if (hookArray2) {
            for (const hook of hookArray2) {
                const unitData = MemoryHandler.getEmptyObject<{ mt: MonsterType; u: unit }>()
                unitData.mt = this.mt
                unitData.u = monster
                hook.execute(unitData)
                MemoryHandler.destroyObject(unitData)
            }
        }

        MemoryHandler.destroyArray(hookArray2)

        return monster
    }

    setLabel = (newLabel: string) => {
        this.label = newLabel
    }

    setMonsterType = (mt: MonsterType) => {
        this.mt = mt

        if (this._active) {
            this.refresh()
        }
    }

    setRotation = (rotation: number) => {
        this.rotation = rotation

        if (this._active) {
            this.refresh()
        }

        this.level?.updateDebugRegions()
    }

    setFrequence = (frequence: number) => {
        this.frequence = frequence
        this.tSpawn && DestroyTrigger(this.tSpawn)
        this.tSpawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
        TriggerAddAction(this.tSpawn, this.MonsterSpawn_Actions)
    }

    displayForPlayer = (p: player) => {
        const display =
            udg_colorCode[GREY] +
            this.label +
            ' : ' +
            this.mt.label +
            '   ' +
            convertAngleToDirection(this.rotation) +
            '   ' +
            R2S(this.frequence)
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    getSpawnAmount = () => this.spawnAmount
    setSpawnAmount = (spawnAmount: number) => {
        this.spawnAmount = spawnAmount
    }

    getSpawnOffset = () => this.spawnOffset
    setSpawnOffset = (spawnOffset: number | undefined) => {
        this.spawnOffset = spawnOffset || 0
    }

    getInitialDelay = () => this.initialDelay
    setInitialDelay = (initialDelay: number) => {
        this.initialDelay = initialDelay
    }

    getFixedSpawnOffset = () => this.fixedSpawnOffset
    setFixedSpawnOffset = (fixedSpawnOffset: number | undefined) => {
        this.fixedSpawnOffset = fixedSpawnOffset
    }

    getFixedSpawnOffsetBounce = () => this.fixedSpawnOffsetBounce
    setFixedSpawnOffsetBounce = (fixedSpawnOffsetBounce: boolean | undefined) => {
        this.fixedSpawnOffsetBounce = fixedSpawnOffsetBounce || false
    }

    getFixedSpawnOffsetMirrored = () => this.fixedSpawnOffsetMirrored
    setFixedSpawnOffsetMirrored = (fixedSpawnOffsetMirrored: boolean | undefined) => {
        this.fixedSpawnOffsetMirrored = fixedSpawnOffsetMirrored || false
    }

    getTimedUnspawn = () => this.timedUnspawn
    setTimedUnspawn = (timedUnspawn: number | undefined) => {
        this.timedUnspawn = timedUnspawn
        this.refresh()
    }

    applyRotation = (x: number, y: number, rotation: number) => {
        const theta = Deg2Rad(rotation)

        const c = math.cos(theta)
        const s = math.sin(theta)

        const newX = (x - this.anchor.x) * c - (y - this.anchor.y) * s + this.anchor.x
        const newY = (x - this.anchor.x) * s + (y - this.anchor.y) * c + this.anchor.y

        return createPoint(newX, newY)
    }

    calculateCenterPoint = (
        topLeftX: number,
        topLeftY: number,
        bottomRightX: number,
        bottomRightY: number
    ): { x: number; y: number } => {
        const centerX = (topLeftX + bottomRightX) / 2
        const centerY = (topLeftY + bottomRightY) / 2

        return { x: centerX, y: centerY }
    }

    refresh = () => {
        this.deactivate()
        this.simpleUnitRecycler.reinit()
        this.activate()
    }

    toJson = () => {
        const output = MemoryHandler.getEmptyObject<any>()

        output['label'] = this.label
        output['monsterTypeLabel'] = this.mt.label
        output['sens'] = this.rotation
        output['frequence'] = this.frequence
        output['spawnAmount'] = this.spawnAmount
        output['spawnOffset'] = this.spawnOffset
        output['initialDelay'] = this.initialDelay
        output['fixedSpawnOffset'] = this.fixedSpawnOffset
        output['fixedSpawnOffsetBounce'] = this.fixedSpawnOffsetBounce
        output['fixedSpawnOffsetMirrored'] = this.fixedSpawnOffsetMirrored
        output['timedUnspawn'] = this.timedUnspawn
        output['minX'] = R2I(this.minX)
        output['minY'] = R2I(this.minY)
        output['maxX'] = R2I(this.maxX)
        output['maxY'] = R2I(this.maxY)

        return output
    }
}
