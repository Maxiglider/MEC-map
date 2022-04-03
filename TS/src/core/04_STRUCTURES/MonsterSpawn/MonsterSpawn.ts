import { getUdgMonsterTypes } from '../../../../globals'
const udg_monsterTypes = getUdgMonsterTypes()
import { GetCurrentMonsterPlayer } from '../../01_libraries/Basic_functions'
import { ENNEMY_PLAYER, GREY, MOBS_VARIOUS_COLORS, TERRAIN_DATA_DISPLAY_TIME } from '../../01_libraries/Constants'
import { udg_colorCode } from '../../01_libraries/Init_colorCodes'
import { Text } from '../../01_libraries/Text'
import { CACHE_SEPARATEUR_PARAM } from '../../07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { Level } from '../Level/Level'
import { MonsterType } from '../Monster/MonsterType'
import { NewImmobileMonsterForPlayer } from '../Monster/Monster_functions'

const DECALAGE_UNSPAWN = 200
const DELAY_BETWEEN_SPAWN_AND_MOVEMENT = 0.5

const RemoveEnumMonster = (): void => {
    RemoveUnit(GetEnumUnit())
}

const MonsterStartMovement = (): void => {
    let mobTimer = GetExpiredTimer()
    let ms = MonsterSpawn.anyTimerId2MonsterSpawn.get(GetHandleId(mobTimer)) //todomax check that it works
    if (ms) {
        let mobUnit = MonsterSpawn.anyTimerId2Unit.get(GetHandleId(mobTimer))
        if (mobUnit) {
            ms.startMobMovement(mobUnit)
            UnitAddAbility(mobUnit, FourCC('Aloc'))
            DestroyTimer(mobTimer)
        }
    }
}

const MonsterSpawn_Actions = (): void => {
    let ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))
    if (ms) {
        let mobUnit = ms.createMob()
        let mobTimer = CreateTimer()
        MonsterSpawn.anyTimerId2MonsterSpawn.set(GetHandleId(mobTimer), ms)
        MonsterSpawn.anyTimerId2Unit.set(GetHandleId(mobTimer), mobUnit)
        TimerStart(mobTimer, DELAY_BETWEEN_SPAWN_AND_MOVEMENT, false, MonsterStartMovement)
        SetUnitOwner(mobUnit, ENNEMY_PLAYER, false)
        ShowUnit(mobUnit, false)
        UnitRemoveAbility(mobUnit, FourCC('Aloc'))
        ms.monsters && GroupAddUnit(ms.monsters, mobUnit)
    }
}

const UnspawMonster_Actions = (): void => {
    let ms = MonsterSpawn.anyTrigId2MonsterSpawn.get(GetHandleId(GetTriggeringTrigger()))
    if (ms && ms.monsters && IsUnitInGroup(GetTriggerUnit(), ms.monsters)) {
        GroupRemoveUnit(ms.monsters, GetTriggerUnit())
        RemoveUnit(GetTriggerUnit())
    }
}

export const udg_monsterSpawns: MonsterSpawn[] = []

export class MonsterSpawn {
    static anyTrigId2MonsterSpawn = new Map<number, MonsterSpawn>()
    static anyTimerId2Unit = new Map<number, unit>()
    static anyTimerId2MonsterSpawn = new Map<number, MonsterSpawn>()

    private label: string
    private mt: MonsterType
    private sens: string //leftToRight, upToDown, rightToLeft, downToUp
    private frequence: number
    private minX: number
    private minY: number
    private maxX: number
    private maxY: number
    private tSpawn?: trigger
    private tUnspawn?: trigger
    private unspawnReg?: region
    monsters?: group

    level?: Level
    id: number

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
        this.label = label
        this.mt = mt
        this.sens = sens
        this.frequence = frequence
        this.minX = RMinBJ(x1, x2)
        this.minY = RMinBJ(y1, y2)
        this.maxX = RMaxBJ(x1, x2)
        this.maxY = RMaxBJ(y1, y2)

        this.id = udg_monsterSpawns.length
        udg_monsterSpawns[this.id] = this
    }

    getId() {
        return this.id
    }

    getLabel = (): string => {
        return this.label
    }

    deactivate = (): void => {
        //todomax former name : desactivate
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
            ForGroup(this.monsters, RemoveEnumMonster)
            DestroyGroup(this.monsters)
            delete this.monsters
        }
    }

    private createUnspawnReg = (): void => {
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

    activate = (): void => {
        this.monsters = CreateGroup()

        this.tSpawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
        TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)

        this.createUnspawnReg()
        this.tUnspawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tUnspawn), this)
        this.unspawnReg && TriggerRegisterEnterRegion(this.tUnspawn, this.unspawnReg, null)
        TriggerAddAction(this.tUnspawn, UnspawMonster_Actions)
    }

    destroy = (): void => {
        this.deactivate()
        this.level && this.level.monsterSpawns.removeMonsterSpawn(this.id)
        delete udg_monsterSpawns[this.id]
    }

    startMobMovement = (mobUnit: unit): void => {
        let p: player
        let x1: number
        let y1: number
        let x2: number
        let y2: number
        //leftToRight, upToDown, rightToLeft, downToUp
        if (this.sens === 'leftToRight') {
            x1 = this.minX
            x2 = this.maxX + DECALAGE_UNSPAWN
            y1 = GetRandomReal(this.minY, this.maxY)
            y2 = y1
        } else if (this.sens === 'upToDown') {
            x1 = GetRandomReal(this.minX, this.maxX)
            x2 = x1
            y1 = this.maxY
            y2 = this.minY - DECALAGE_UNSPAWN
        } else if (this.sens === 'rightToLeft') {
            x1 = this.maxX
            x2 = this.minX - DECALAGE_UNSPAWN
            y1 = GetRandomReal(this.minY, this.maxY)
            y2 = y1
        } else {
            x1 = GetRandomReal(this.minX, this.maxX)
            x2 = x1
            y1 = this.minY
            y2 = this.maxY + DECALAGE_UNSPAWN
        }
        SetUnitX(mobUnit, x1)
        SetUnitY(mobUnit, y1)
        if (udg_monsterTypes.monsterUnit2MonsterType(mobUnit)?.isClickable()) {
            p = ENNEMY_PLAYER
        } else {
            p = GetCurrentMonsterPlayer()
        }
        SetUnitOwner(mobUnit, p, MOBS_VARIOUS_COLORS)
        ShowUnit(mobUnit, true)
        IssuePointOrder(mobUnit, 'move', x2, y2)
    }

    createMob = (): unit => {
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
        return NewImmobileMonsterForPlayer(
            this.mt,
            ENNEMY_PLAYER,
            (this.minX + this.maxX) / 2,
            (this.minY + this.maxY) / 2,
            angle
        )
    }

    setLabel = (newLabel: string): void => {
        this.label = newLabel
    }

    setMonsterType = (mt: MonsterType): void => {
        this.mt = mt
    }

    setSens = (sens: string): void => {
        this.sens = sens
        this.deactivate()
        this.activate()
    }

    setFrequence = (frequence: number): void => {
        this.frequence = frequence
        this.tSpawn && DestroyTrigger(this.tSpawn)
        this.tSpawn = CreateTrigger()
        MonsterSpawn.anyTrigId2MonsterSpawn.set(GetHandleId(this.tSpawn), this)
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
        TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)
    }

    displayForPlayer = (p: player): void => {
        let display =
            udg_colorCode[GREY] + this.label + ' : ' + this.mt.label + '   ' + this.sens + '   ' + R2S(this.frequence)
        Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    toString = (): string => {
        let str = this.label + CACHE_SEPARATEUR_PARAM
        if (this.mt.theAlias != null && this.mt.theAlias != '') {
            str = str + this.mt.theAlias + CACHE_SEPARATEUR_PARAM
        } else {
            str = str + this.mt.label + CACHE_SEPARATEUR_PARAM
        }
        str = str + this.sens + CACHE_SEPARATEUR_PARAM + R2S(this.frequence) + CACHE_SEPARATEUR_PARAM
        str =
            str +
            I2S(R2I(this.minX)) +
            CACHE_SEPARATEUR_PARAM +
            I2S(R2I(this.minY)) +
            CACHE_SEPARATEUR_PARAM +
            I2S(R2I(this.maxX)) +
            CACHE_SEPARATEUR_PARAM +
            I2S(R2I(this.maxY))
        return str
    }
}
