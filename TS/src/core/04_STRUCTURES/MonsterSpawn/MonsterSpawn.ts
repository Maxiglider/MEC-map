import { CombineHooks } from 'core/API/MecHookArray'
import { ArrayHandler } from 'Utils/ArrayHandler'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { Timer } from 'w3ts'
import { ObjectHandler } from '../../../Utils/ObjectHandler'
import { GetCurrentMonsterPlayer } from '../../01_libraries/Basic_functions'
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

/**
 * class MonsterSpawn
 */
export class MonsterSpawn {
    static anyTrigId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyTimerId2Unit = new Map<number, unit>()
    static anyTimerId2SpawnIndex = new Map<number, number>()
    static anyTimerId2SpawnAmount = new Map<number, number>()
    static anyTimerId2MonsterSpawn = new Map<number, MonsterSpawn>()
    private static lastInstanceId = -1

    public static getNextId = () => {
        return ++MonsterSpawn.lastInstanceId
    }

    private label: string
    private mt: MonsterType
    private sens: string //leftToRight, upToDown, rightToLeft, downToUp
    private frequence: number
    private spawnAmount = 1
    private spawnOffset = 0
    private initialDelay = 0
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number
    private tSpawn?: trigger
    private tUnspawn?: trigger
    private unspawnReg?: region
    monsters?: group

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
        sens: string,
        frequence: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ) {
        this.id = MonsterSpawn.getNextId()
        this.label = label
        this.mt = mt
        this.sens = sens
        this.frequence = frequence
        this.minX = Math.round(RMinBJ(x1, x2))
        this.minY = Math.round(RMinBJ(y1, y2))
        this.maxX = Math.round(RMaxBJ(x1, x2))
        this.maxY = Math.round(RMaxBJ(y1, y2))
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
            ForGroup(this.monsters, () => this.simpleUnitRecycler.removeUnit(GetEnumUnit()))
            DestroyGroup(this.monsters)
            delete this.monsters
        }
    }

    private createUnspawnReg = () => {
        let x1: number
        let y1: number
        let x2: number
        let y2: number

        //leftToRight, upToDown, rightToLeft, downToUp
        if (this.sens === 'leftToRight') {
            x1 = this.maxX
            x2 = this.maxX
            y1 = this.minY - DECALAGE_UNSPAWN
            y2 = this.maxY + DECALAGE_UNSPAWN
        } else if (this.sens === 'upToDown') {
            x1 = this.minX - DECALAGE_UNSPAWN
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = this.minY
            y2 = this.minY
        } else if (this.sens === 'rightToLeft') {
            x1 = this.minX
            x2 = this.minX
            y1 = this.minY - DECALAGE_UNSPAWN
            y2 = this.maxY + DECALAGE_UNSPAWN
        } else {
            x1 = this.minX - DECALAGE_UNSPAWN
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = this.maxY
            y2 = this.maxY
        }

        const r = Rect(x1, y1, x2, y2)
        this.unspawnReg = CreateRegion()
        RegionAddRect(this.unspawnReg, r)
        RemoveRect(r)

        const maxDistance = Math.sqrt(
            Math.pow(Math.abs(this.minX - this.maxX), 2) + Math.pow(Math.abs(this.minY - this.maxY), 2)
        )
        const maxTiles = 6 * 128
        this.multiRegionPatrols = maxDistance >= maxTiles

        if (this.multiRegionPatrols) {
            const amountOfPatrols = Math.ceil(maxDistance / maxTiles)
            const dx = Math.round((this.minX - this.maxX) / amountOfPatrols)
            const dy = Math.round((this.minY - this.maxY) / amountOfPatrols)

            this.multiRegionDx = dx
            this.multiRegionDy = dy

            // Ignore first and last
            for (let n = 0; n < amountOfPatrols - 1; n++) {
                const ddx = (n + 1) * dx
                const ddy = (n + 1) * dy

                const calcX = x1 === x2
                const calcY = y1 === y2

                const nx1 = this.minX - (calcX ? ddx : 0)
                const ny1 = this.minY - (calcY ? ddy : 0)
                const nx2 = calcX ? nx1 - 16 : this.maxX
                const ny2 = calcY ? ny1 - 16 : this.maxY

                const r = Rect(nx1, ny1, nx2, ny2)
                const reg = CreateRegion()
                RegionAddRect(reg, r)
                RemoveRect(r)

                const t = CreateTrigger()
                MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(t), this)
                TriggerRegisterEnterRegion(t, reg, null)
                TriggerAddAction(t, () => {
                    const ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))
                    if (ms && ms.monsters && IsUnitInGroup(GetTriggerUnit(), ms.monsters)) {
                        const u = GetTriggerUnit()

                        let x = Math.round(GetUnitX(u))
                        let y = Math.round(GetUnitY(u))

                        const nddx = (n + 2) * dx
                        const nddy = (n + 2) * dy

                        if (this.sens === 'leftToRight') {
                            x = this.minX - nddx
                        } else if (this.sens === 'upToDown') {
                            y = this.maxY + nddy
                        } else if (this.sens === 'rightToLeft') {
                            x = this.maxX + nddx
                        } else {
                            y = this.minY - nddy
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
            if (ms && ms.monsters && IsUnitInGroup(GetTriggerUnit(), ms.monsters)) {
                GroupRemoveUnit(ms.monsters, GetTriggerUnit())
                this.simpleUnitRecycler.removeUnit(GetTriggerUnit())
            }
        }

        this.createUnspawnReg()
        this.tUnspawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tUnspawn), this)
        this.unspawnReg && TriggerRegisterEnterRegion(this.tUnspawn, this.unspawnReg, null)
        TriggerAddAction(this.tUnspawn, UnspawMonster_Actions)
    }

    destroy = () => {
        this.deactivate()
        this.level && this.level.monsterSpawns.removeMonsterSpawn(this.id)
        this.simpleUnitRecycler.destroy()
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

        //leftToRight, upToDown, rightToLeft, downToUp
        if (this.sens === 'leftToRight') {
            x1 = this.minX
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = this.calcValOffset(this.minY, this.maxY, spawnIndex, spawnAmount)
            y2 = y1
            facing = 0

            if (this.multiRegionPatrols) {
                x2 = this.minX - this.multiRegionDx + 16
            }
        } else if (this.sens === 'upToDown') {
            x1 = this.calcValOffset(this.minX, this.maxX, spawnIndex, spawnAmount)
            x2 = x1
            y1 = this.maxY
            y2 = this.minY - DECALAGE_UNSPAWN
            facing = 270

            if (this.multiRegionPatrols) {
                y2 = this.maxY + this.multiRegionDy - 16
            }
        } else if (this.sens === 'rightToLeft') {
            x1 = this.maxX
            x2 = this.minX - DECALAGE_UNSPAWN
            y1 = this.calcValOffset(this.minY, this.maxY, spawnIndex, spawnAmount)
            y2 = y1
            facing = 180

            if (this.multiRegionPatrols) {
                x2 = this.maxX + this.multiRegionDx - 16
            }
        } else {
            x1 = this.calcValOffset(this.minX, this.maxX, spawnIndex, spawnAmount)
            x2 = x1
            y1 = this.minY
            y2 = this.maxY + DECALAGE_UNSPAWN
            facing = 90

            if (this.multiRegionPatrols) {
                y2 = this.minY - this.multiRegionDy + 16
            }
        }

        BlzSetUnitFacingEx(mobUnit, facing)
        SetUnitX(mobUnit, x1)
        SetUnitY(mobUnit, y1)

        if (ms.getMonsterType().isClickable()) {
            p = ENNEMY_PLAYER
        } else {
            p = GetCurrentMonsterPlayer()
        }

        SetUnitOwner(mobUnit, p, MOBS_VARIOUS_COLORS)
        ShowUnit(mobUnit, true)
        IssuePointOrder(mobUnit, 'move', x2, y2)
    }

    createMob = () => {
        let angle: number

        //leftToRight, upToDown, rightToLeft, downToUp
        if (this.sens === 'leftToRight') {
            angle = 180
        } else if (this.sens === 'upToDown') {
            angle = 90
        } else if (this.sens === 'rightToLeft') {
            angle = 0
        } else {
            angle = -90
        }

        //hook onBeforeCreateMonsterUnit

        const hookArray = CombineHooks(
            this.level?.monsters.hooks_onBeforeCreateMonsterUnit,
            hooks.hooks_onBeforeCreateMonsterUnit
        )

        if (hookArray) {
            let forceUnitTypeId = 0
            let quit = false

            for (const hook of hookArray) {
                const unitData = ObjectHandler.getNewObject<{ mt: MonsterType }>()
                unitData.mt = this.mt
                const output = hook.execute(unitData)
                ObjectHandler.clearObject(unitData)

                if (output === false) {
                    quit = true
                } else if (output && output.unitTypeId) {
                    forceUnitTypeId = output.unitTypeId
                }
            }

            if (quit) {
                ArrayHandler.clearArray(hookArray)
                return
            }

            if (forceUnitTypeId > 0) {
                Monster.forceUnitTypeIdForNextMonster = forceUnitTypeId
            }
        }
        ArrayHandler.clearArray(hookArray)

        const monster =
            this.simpleUnitRecycler.getUnit() ||
            NewImmobileMonsterForPlayer(
                this.mt,
                ENNEMY_PLAYER,
                (this.minX + this.maxX) / 2,
                (this.minY + this.maxY) / 2,
                angle
            )

        //hook after create unit
        const hookArray2 = CombineHooks(
            this.level?.monsters.hooks_onAfterCreateMonsterUnit,
            hooks.hooks_onAfterCreateMonsterUnit
        )

        if (hookArray2) {
            for (const hook of hookArray2) {
                const unitData = ObjectHandler.getNewObject<{ mt: MonsterType; u: unit }>()
                unitData.mt = this.mt
                unitData.u = monster
                hook.execute(unitData)
                ObjectHandler.clearObject(unitData)
            }
        }

        ArrayHandler.clearArray(hookArray2)

        return monster
    }

    setLabel = (newLabel: string) => {
        this.label = newLabel
    }

    setMonsterType = (mt: MonsterType) => {
        this.mt = mt
        this.deactivate()
        this.simpleUnitRecycler.reinit()
        this.activate()
    }

    setSens = (sens: string) => {
        this.sens = sens
        this.deactivate()
        this.activate()
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
            udg_colorCode[GREY] + this.label + ' : ' + this.mt.label + '   ' + this.sens + '   ' + R2S(this.frequence)
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

    toJson = () => {
        const output = ObjectHandler.getNewObject<any>()

        output['label'] = this.label
        output['monsterTypeLabel'] = this.mt.label
        output['sens'] = this.sens
        output['frequence'] = this.frequence
        output['spawnAmount'] = this.spawnAmount
        output['spawnOffset'] = this.spawnOffset
        output['initialDelay'] = this.initialDelay
        output['fixedSpawnOffset'] = this.fixedSpawnOffset
        output['fixedSpawnOffsetBounce'] = this.fixedSpawnOffsetBounce
        output['fixedSpawnOffsetMirrored'] = this.fixedSpawnOffsetMirrored
        output['minX'] = R2I(this.minX)
        output['minY'] = R2I(this.minY)
        output['maxX'] = R2I(this.maxX)
        output['maxY'] = R2I(this.maxY)

        return output
    }
}
