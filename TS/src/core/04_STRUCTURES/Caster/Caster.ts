//todomax probably make Caster extends Monster

import { MOBS_VARIOUS_COLORS } from 'core/01_libraries/Constants'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { CommandsFunctions } from 'core/06_COMMANDS/COMMANDS_vJass/Command_functions'
import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { Escaper } from '../Escaper/Escaper'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/MonsterInterface'
import { MonsterCreationFunctions } from '../Monster/Monster_creation_functions'
import { CasterFunctions } from './Caster_functions'

const casterHashtable = InitHashtable()

export class Caster {
    private id: number
    level: Level
    arrayId: number
    private casterType: CasterType
    private x: number
    private y: number
    private angle: number
    private disablingTimer: timer
    //color
    private baseColorId: number
    private vcRed: number
    private vcGreen: number
    private vcBlue: number
    private vcTransparency: number

    casterUnit: unit
    private trg_unitWithinRange: trigger
    escapersInRange: Escaper[]
    nbEscapersInRange: number
    canShoot: boolean
    t: timer
    private enabled: boolean

    isEnabled = (): boolean => {
        return this.enabled
    }

    getId = (): number => {
        return this.id
    }

    setId = (id: number): Caster => {
        if (id === this.id) {
            return this
        }
        Monster.CasterHashtableSetCasterId(this, this.id, id)
        this.id = id
        Monster.MonsterIdHasBeenSetTo(id)
        return this
    }

    getX = (): number => {
        return this.x
    }

    getY = (): number => {
        return this.y
    }

    getRange = (): number => {
        return this.casterType.getRange()
    }

    getProjectileSpeed = (): number => {
        return this.casterType.getProjectileSpeed()
    }

    getCasterUnit = (): unit => {
        return this.casterUnit
    }

    getProjectileMonsterType = (): MonsterType => {
        return this.casterType.getProjectileMonsterType()
    }

    getLoadTime = (): number => {
        return this.casterType.getLoadTime()
    }

    getCasterType = (): CasterType => {
        return this.casterType
    }

    getAnimation = (): string => {
        return this.casterType.getAnimation()
    }

    constructor(casterType: CasterType, x: number, y: number, angle: number) {
        this.casterType = casterType
        this.x = x
        this.y = y
        this.angle = angle
        this.id = Monster.GetNextMonsterId()
        Monster.CasterHashtableSetCasterId(this, Monster.NO_ID, this.id)
        ;(this.disablingTimer as any) = null
        //color
        this.baseColorId = -1
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = 0
    }

    enable = () => {
        this.nbEscapersInRange = 0
        this.canShoot = true
        this.casterUnit = MonsterCreationFunctions.NewImmobileMonster(
            this.casterType.getCasterMonsterType(),
            this.x,
            this.y,
            this.angle
        )
        SetUnitUserData(this.casterUnit, this.id)
        this.trg_unitWithinRange = CreateTrigger()
        TriggerRegisterUnitInRangeSimple(this.trg_unitWithinRange, this.casterType.getRange(), this.casterUnit)
        TriggerAddAction(this.trg_unitWithinRange, CasterFunctions.CasterUnitWithinRange_Actions)
        SaveInteger(casterHashtable, 0, GetHandleId(this.trg_unitWithinRange), integer(this))
        this.t = CreateTimer()
        SaveInteger(casterHashtable, 1, GetHandleId(this.t), integer(this))
        this.enabled = true
    }

    disable = () => {
        RemoveSavedInteger(casterHashtable, 0, GetHandleId(this.trg_unitWithinRange))
        DestroyTrigger(this.trg_unitWithinRange)
        ;(this.trg_unitWithinRange as any) = null
        RemoveUnit(this.casterUnit)
        ;(this.casterUnit as any) = null
        RemoveSavedInteger(casterHashtable, 1, GetHandleId(this.t))
        DestroyTimer(this.t)
        ;(this.t as any) = null
        ;(this.disablingTimer as any) = null
    }

    killUnit = () => {
        KillUnit(this.casterUnit)
        RemoveSavedInteger(casterHashtable, 0, GetHandleId(this.trg_unitWithinRange))
        DestroyTrigger(this.trg_unitWithinRange)
        ;(this.trg_unitWithinRange as any) = null
        RemoveSavedInteger(casterHashtable, 1, GetHandleId(this.t))
        DestroyTimer(this.t)
        ;(this.t as any) = null
    }

    refresh = () => {
        let clearMob = ClearTriggerMobId2ClearMob(this.id)
        let disablingTimer = this.disablingTimer
        let isCasterAlive = IsUnitAliveBJ(this.casterUnit)
        if (this.casterUnit !== null) {
            this.disable()
            this.enable()
            if (disablingTimer !== null && TimerGetRemaining(disablingTimer) > 0) {
                this.temporarilyDisable(disablingTimer)
            }
            if (!isCasterAlive) {
                this.killUnit()
            }
            if (this.baseColorId !== -1) {
                if (this.baseColorId === 0) {
                    SetUnitColor(this.casterUnit, PLAYER_COLOR_RED)
                } else {
                    SetUnitColor(this.casterUnit, ConvertPlayerColor(this.baseColorId))
                }
            }
            SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }
        if (clearMob !== 0) {
            clearMob.redoTriggerMobPermanentEffect()
        }
        ;(disablingTimer as any) = null
    }

    destroy = () => {
        this.disable()
        this.level.casters.setCasterNull(this.arrayId)
        if (ClearTriggerMobId2ClearMob(this.id) !== 0) {
            ClearTriggerMobId2ClearMob(this.id).destroy()
        }
        Monster.CasterHashtableRemoveCasterId(this.id)
    }

    escaperOutOfRangeOrDead = (escaper: Escaper) => {
        let i = 0
        while (true) {
            if (escaper === this.escapersInRange[i] || i === this.nbEscapersInRange) break
            i = i + 1
        }
        if (i < this.nbEscapersInRange) {
            while (true) {
                if (i === this.nbEscapersInRange - 1) break
                this.escapersInRange[i] = this.escapersInRange[i + 1]
                i = i + 1
            }
            this.nbEscapersInRange = this.nbEscapersInRange - 1
        }
    }

    temporarilyDisable = (disablingTimer: timer) => {
        if (
            this.disablingTimer === null ||
            this.disablingTimer === disablingTimer ||
            TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer)
        ) {
            this.disablingTimer = disablingTimer
            UnitRemoveAbility(this.casterUnit, this.casterType.getCasterMonsterType().getImmolationSkill())
            SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, Monster.DISABLE_TRANSPARENCY)
            this.vcTransparency = Monster.DISABLE_TRANSPARENCY
            this.enabled = false
        }
    }

    temporarilyEnable = (disablingTimer: timer) => {
        if (this.disablingTimer === disablingTimer) {
            UnitAddAbility(this.casterUnit, this.casterType.getCasterMonsterType().getImmolationSkill())
            SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, 0)
            this.vcTransparency = 0
            this.enabled = true
        }
    }

    setBaseColor = (colorString: string) => {
        let baseColorId: number
        if (CommandsFunctions.IsColorString(colorString)) {
            baseColorId = ColorCodes.ColorString2Id(colorString)
            if (baseColorId < 0 || baseColorId > 12) {
                return
            }
            this.baseColorId = baseColorId
            if (this.casterUnit !== null) {
                if (baseColorId === 0) {
                    SetUnitColor(this.casterUnit, PLAYER_COLOR_RED)
                } else {
                    SetUnitColor(this.casterUnit, ConvertPlayerColor(baseColorId))
                }
            }
        }
    }

    setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number) => {
        this.vcRed = vcRed
        this.vcGreen = vcGreen
        this.vcBlue = vcBlue
        if (this.casterUnit !== null) {
            SetUnitVertexColorBJ(this.casterUnit, vcRed, vcGreen, vcBlue, this.vcTransparency)
        }
    }

    reinitColor = () => {
        let initBaseColorId: number
        //changement valeurs des champs
        this.baseColorId = -1
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = 0
        //changement couleur du mob actuel
        if (this.casterUnit !== null) {
            if (MOBS_VARIOUS_COLORS) {
                initBaseColorId = GetPlayerId(GetOwningPlayer(this.casterUnit))
            } else {
                initBaseColorId = 12
            }
            if (initBaseColorId === 0) {
                SetUnitColor(this.casterUnit, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(this.casterUnit, ConvertPlayerColor(initBaseColorId))
            }
            SetUnitVertexColorBJ(this.casterUnit, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }
    }

    toString = (): string => {
        let str: string
        if (this.casterType.theAlias != null && this.casterType.theAlias != '') {
            str = this.casterType.theAlias + CACHE_SEPARATEUR_PARAM
        } else {
            str = this.casterType.label + CACHE_SEPARATEUR_PARAM
        }
        str = str + I2S(this.id) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
        str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.angle))
        return str
    }
}
