import { MemoryHandler } from 'Utils/MemoryHandler'
import { IPoint, createPoint } from 'Utils/Point'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { Constants } from 'core/01_libraries/Constants'
import { CombineHooks } from 'core/API/MecHookArray'
import { Timer } from 'w3ts'
import { globals, udg_spawned_monsters } from '../../../../globals'
import { GetCurrentMonsterPlayer, arrayPush, convertAngleToDirection } from '../../01_libraries/Basic_functions'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { hooks } from '../../API/GeneralHooks'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/Monster'
import { MonsterType } from '../Monster/MonsterType'
import { NewImmobileMonsterForPlayer } from '../Monster/Monster_functions'
import { initSimpleUnitRecycler } from './SimpleUnitRecycler'
import { Natives } from '../../wc3_natives_unsecured/Natives'
import { IssueMoveOrderForLongDistance } from '../Monster/LongDistanceMoveOrder'
import { MECRegion, StartAndEndPoints } from '../Region/MECRegion'

const DELAY_BETWEEN_SPAWN_AND_MOVEMENT = 0.5
const MAXIMUM_SPANWED_MONSTERS_SIMULTANEOUSLY = 500

const MonsterSpawn_Actions = errorHandler(() => {
    const monsterSpawn = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(Natives.UGetTriggeringTrigger()))

    if (!monsterSpawn?.monsters) {
        return
    }
    if (
        BlzGroupGetSize(monsterSpawn.monsters) + monsterSpawn.getSpawnAmount() >
        MAXIMUM_SPANWED_MONSTERS_SIMULTANEOUSLY
    ) {
        return
    }

    const mecRegion = monsterSpawn.getMecRegion()
    if (!mecRegion) {
        return
    }

    for (let spawnIndex = 0; spawnIndex < monsterSpawn.getSpawnAmount(); spawnIndex++) {
        const startAndEndPoints = mecRegion.generateStartAndEndPoints()
        const mobUnit = monsterSpawn.createMob(startAndEndPoints)

        if (mobUnit) {
            const mobTimer = CreateTimer()
            MonsterSpawn.anyTimerId2MonsterSpawn.set(GetHandleId(mobTimer), monsterSpawn)
            MonsterSpawn.anyTimerId2Unit.set(GetHandleId(mobTimer), mobUnit)
            MonsterSpawn.anyTimerId2StartAndEndPoints.set(GetHandleId(mobTimer), startAndEndPoints)

            TimerStart(mobTimer, DELAY_BETWEEN_SPAWN_AND_MOVEMENT, false, MonsterStartMovement)
        }
    }
})

const MonsterStartMovement = errorHandler(() => {
    const mobTimer = Natives.UGetExpiredTimer()

    const monsterSpawn = MonsterSpawn.anyTimerId2MonsterSpawn.get(GetHandleId(mobTimer))
    MonsterSpawn.anyTimerId2MonsterSpawn.delete(GetHandleId(mobTimer))

    const mobUnit = MonsterSpawn.anyTimerId2Unit.get(GetHandleId(mobTimer))
    MonsterSpawn.anyTimerId2Unit.delete(GetHandleId(mobTimer))

    const startEndEndPoints = MonsterSpawn.anyTimerId2StartAndEndPoints.get(GetHandleId(mobTimer))
    MonsterSpawn.anyTimerId2StartAndEndPoints.delete(GetHandleId(mobTimer))

    DestroyTimer(mobTimer)

    if (monsterSpawn?.isActive() && mobUnit && startEndEndPoints) {
        IssueMoveOrderForLongDistance(mobUnit, startEndEndPoints.endX, startEndEndPoints.endY)
    }

    if (startEndEndPoints?.ephemeral) {
        MemoryHandler.destroyObject(startEndEndPoints)
    }
})

/**
 * class MonsterSpawn
 */
export class MonsterSpawn {
    static anyTrigId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyMonsterUnitId2MonsterSpawn = new Map<number, MonsterSpawn>()

    // for monster movement starting after a little delay
    static anyTimerId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyTimerId2Unit = new Map<number, unit>()
    static anyTimerId2StartAndEndPoints = new Map<number, StartAndEndPoints>()

    static anyUnit2TimedUnspawnTimer = new Map<number, timer>()
    static anyTimedUnspawnTimerId2Unit = new Map<number, unit>()
    static anyTimedUnspawnTimerId2MonsterSpawn = new Map<number, MonsterSpawn>()
    private static lastInstanceId = -1

    public static getNextId = () => {
        return ++MonsterSpawn.lastInstanceId
    }

    private label: string
    private mt: MonsterType
    private mecRegion?: MECRegion
    private frequence: number
    private spawnAmount = 1
    private spawnOffset = 0
    private initialDelay = 0
    private timedUnspawn: number | undefined

    private monsterDirectionMode: 'straight' | 'random'

    private tSpawn?: trigger
    private tUnspawn?: trigger
    private unspawnReg?: region
    public unspawnregpoints: number[][] = []
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
        mecRegion: MECRegion,
        frequence: number,
        monsterDirectionMode: 'straight' | 'random'
    ) {
        this.monsterDirectionMode = monsterDirectionMode

        this.id = MonsterSpawn.getNextId()
        this.label = label
        this.mt = mt
        this.frequence = frequence
        this.setMECRegion(mecRegion)
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

    // todo remove this commented code
    // getRotatedPoints = () => {
    //     const rotatedPoints = MemoryHandler.getEmptyArray<IPoint>()
    //
    //     for (const point of this.points) {
    //         arrayPush(
    //             rotatedPoints,
    //             this.applyRotation(
    //                 point.x,
    //                 point.y,
    //                 this.rotation === 90 || this.rotation === 270 ? this.rotation + 90 : this.rotation
    //             )
    //         )
    //     }
    //
    //     return rotatedPoints
    // }

    getMecRegion = () => {
        return this.mecRegion
    }

    setMECRegion = (newMecRegion: MECRegion) => {
        this.mecRegion && this.mecRegion.destroy()
        this.mecRegion = newMecRegion
        this.mecRegion.onUnitLeaves(monsterUnit => {
            this.monsters && GroupRemoveUnit(this.monsters, monsterUnit)
            this.mecRegion?.unwatchUnit(monsterUnit)
            UnitRemoveAbility(monsterUnit, FourCC('Aloc'))
            this.simpleUnitRecycler.removeUnit(monsterUnit)
            udg_spawned_monsters[GetHandleId(monsterUnit)] = null
        })

        this._active && this.refresh()
    }

    deactivate = () => {
        this._active = false
        this.initialDelayTimer?.pause().destroy()

        if (this.tSpawn) {
            DestroyTrigger(this.tSpawn)
            delete this.tSpawn
        }

        if (this.monsters) {
            ForGroup(this.monsters, () => {
                const u = Natives.UGetEnumUnit()
                const timer = MonsterSpawn.anyUnit2TimedUnspawnTimer.get(GetHandleId(u))
                if (timer) {
                    MonsterSpawn.anyTimedUnspawnTimerId2Unit.delete(GetHandleId(timer))
                    MonsterSpawn.anyTimedUnspawnTimerId2MonsterSpawn.delete(GetHandleId(timer))
                    MonsterSpawn.anyUnit2TimedUnspawnTimer.delete(GetHandleId(u))
                    DestroyTimer(timer)
                }
                this.simpleUnitRecycler.removeUnit(u)
                udg_spawned_monsters[GetHandleId(u)] = null
            })
            DestroyGroup(this.monsters)
            delete this.monsters
        }

        this.mecRegion?.enableWatchUnits(false)
    }

    activate = () => {
        this._active = true
        this.monsters = Natives.UCreateGroup()

        this.initialDelayTimer = createTimer(this.initialDelay, false, () => {
            this.tSpawn = CreateTrigger()
            MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
            TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
            TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)
            this.initialDelayTimer?.pause().destroy()
            this.mecRegion?.enableWatchUnits(true)
        })
    }

    isActive = () => {
        return this._active
    }

    destroy = () => {
        this.deactivate()
        this.level && this.level.monsterSpawns.removeMonsterSpawn(this.id)
        this.simpleUnitRecycler.destroy()
    }

    createMob = (startAndEndPoints: StartAndEndPoints) => {
        const spawnAngle =
            Rad2Deg(
                Math.atan2(
                    startAndEndPoints.endY - startAndEndPoints.startY,
                    startAndEndPoints.endX - startAndEndPoints.startX
                )
            ) + 180

        // hook onBeforeCreateMonsterUnit
        const hookArray = CombineHooks(
            this.level?.monsters.hooks_onBeforeCreateMonsterUnit,
            hooks.hooks_onBeforeCreateMonsterUnit
        )

        let forceUnitTypeId = 0
        if (!!hookArray) {
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
        }
        MemoryHandler.destroyArray(hookArray)

        let monster = this.simpleUnitRecycler.getUnit()
        if (!monster) {
            if (forceUnitTypeId > 0) {
                Monster.forceUnitTypeIdForNextMonster = forceUnitTypeId
            }

            monster = NewImmobileMonsterForPlayer(
                this.mt,
                Constants.ENNEMY_PLAYER,
                startAndEndPoints.startX,
                startAndEndPoints.startY,
                spawnAngle
            )
        } else {
            // todo the forceUnitTypeId should be taken into account and change the unit type of the existing unit without recreating it
            BlzSetUnitFacingEx(monster, spawnAngle)
            SetUnitPosition(monster, startAndEndPoints.startX, startAndEndPoints.startY)
            UnitAddAbility(monster, FourCC('Aloc'))
        }

        udg_spawned_monsters[GetHandleId(monster)] = this.mt
        if (this.monsters) {
            GroupAddUnit(this.monsters, monster)
            MonsterSpawn.anyMonsterUnitId2MonsterSpawn.set(GetHandleId(monster), this)
            this.mecRegion?.watchUnit(monster, true)
        }

        //hook after create unit
        const hookArray2 = CombineHooks(
            this.level?.monsters.hooks_onAfterCreateMonsterUnit,
            hooks.hooks_onAfterCreateMonsterUnit
        )

        if (!!hookArray2) {
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
        this._active && this.refresh()
    }

    setFrequence = (frequence: number) => {
        this.frequence = frequence
        this.tSpawn && DestroyTrigger(this.tSpawn)
        this.tSpawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
        TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)
    }

    setMonsterDirectionMode(mode: 'straight' | 'random') {
        this.monsterDirectionMode = mode
    }

    toText = (): string => {
        // todo rework the toText method
        let text =
            udg_colorCode[Constants.GREY] +
            this.label +
            ' : ' +
            this.mt.label +
            '   ' +
            // convertAngleToDirection(this.rotation) +
            '   ' +
            R2S(this.frequence)

        if (this.timedUnspawn !== undefined) {
            text = text + '   unspawn:' + R2S(this.timedUnspawn) + 's'
        }

        return text
    }

    displayForPlayer = (p: player) => {
        Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, this.toText())
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
        this._active && this.refresh()
    }

    refresh = () => {
        this.deactivate()
        this.simpleUnitRecycler.reinit()
        this.activate()
    }

    toJson = () => {
        // todo rework the toJson method
        const output = MemoryHandler.getEmptyObject<any>()

        output['label'] = this.label
        output['monsterTypeLabel'] = this.mt.label
        // output['sens'] = this.rotation
        output['frequence'] = this.frequence
        output['spawnAmount'] = this.spawnAmount
        output['spawnOffset'] = this.spawnOffset
        output['initialDelay'] = this.initialDelay
        output['fixedSpawnOffset'] = this.fixedSpawnOffset
        output['fixedSpawnOffsetBounce'] = this.fixedSpawnOffsetBounce
        output['fixedSpawnOffsetMirrored'] = this.fixedSpawnOffsetMirrored
        output['timedUnspawn'] = this.timedUnspawn
        // output['spawnShape'] = this.spawnShape
        // output['clickX1'] = this.clickX1
        // output['clickY1'] = R2I(this.clickY1)
        // output['clickX2'] = R2I(this.clickX2)
        // output['clickY2'] = R2I(this.clickY2)
        // output['minX'] = R2I(this.minX)
        // output['minY'] = R2I(this.minY)
        // output['maxX'] = R2I(this.maxX)
        // output['maxY'] = R2I(this.maxY)
        output['monsterDirectionMode'] = this.monsterDirectionMode

        return output
    }
}
