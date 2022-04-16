import { udg_monsters } from '../../../../globals'
import { MOBS_VARIOUS_COLORS } from '../../01_libraries/Constants'
import { ColorString2Id } from '../../01_libraries/Init_colorCodes'
import { IsColorString } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { Level } from '../Level/Level'
import { ClearMob } from '../Monster_properties/ClearMob'
import { PortalMob } from '../Monster_properties/PortalMob'
import { MonsterType } from './MonsterType'
import { monstersClickable } from './trig_Monsters_clickable_set_life'

export abstract class Monster {
    public static DISABLE_TRANSPARENCY = 80

    private static lastInstanceId = -1

    id: number
    u?: unit
    mt?: MonsterType
    level?: Level
    life: number
    createUnitFunc?: (this: void) => unit | undefined

    //color
    private baseColorId: number
    private vcRed: number
    private vcGreen: number
    private vcBlue: number
    private vcTransparency: number

    //disabling
    protected disablingTimer?: timer

    //clear mob that this mob is trigger mob
    protected clearMob?: ClearMob

    protected portalMob?: PortalMob

    constructor(monsterType?: MonsterType) {
        this.mt = monsterType
        this.id = ++Monster.lastInstanceId

        udg_monsters[this.id] = this

        this.life = 0

        //color
        this.baseColorId = -1
        this.vcRed = 100
        this.vcGreen = 100
        this.vcBlue = 100
        this.vcTransparency = 0
    }

    getId = () => {
        return this.id
    }

    setClearMob = (clearMob: ClearMob) => {
        this.clearMob = clearMob
    }

    getClearMob = () => {
        return this.clearMob
    }

    removeClearMob = () => {
        delete this.clearMob
    }

    setPortalMob = (portalMob: PortalMob) => {
        this.portalMob = portalMob
    }

    getPortalMob = () => {
        return this.portalMob
    }

    removePortalMob() {
        delete this.portalMob
    }

    removeUnit() {
        if (this.u) {
            GroupRemoveUnit(monstersClickable, this.u)
            RemoveUnit(this.u)
            delete this.u
            delete this.disablingTimer
        }
    }

    killUnit() {
        if (this.u && IsUnitAliveBJ(this.u)) {
            KillUnit(this.u)
        }
    }

    createUnit(createUnitFunc?: () => unit | undefined) {
        if (createUnitFunc) {
            this.createUnitFunc = createUnitFunc
        }

        if (!this.createUnitFunc) {
            return
        }

        let previouslyEnabled = !!this.u
        let isMonsterAlive = this.u && IsUnitAliveBJ(this.u)
        if (previouslyEnabled) {
            this.removeUnit()
        }
        this.u = this.createUnitFunc()

        this.u && SetUnitUserData(this.u, this.id)

        if (this.mt && this.mt.isClickable()) {
            this.life = this.mt.getMaxLife()
            this.u && GroupAddUnit(monstersClickable, this.u)
        }

        if (previouslyEnabled) {
            if (this.disablingTimer && TimerGetRemaining(this.disablingTimer) > 0) {
                this.temporarilyDisable(this.disablingTimer)
            }
            if (!isMonsterAlive) {
                this.killUnit()
            }
            if (this.baseColorId !== -1) {
                if (this.baseColorId === 0) {
                    this.u && SetUnitColor(this.u, PLAYER_COLOR_RED)
                } else {
                    this.u && SetUnitColor(this.u, ConvertPlayerColor(this.baseColorId))
                }
            }
            this.u && SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }

        if (this.clearMob) {
            this.clearMob.redoTriggerMobPermanentEffect()
        }
    }

    getLife = (): number => {
        return this.life
    }

    setLife = (life: number) => {
        this.life = life
        if (life > 0) {
            this.u && SetUnitLifeBJ(this.u, I2R(life) - 0.5)
        } else {
            this.killUnit()
        }
    }

    getMonsterType = () => {
        return this.mt
    }

    setMonsterType = (mt: MonsterType): boolean => {
        if (mt === this.mt) {
            return false
        }
        this.mt = mt
        this.createUnit()
        return true
    }

    temporarilyDisable = (disablingTimer: timer) => {
        if (
            !this.disablingTimer ||
            this.disablingTimer === disablingTimer ||
            TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer)
        ) {
            const immoSkill = this.mt?.getImmolationSkill() || 0

            this.disablingTimer = disablingTimer
            this.u && immoSkill > 0 && UnitRemoveAbility(this.u, immoSkill)
            this.u && SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, Monster.DISABLE_TRANSPARENCY)
            this.vcTransparency = Monster.DISABLE_TRANSPARENCY
        }
    }

    temporarilyEnable = (disablingTimer: timer) => {
        if (this.disablingTimer === disablingTimer) {
            const immoSkill = this.mt?.getImmolationSkill() || 0

            this.u && immoSkill > 0 && UnitAddAbility(this.u, immoSkill)
            this.u && SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, 0)
            this.vcTransparency = 0
        }
    }

    setBaseColor = (colorString: string) => {
        let baseColorId: number
        if (IsColorString(colorString)) {
            baseColorId = ColorString2Id(colorString)
            if (baseColorId < 0 || baseColorId > 12) {
                return
            }
            this.baseColorId = baseColorId
            if (this.u !== null) {
                if (baseColorId === 0) {
                    this.u && SetUnitColor(this.u, PLAYER_COLOR_RED)
                } else {
                    this.u && SetUnitColor(this.u, ConvertPlayerColor(baseColorId))
                }
            }
        }
    }

    setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number) => {
        this.vcRed = vcRed
        this.vcGreen = vcGreen
        this.vcBlue = vcBlue
        if (this.u !== null) {
            this.u && SetUnitVertexColorBJ(this.u, vcRed, vcGreen, vcBlue, this.vcTransparency)
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
            if (MOBS_VARIOUS_COLORS && this.u) {
                initBaseColorId = GetPlayerId(GetOwningPlayer(this.u))
            } else {
                initBaseColorId = 12
            }
            if (initBaseColorId === 0) {
                this.u && SetUnitColor(this.u, PLAYER_COLOR_RED)
            } else {
                this.u && SetUnitColor(this.u, ConvertPlayerColor(initBaseColorId))
            }
            this.u && SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, this.vcTransparency)
        }
    }

    destroy() {
        if (this.u) {
            this.removeUnit()
        }

        if (this.clearMob) {
            this.clearMob.destroy()
        }

        if (this.portalMob) {
            this.portalMob.destroy()
        }

        delete udg_monsters[this.id]

        this.level?.monsters.removeMonster(this.id)
    }

    toJson() {
        return {
            monsterClassName: this.constructor.name,
            monsterTypeLabel: this.mt?.label
        }
    }
}
