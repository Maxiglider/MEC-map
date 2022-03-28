import { MOBS_VARIOUS_COLORS } from 'core/01_libraries/Constants'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { CommandsFunctions } from 'core/06_COMMANDS/COMMANDS_vJass/Command_functions'
import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { Monster, MonsterInterface } from './MonsterInterface'
import { MonstersClickableSetLife } from './trig_Monsters_clickable_set_life'

export class MonsterNoMove implements Monster {
    private static nbInstances = 0
    private id: number
    u: unit
    private mt: MonsterType
    private disablingTimer: timer
    //color
    private baseColorId: number
    private vcRed: number
    private vcGreen: number
    private vcBlue: number
    private vcTransparency: number

    private x: number
    private y: number
    private angle: number //-1 -> random

    constructor(mt: MonsterType, x: number, y: number, angle: number) {
        MonsterNoMove.nbInstances = MonsterNoMove.nbInstances + 1
        this.mt = mt
        this.x = x
        this.y = y
        this.angle = angle
        this.life = 0
        this.id = GetNextMonsterId()
        MonsterHashtableSetMonsterId(m, NO_ID, m.id)
        this.disablingTimer = null
        //color
        this.baseColorId = -1
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = 0
    }

    static count = (): number => {
        return MonsterNoMove.nbInstances
    }

    getId = (): number => {
        return this.id
    }

    setId = (id: number): MonsterNoMove => {
        if (id === this.id) {
            return _this
        }
        MonsterHashtableSetMonsterId(_this, this.id, id)
        this.id = id
        MonsterIdHasBeenSetTo(id)
        return _this
    }

    removeUnit = () => {
        if (this.u !== null) {
            GroupRemoveUnit(MonstersClickableSetLife.monstersClickable, this.u)
            RemoveUnit(this.u)
            this.u = null
            this.disablingTimer = null
        }
    }

    killUnit = () => {
        if (this.u !== null && IsUnitAliveBJ(this.u)) {
            KillUnit(this.u)
        }
    }

    destroy = () => {
        if (this.u !== null) {
            this.removeUnit()
        }
        this.level.monstersNoMove.setMonsterNull(this.arrayId)
        MonsterNoMove.nbInstances = MonsterNoMove.nbInstances - 1
        if (ClearTriggerMobId2ClearMob(this.id) !== 0) {
            ClearTriggerMobId2ClearMob(this.id).destroy()
        }
        MonsterHashtableRemoveMonsterId(this.id)
    }

    createUnit = () => {
        let clearMob = ClearTriggerMobId2ClearMob(this.id)
        let disablingTimer = this.disablingTimer
        let previouslyEnabled = this.u !== null
        let isMonsterAlive = IsUnitAliveBJ(this.u)
        if (previouslyEnabled) {
            this.removeUnit()
        }
        this.u = NewImmobileMonster(this.mt, this.x, this.y, this.angle)
        SetUnitUserData(this.u, this.id)
        if (this.mt.isClickable()) {
            this.life = this.mt.getMaxLife()
            GroupAddUnit(MonstersClickableSetLife.monstersClickable, this.u)
        }
        if (previouslyEnabled) {
            if (disablingTimer !== null && TimerGetRemaining(disablingTimer) > 0) {
                this.temporarilyDisable(disablingTimer)
            }
            if (!isMonsterAlive) {
                this.killUnit()
            }
            if (this.baseColorId !== -1) {
                if (this.baseColorId === 0) {
                    SetUnitColor(this.u, PLAYER_COLOR_RED)
                } else {
                    SetUnitColor(this.u, ConvertPlayerColor(this.baseColorId))
                }
            }
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }
        if (clearMob !== 0) {
            clearMob.redoTriggerMobPermanentEffect()
        }
        disablingTimer = null
    }

    getLife = (): number => {
        return this.life
    }

    setLife = (life: number) => {
        this.life = life
        if (life > 0) {
            SetUnitLifeBJ(this.u, I2R(life) - 0.5)
        } else {
            this.killUnit()
        }
    }

    getMonsterType = (): MonsterType => {
        return this.mt
    }

    setMonsterType = (mt: MonsterType): boolean => {
        if (mt === 0 || mt === this.mt) {
            return false
        }
        this.mt = mt
        this.createUnit()
        return true
    }

    toString = (): string => {
        let str: string
        if (this.mt.theAlias != null && this.mt.theAlias != '') {
            str = this.mt.theAlias + CACHE_SEPARATEUR_PARAM
        } else {
            str = this.mt.label + CACHE_SEPARATEUR_PARAM
        }
        str = str + I2S(this.id) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
        str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.angle))
        return str
    }

    temporarilyDisable = (disablingTimer: timer) => {
        if (
            this.disablingTimer === null ||
            this.disablingTimer === disablingTimer ||
            TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer)
        ) {
            this.disablingTimer = disablingTimer
            UnitRemoveAbility(this.u, this.mt.getImmolationSkill())
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, MonsterInterface.DISABLE_TRANSPARENCY)
            this.vcTransparency = MonsterInterface.DISABLE_TRANSPARENCY
        }
    }

    temporarilyEnable = (disablingTimer: timer) => {
        if (this.disablingTimer === disablingTimer) {
            UnitAddAbility(this.u, this.mt.getImmolationSkill())
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, 0)
            this.vcTransparency = 0
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
            if (this.u !== null) {
                if (baseColorId === 0) {
                    SetUnitColor(this.u, PLAYER_COLOR_RED)
                } else {
                    SetUnitColor(this.u, ConvertPlayerColor(baseColorId))
                }
            }
        }
    }

    setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number) => {
        this.vcRed = vcRed
        this.vcGreen = vcGreen
        this.vcBlue = vcBlue
        if (this.u !== null) {
            SetUnitVertexColorBJ(this.u, vcRed, vcGreen, vcBlue, this.vcTransparency)
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
        if (this.u !== null) {
            if (MOBS_VARIOUS_COLORS) {
                initBaseColorId = GetPlayerId(GetOwningPlayer(this.u))
            } else {
                initBaseColorId = 12
            }
            if (initBaseColorId === 0) {
                SetUnitColor(this.u, PLAYER_COLOR_RED)
            } else {
                SetUnitColor(this.u, ConvertPlayerColor(initBaseColorId))
            }
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }
    }
}
