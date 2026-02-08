import { MemoryHandler } from 'Utils/MemoryHandler'
import { createTimer, errorHandler } from 'Utils/mapUtils'
import { Constants } from 'core/01_libraries/Constants'
import { CombineHooks } from 'core/API/MecHookArray'
import { Timer } from 'w3ts'
import { udg_spawned_monsters } from '../../../../globals'
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

export type MonsterDirectionMode = 'straight' | 'random'

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

    const unspawnTime = monsterSpawn.getTimedUnspawn()
    if (unspawnTime !== undefined) {
        const monsterSpeed = monsterSpawn.getMonsterType().getUnitMoveSpeed()
        monsterSpawn.setForcedDistance(monsterSpeed * (unspawnTime + 2)) // the 2s added to unspawn time are here to be sure that the monster will be unspawned before reaching the end of their movement
    }

    for (let spawnIndex = 0; spawnIndex < monsterSpawn.getSpawnAmount(); spawnIndex++) {
        monsterSpawn.setSpawnIndex(spawnIndex)

        const startAndEndPoints = mecRegion.generateStartAndEndPoints(monsterSpawn)

        const mobUnit = monsterSpawn.createMob(startAndEndPoints)

        if (mobUnit) {
            // Make the unit move
            IssueMoveOrderForLongDistance(mobUnit, startAndEndPoints.endX, startAndEndPoints.endY)

            const unspawnTime = monsterSpawn.getTimedUnspawn()
            if (unspawnTime !== undefined) {
                const unspawnTimer = CreateTimer()
                MonsterSpawn.anyTimedUnspawnTimerId2Unit.set(GetHandleId(unspawnTimer), mobUnit)
                MonsterSpawn.anyUnit2TimedUnspawnTimer.set(GetHandleId(mobUnit), unspawnTimer)
                TimerStart(unspawnTimer, unspawnTime, false, MonsterUnspawn)
            }

            if (startAndEndPoints.ephemeral) {
                MemoryHandler.destroyObject(startAndEndPoints)
            }
        }
    }
})

const MonsterUnspawn = errorHandler(() => {
    const unspawnTimer = Natives.UGetExpiredTimer()
    const mobUnit = MonsterSpawn.anyTimedUnspawnTimerId2Unit.get(GetHandleId(unspawnTimer))

    if (mobUnit) {
        const monsterSpawn = MonsterSpawn.anyMonsterUnitId2MonsterSpawn.get(GetHandleId(mobUnit))
        monsterSpawn?.removeMonsterUnit(mobUnit)
    }
})

/**
 * class MonsterSpawn
 */
export class MonsterSpawn {
    static anyTrigId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyMonsterUnitId2MonsterSpawn = new Map<number, MonsterSpawn>()

    static anyUnit2TimedUnspawnTimer = new Map<number, timer>()
    static anyTimedUnspawnTimerId2Unit = new Map<number, unit>()

    private static lastInstanceId = -1

    public static getNextId = () => {
        return ++MonsterSpawn.lastInstanceId
    }

    // Properties that determine the spawn behavior and should be saved
    private label: string
    private mt: MonsterType
    private mecRegion?: MECRegion
    private frequency: number
    private spawnAmount = 1
    private initialDelay = 0
    private timedUnspawn: number | undefined
    private monsterDirectionMode: MonsterDirectionMode
    private fixedSpawnOffset: number | undefined
    private spawnOffset = 0
    private fixedSpawnOffsetBounce = false
    private fixedSpawnOffsetMirrored = false

    // Properties for runtime use only
    private tSpawn?: trigger
    monsters?: group
    private lastSpawnVal: number | undefined
    private bouncing = false
    private mirrored = false
    private spawnIndex = 0
    private forcedDistance: number | undefined

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
        monsterDirectionMode: MonsterDirectionMode
    ) {
        this.monsterDirectionMode = monsterDirectionMode

        this.id = MonsterSpawn.getNextId()
        this.label = label
        this.mt = mt
        this.frequency = frequence
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

    getMecRegion = () => {
        return this.mecRegion
    }

    setMECRegion = (newMecRegion: MECRegion) => {
        this.mecRegion && this.mecRegion.destroy()
        this.mecRegion = newMecRegion
        this.mecRegion.onUnitLeaves(monsterUnit => this.removeMonsterUnit(monsterUnit))
        this._active && this.refresh()
    }

    // remove monster unit with destroying it but just hiding it with the simpleUnitRecycler
    removeMonsterUnit(monsterUnit: unit) {
        this.monsters && GroupRemoveUnit(this.monsters, monsterUnit)
        this.mecRegion?.unwatchUnit(monsterUnit)
        UnitRemoveAbility(monsterUnit, FourCC('Aloc'))
        this.simpleUnitRecycler.removeUnit(monsterUnit)
        udg_spawned_monsters[GetHandleId(monsterUnit)] = null

        const timer = MonsterSpawn.anyUnit2TimedUnspawnTimer.get(GetHandleId(monsterUnit))
        if (timer) {
            MonsterSpawn.anyTimedUnspawnTimerId2Unit.delete(GetHandleId(timer))
            MonsterSpawn.anyUnit2TimedUnspawnTimer.delete(GetHandleId(monsterUnit))
            DestroyTimer(timer)
        }
        MonsterSpawn.anyMonsterUnitId2MonsterSpawn.delete(GetHandleId(monsterUnit))
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
                this.removeMonsterUnit(Natives.UGetEnumUnit())
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
            TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequency, true)
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
        this.mecRegion?.destroy()
    }

    createMob = (startAndEndPoints: StartAndEndPoints) => {
        const spawnAngle = Rad2Deg(
            Math.atan2(
                startAndEndPoints.endY - startAndEndPoints.startY,
                startAndEndPoints.endX - startAndEndPoints.startX
            )
        )

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
            if (this.timedUnspawn === undefined) {
                this.mecRegion?.watchUnit(monster, true)
            }
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
        this.frequency = frequence
        this.tSpawn && DestroyTrigger(this.tSpawn)
        this.tSpawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequency, true)
        TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)
    }

    setMonsterDirectionMode(mode: MonsterDirectionMode) {
        this.monsterDirectionMode = mode
    }

    getMonsterDirectionMode() {
        return this.monsterDirectionMode
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
            R2S(this.frequency)

        if (this.timedUnspawn !== undefined) {
            text = text + '   unspawn:' + R2S(this.timedUnspawn) + 's'
        }

        return text
    }

    displayForPlayer = (p: player) => {
        Text.P_timed(p, Constants.TERRAIN_DATA_DISPLAY_TIME, this.toText())
    }

    getForcedDistance = () => this.forcedDistance
    setForcedDistance = (forcedDistance: number) => {
        this.forcedDistance = forcedDistance
    }
    getSpawnAmount = () => this.spawnAmount
    setSpawnAmount = (spawnAmount: number) => {
        this.spawnAmount = spawnAmount
    }

    getSpawnOffset = () => this.spawnOffset
    setSpawnOffset = (spawnOffset: number) => {
        this.spawnOffset = spawnOffset
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
    setFixedSpawnOffsetBounce = (fixedSpawnOffsetBounce: boolean) => {
        this.fixedSpawnOffsetBounce = fixedSpawnOffsetBounce
    }

    getFixedSpawnOffsetMirrored = () => this.fixedSpawnOffsetMirrored
    setFixedSpawnOffsetMirrored = (fixedSpawnOffsetMirrored: boolean) => {
        this.fixedSpawnOffsetMirrored = fixedSpawnOffsetMirrored
    }

    getTimedUnspawn = () => this.timedUnspawn
    setTimedUnspawn = (timedUnspawn: number | undefined) => {
        this.timedUnspawn = timedUnspawn
        this.mecRegion?.setIsLeaveZoneEnabled(timedUnspawn === undefined)
        this._active && this.refresh()
    }

    getLastSpawnVal = () => {
        return this.lastSpawnVal
    }
    setLastSpawnVal = (lastSpawnVal: number) => {
        this.lastSpawnVal = lastSpawnVal
    }
    getBouncing = () => {
        return this.bouncing
    }
    setBouncing = (bouncing: boolean) => {
        this.bouncing = bouncing
    }
    getMirrored = () => {
        return this.mirrored
    }
    setMirrored = (mirrored: boolean) => {
        this.mirrored = mirrored
    }
    getSpawnIndex(): number {
        return this.spawnIndex
    }
    setSpawnIndex(value: number) {
        this.spawnIndex = value
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
        output['mecRegion'] = this.mecRegion?.toJson()
        output['frequency'] = this.frequency
        output['spawnAmount'] = this.spawnAmount
        output['initialDelay'] = this.initialDelay
        output['timedUnspawn'] = this.timedUnspawn
        output['monsterDirectionMode'] = this.monsterDirectionMode
        output['fixedSpawnOffset'] = this.fixedSpawnOffset
        output['spawnOffset'] = this.spawnOffset
        output['fixedSpawnOffsetBounce'] = this.fixedSpawnOffsetBounce
        output['fixedSpawnOffsetMirrored'] = this.fixedSpawnOffsetMirrored

        return output
    }
}
