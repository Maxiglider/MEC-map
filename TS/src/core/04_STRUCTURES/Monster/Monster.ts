import { MemoryHandler } from 'Utils/MemoryHandler'
import { Timer } from 'w3ts'
import { udg_monsters } from '../../../../globals'
import { MOBS_VARIOUS_COLORS, NB_PLAYERS_MAX } from '../../01_libraries/Constants'
import { ColorString2Id } from '../../01_libraries/Init_colorCodes'
import { IsColorString } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { hooks } from '../../API/GeneralHooks'
import { CombineHooks } from '../../API/MecHookArray'
import { Level } from '../Level/Level'
import { CircleMob } from '../Monster_properties/CircleMob'
import { ClearMob } from '../Monster_properties/ClearMob'
import { PortalMob } from '../Monster_properties/PortalMob'
import { MonsterType } from './MonsterType'
import { monstersClickable } from './trig_Monsters_clickable_set_life'

export abstract class Monster {
    public static forceUnitTypeIdForNextMonster = 0

    public static forceXforNextMonster = 0
    public static forceYforNextMonster = 0
    public static forceX1forNextMonster = 0
    public static forceY1forNextMonster = 0
    public static forceX2forNextMonster = 0
    public static forceY2forNextMonster = 0

    public static DISABLE_TRANSPARENCY = 80

    public static lastInstanceId = -1

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
    private deleted = false

    //clear mob that this mob is trigger mob
    protected clearMob?: ClearMob
    protected portalMob?: PortalMob
    protected circleMob?: CircleMob
    protected circleMobParent?: CircleMob
    private jumpPad?: number
    private jumpPadEffect?: string

    private attackGroundX: number | undefined = undefined
    private attackGroundY: number | undefined = undefined
    private attackGroundDelay: number = 0

    constructor(monsterType?: MonsterType, forceId: number | null = null) {
        this.mt = monsterType

        if (forceId !== null) {
            this.id = forceId

            if (Monster.lastInstanceId < forceId) {
                Monster.lastInstanceId = forceId
            }
        } else {
            this.id = ++Monster.lastInstanceId
        }

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

    setCircleMob(circleMob: CircleMob) {
        this.circleMob = circleMob
    }

    getCircleMob = () => {
        return this.circleMob
    }

    removeCircleMob() {
        delete this.circleMob
    }

    setCircleMobParent(circleMobParent: CircleMob) {
        this.circleMobParent = circleMobParent
    }

    getCircleMobParent = () => {
        return this.circleMobParent
    }

    removeCircleMobParent() {
        delete this.circleMobParent
    }

    getCircleMobs() {
        return this.circleMob || this.circleMobParent
    }

    getJumpPad = () => this.jumpPad
    setJumpPad = (jumpPad: number | undefined) => {
        this.jumpPad = jumpPad
    }

    getJumpPadEffect = () => this.jumpPadEffect
    setJumpPadEffect = (jumpPadEffect: string | undefined) => {
        this.jumpPadEffect = jumpPadEffect
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
        if (this.isDeleted()) return

        if (createUnitFunc) {
            this.createUnitFunc = createUnitFunc
        }

        if (!this.createUnitFunc) {
            return
        }

        //hook onBeforeCreateMonsterUnit
        const hookArray = CombineHooks(
            this.level?.monsters.hooks_onBeforeCreateMonsterUnit,
            hooks.hooks_onBeforeCreateMonsterUnit
        )
        if (hookArray) {
            let forceUnitTypeId = 0
            let forceX = 0
            let forceY = 0
            let forceX1 = 0
            let forceY1 = 0
            let forceX2 = 0
            let forceY2 = 0
            let quit = false
            for (const hook of hookArray) {
                const output = hook.execute(this)
                if (output === false) {
                    quit = true
                } else if (output) {
                    output.unitTypeId && (forceUnitTypeId = output.unitTypeId)
                    output.x && (forceX = output.x)
                    output.y && (forceY = output.y)
                    output.x1 && (forceX1 = output.x1)
                    output.y1 && (forceY1 = output.y1)
                    output.x2 && (forceX2 = output.x2)
                    output.y2 && (forceY2 = output.y2)
                }
            }

            if (quit) {
                MemoryHandler.destroyArray(hookArray)
                return
            }

            forceUnitTypeId > 0 && (Monster.forceUnitTypeIdForNextMonster = forceUnitTypeId)
            forceX != 0 && (Monster.forceXforNextMonster = forceX)
            forceY != 0 && (Monster.forceYforNextMonster = forceY)
            forceX1 != 0 && (Monster.forceX1forNextMonster = forceX1)
            forceY1 != 0 && (Monster.forceY1forNextMonster = forceY1)
            forceX2 != 0 && (Monster.forceX2forNextMonster = forceX2)
            forceY2 != 0 && (Monster.forceY2forNextMonster = forceY2)
        }
        MemoryHandler.destroyArray(hookArray)

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

        //hook onAfterCreateMonsterUnit
        const hookArray2 = CombineHooks(
            this.level?.monsters.hooks_onAfterCreateMonsterUnit,
            hooks.hooks_onAfterCreateMonsterUnit
        )
        if (hookArray2) {
            for (const hook of hookArray2) {
                hook.execute(this)
            }
        }
        MemoryHandler.destroyArray(hookArray2)

        this.doAttackGroundPos()
    }

    delete = () => {
        if (this.u) {
            this.removeUnit()
        }

        this.deleted = true
    }

    undelete = () => {
        this.deleted = false
        this.createUnit()
    }

    isDeleted = () => {
        return this.deleted
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
            if (baseColorId < 0 || baseColorId > NB_PLAYERS_MAX) {
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

    hasAttackGroundPos = () => {
        return this.attackGroundX !== undefined && this.attackGroundY !== undefined
    }

    setAttackGroundPos = (x: number | undefined, y: number | undefined, delay: number = 0) => {
        this.attackGroundX = x
        this.attackGroundY = y
        this.attackGroundDelay = delay

        this.removeUnit()
        this.createUnit()
    }

    getAttackGroundDelay = () => {
        return this.attackGroundDelay
    }

    setAttackGroundDelay = (delay: number) => {
        this.attackGroundDelay = delay
    }

    doAttackGroundPos = () => {
        if (this.u && this.attackGroundX && this.attackGroundY) {
            if (this.attackGroundDelay > 0) {
                const targetUnit = this.u
                const targetX = this.attackGroundX
                const targetY = this.attackGroundY
                new Timer().start(this.attackGroundDelay, false, () => {
                    if (targetUnit && GetUnitTypeId(targetUnit) !== 0) {
                        IssuePointOrder(targetUnit, 'attackground', targetX, targetY)
                    }
                })
            } else {
                IssuePointOrder(this.u, 'attackground', this.attackGroundX, this.attackGroundY)
            }
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

        if (this.circleMob) {
            this.circleMob.destroy()
        }

        if (this.circleMobParent) {
            this.circleMobParent.removeMob(this.id)
        }

        delete udg_monsters[this.id]

        this.level?.monsters.removeMonster(this.id)
    }

    toJson(): false | { [x: string]: any } {
        if (this.isDeleted()) {
            return false
        } else {
            const output = MemoryHandler.getEmptyObject<any>()
            output['id'] = this.id
            output['monsterClassName'] = this.constructor.name
            output['monsterTypeLabel'] = this.mt?.label
            output['jumpPad'] = this.jumpPad
            output['jumpPadEffect'] = this.jumpPadEffect
            output['attackGroundX'] = this.attackGroundX
            output['attackGroundY'] = this.attackGroundY
            output['attackGroundDelay'] = this.attackGroundDelay
            return output
        }
    }
}
