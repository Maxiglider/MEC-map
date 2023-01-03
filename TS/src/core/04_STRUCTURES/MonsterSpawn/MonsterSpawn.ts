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
    private initialDelay = 0
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number
    private tSpawn?: trigger
    private tUnspawn?: trigger
    private unspawnReg?: region
    monsters?: group

    private fixedSpawnOffset: number | undefined
    private lastSpawnVal: number | undefined

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
        this.minX = RMinBJ(x1, x2)
        this.minY = RMinBJ(y1, y2)
        this.maxX = RMaxBJ(x1, x2)
        this.maxY = RMaxBJ(y1, y2)
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

        if (this.unspawnReg) {
            RemoveRegion(this.unspawnReg)
            delete this.unspawnReg
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
        let r: rect
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
        r = Rect(x1, y1, x2, y2)

        this.unspawnReg = CreateRegion()
        RegionAddRect(this.unspawnReg, r)
        RemoveRect(r)
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
                ms.startMobMovement(mobUnit, ms)
                UnitAddAbility(mobUnit, FourCC('Aloc'))
                DestroyTimer(mobTimer)
            }
        }
    }

    private MonsterSpawn_Actions = errorHandler(() => {
        const ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))
        if (ms) {
            for (let i = 0; i < ms.getSpawnAmount(); i++) {
                const mobUnit = ms.createMob()
                if (mobUnit) {
                    const mobTimer = CreateTimer()
                    MonsterSpawn.anyTimerId2MonsterSpawn.set(GetHandleId(mobTimer), ms)
                    MonsterSpawn.anyTimerId2Unit.set(GetHandleId(mobTimer), mobUnit)
                    TimerStart(mobTimer, DELAY_BETWEEN_SPAWN_AND_MOVEMENT, false, this.MonsterStartMovement)
                    SetUnitOwner(mobUnit, ENNEMY_PLAYER, false)
                    ShowUnit(mobUnit, false)
                    UnitRemoveAbility(mobUnit, FourCC('Aloc'))
                    ms.monsters && GroupAddUnit(ms.monsters, mobUnit)
                }
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

    calcValOffset = (a: number, b: number) => {
        let valOffset = GetRandomReal(a, b)

        if (this.fixedSpawnOffset !== undefined) {
            if (this.lastSpawnVal === undefined) {
                this.lastSpawnVal = a
            }

            this.lastSpawnVal += this.fixedSpawnOffset

            if (this.lastSpawnVal >= b) {
                this.lastSpawnVal = a
            }

            valOffset = this.lastSpawnVal
        }

        return valOffset
    }

    startMobMovement = (mobUnit: unit, ms: MonsterSpawn) => {
        let p: player
        let x1: number
        let y1: number
        let x2: number
        let y2: number

        //leftToRight, upToDown, rightToLeft, downToUp
        if (this.sens === 'leftToRight') {
            x1 = this.minX
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = this.calcValOffset(this.minY, this.maxY)
            y2 = y1
        } else if (this.sens === 'upToDown') {
            x1 = this.calcValOffset(this.minX, this.maxX)
            x2 = x1
            y1 = this.maxY
            y2 = this.minY - DECALAGE_UNSPAWN
        } else if (this.sens === 'rightToLeft') {
            x1 = this.maxX
            x2 = this.minX - DECALAGE_UNSPAWN
            y1 = this.calcValOffset(this.minY, this.maxY)
            y2 = y1
        } else {
            x1 = this.calcValOffset(this.minX, this.maxX)
            x2 = x1
            y1 = this.minY
            y2 = this.maxY + DECALAGE_UNSPAWN
        }

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

    getInitialDelay = () => this.initialDelay
    setInitialDelay = (initialDelay: number) => {
        this.initialDelay = initialDelay
    }

    getFixedSpawnOffset = () => this.fixedSpawnOffset
    setFixedSpawnOffset = (fixedSpawnOffset: number | undefined) => {
        this.fixedSpawnOffset = fixedSpawnOffset
    }

    toJson = () => {
        const output = ObjectHandler.getNewObject<any>()

        output['label'] = this.label
        output['monsterTypeLabel'] = this.mt.label
        output['sens'] = this.sens
        output['frequence'] = this.frequence
        output['spawnAmount'] = this.spawnAmount
        output['initialDelay'] = this.initialDelay
        output['fixedSpawnOffset'] = this.fixedSpawnOffset
        output['minX'] = R2I(this.minX)
        output['minY'] = R2I(this.minY)
        output['maxX'] = R2I(this.maxX)
        output['maxY'] = R2I(this.maxY)

        return output
    }
}
