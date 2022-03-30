import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { MOBS_VARIOUS_COLORS, PATROL_DISTANCE_MIN } from 'core/01_libraries/Constants'
import { ColorCodes } from 'core/01_libraries/Init_colorCodes'
import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { CommandsFunctions } from '../../06_COMMANDS/COMMANDS_vJass/Command_functions'
import { EscaperFunctions } from '../Escaper/Escaper_functions'
import { Monster } from './MonsterInterface'
import { MonsterType } from './MonsterType'
import { MonstersClickableSetLife } from './trig_Monsters_clickable_set_life'

const initMonsterMultiplePatrols = () => {
    const NewRegion = (x: number, y: number): region => {
        let r = Rect(x - 16, y - 16, x + 16, y + 16)
        let R = CreateRegion()
        RegionAddRect(R, r)
        RemoveRect(r)
        ;(r as any) = null
        return R
    }

    const MonsterMultiplePatrols_move_Actions = (): void => {
        let monster: Monster
        let MMP: MonsterMultiplePatrols
        if (EscaperFunctions.IsHero(GetTriggerUnit())) {
            return
        }
        monster = Monster.MonsterId2Monster(GetUnitUserData(GetTriggerUnit()))
        if (monster instanceof MonsterMultiplePatrols) {
            MMP = MonsterMultiplePatrols(integer(monster))
            if (MMP.getCurrentTrigger() == GetTriggeringTrigger()) {
                MMP.nextMove()
            }
        }
    }

    return { NewRegion, MonsterMultiplePatrols_move_Actions }
}

const MonsterMultiplePatrolss = initMonsterMultiplePatrols()

const MMPNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]

export class MonsterMultiplePatrols implements Monster {
    static NB_MAX_LOC: number = 20
    static nbInstances: number = 0
    static X: number[]
    static Y: number[]
    static staticLastLocInd: number = -1

    private id: number
    u: unit | null
    private mt: MonsterType
    private disablingTimer: timer
    //color
    private baseColorId: number
    private vcRed: real
    private vcGreen: real
    private vcBlue: real
    private vcTransparency: real

    private lastLocInd: number
    private currentMove: number
    private sens: number //0 : normal toujours positif, 1 : sens normal avec changement, 2 : sens inversé avec changement

    private xMap: number[] = []
    private yMap: number[] = []
    private rMap: region[] = []
    tMap: trigger[] = []
    currentTrigger: trigger

    static count = (): number => {
        return MonsterMultiplePatrols.nbInstances
    }

    static storeNewLoc = (x: number, y: number): boolean => {
        if (MonsterMultiplePatrols.staticLastLocInd >= MonsterMultiplePatrols.NB_MAX_LOC - 1) {
            return false
        }
        MonsterMultiplePatrols.staticLastLocInd = MonsterMultiplePatrols.staticLastLocInd + 1
        MonsterMultiplePatrols.X[MonsterMultiplePatrols.staticLastLocInd] = x
        MonsterMultiplePatrols.Y[MonsterMultiplePatrols.staticLastLocInd] = y
        return true
    }

    static destroyLocs = (): void => {
        MonsterMultiplePatrols.staticLastLocInd = -1
    }

    getId = (): number => {
        return this.id
    }

    setId = (id: number): MonsterMultiplePatrols => {
        if (id === this.id) {
            return this
        }
        Monster.MonsterHashtableSetMonsterId(this, this.id, id)
        this.id = id
        Monster.MonsterIdHasBeenSetTo(id)
        return this
    }

    getCurrentTrigger = (): trigger => {
        return this.currentTrigger
    }

    removeUnit = (): void => {
        if (this.u !== null) {
            GroupRemoveUnit(MonstersClickableSetLife.monstersClickable, this.u)
            RemoveUnit(this.u)
            this.u = null
        }
    }

    killUnit = (): void => {
        if (this.u !== null && IsUnitAliveBJ(this.u)) {
            KillUnit(this.u)
        }
    }

    destroy = () => {
        while (true) {
            if (!this.destroyLastLoc()) break
        }
        if (this.u !== null) {
            this.removeUnit()
        }
        this.level.monstersMultiplePatrols.setMonsterNull(this.arrayId)
        MonsterMultiplePatrols.nbInstances = MonsterMultiplePatrols.nbInstances - 1
        if (ClearTriggerMobId2ClearMob(this.id) !== 0) {
            ClearTriggerMobId2ClearMob(this.id).destroy()
        }
        MonsterHashtableRemoveMonsterId(this.id)
    }

    disableTrigger = (id: number) => {
        DisableTrigger(this.tMap[id])
    }

    activateMove = (id: number): void => {
        EnableTrigger(this.tMap[id])
        this.currentTrigger = this.tMap[id]
        IssuePointOrder(this.u, 'move', this.xMap[id], this.yMap[id])
    }

    nextMove = (): void => {
        this.disableTrigger(this.currentMove)
        if (this.sens === 0 || this.sens === 1) {
            if (this.currentMove >= this.lastLocInd) {
                if (this.sens === 0) {
                    this.currentMove = 0
                } else {
                    this.sens = 2
                    this.currentMove = this.currentMove - 1
                }
            } else {
                this.currentMove = this.currentMove + 1
            }
        } else {
            if (this.currentMove <= 0) {
                this.sens = 1
                this.currentMove = 1
            } else {
                this.currentMove = this.currentMove - 1
            }
        }
        this.activateMove(this.currentMove)
    }

    static create = (mt: MonsterType, mode: string) => {
        //mode == "normal" (0, 1, 2, 3, 0 , 1...) ou mode == "string" (0, 1, 2, 3, 2, 1...)
        let m: MonsterMultiplePatrols
        let i: number

        if (mode !== 'normal' && mode !== 'string') {
            return null
        }
        m = MonsterMultiplePatrols.allocate()
        MonsterMultiplePatrols.nbInstances = MonsterMultiplePatrols.nbInstances + 1
        m.mt = mt
        if (mode === 'normal') {
            m.sens = 0
        } else {
            m.sens = 1
        }

        MMPNumbers.forEach(n => {
            if (n <= MonsterMultiplePatrols.staticLastLocInd) {
                m.xMap[n] = MonsterMultiplePatrols.X[n]
                m.yMap[n] = MonsterMultiplePatrols.Y[n]
                m.rMap[n] = MonsterMultiplePatrolss.NewRegion(m.xMap[n], m.yMap[n])
                m.tMap[n] = CreateTrigger()
                DisableTrigger(m.tMap[n])
                TriggerAddAction(m.tMap[n], MonsterMultiplePatrolss.MonsterMultiplePatrols_move_Actions)
                TriggerRegisterEnterRegionSimple(m.tMap[n], m.rMap[n])
            }
        })

        m.lastLocInd = MonsterMultiplePatrols.staticLastLocInd
        //call Text_A("test, lastLocInd == " + I2S(m.lastLocInd))
        m.currentMove = -1
        MonsterMultiplePatrols.destroyLocs()
        m.life = 0
        m.id = Monster.GetNextMonsterId()
        Monster.MonsterHashtableSetMonsterId(m, NO_ID, m.id)
        m.disablingTimer = null
        //color
        m.baseColorId = -1
        m.vcRed = 100
        m.vcGreen = 100
        m.vcBlue = 100
        m.vcTransparency = 0
        return m
    }

    createUnit = (): void => {
        let clearMob = ClearTriggerMobId2ClearMob(this.id)
        let disablingTimer = this.disablingTimer
        let previouslyEnabled = this.u !== null
        let isMonsterAlive = IsUnitAliveBJ(this.u)
        if (previouslyEnabled) {
            this.removeUnit()
        }
        if (this.lastLocInd <= 0) {
            return
        }
        this.u = NewPatrolMonster(this.mt, this.x0, this.y0, this.x1, this.y1)
        SetUnitUserData(this.u, this.id)
        this.currentMove = 1
        if (this.sens === 2) {
            this.sens = 1
        }
        EnableTrigger(this.t1)
        this.currentTrigger = this.t1
        if (this.mt.isClickable()) {
            this.life = this.mt.getMaxLife()
            GroupAddUnit(monstersClickable, this.u)
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

    setLife = (life: number): void => {
        this.life = life
        if (life > 0) {
            SetUnitLifeBJ(this.u, I2R(life) - 0.5)
        } else {
            this.killUnit()
        }
    }

    getX = (id: number) => {
        return this.xMap[id]
    }

    getY = (id: number): number => {
        return this.yMap[id]
    }

    destroyLastLoc = (): boolean => {
        if (this.lastLocInd === 1) {
            DisableTrigger(this.t0)
            DestroyTrigger(this.t1)
            this.t1 = null
            RemoveRegion(this.r1)
            this.r1 = null
            RemoveUnit(this.u)
            this.u = null
        }

        MMPNumbers.forEach(n => {
            if (this.lastLocInd === n) {
                DestroyTrigger(this.tMap[n])
                this.tMap[n] = null
                RemoveRegion(this.rMap[n])
                this.rMap[n] = null
                if (n === this.currentMove) {
                    this.currentMove = this.currentMove - 1
                    this.activateMove(this.currentMove)
                }
            }
        })

        if (this.lastLocInd < 0) {
            return false
        }
        this.lastLocInd = this.lastLocInd - 1
        return true
    }

    addNewLocAt = (id: number, x: number, y: number): void => {
        this.xMap[id] = x
        this.yMap[id] = y
        this.rMap[id] = MonsterMultiplePatrolss.NewRegion(x, y)
        this.tMap[id] = CreateTrigger()
        DisableTrigger(this.tMap[id])
        TriggerAddAction(this.tMap[id], MonsterMultiplePatrolss.MonsterMultiplePatrols_move_Actions)
        TriggerRegisterEnterRegionSimple(this.tMap[id], this.rMap[id])
    }

    addNewLoc = (x: number, y: number): number => {
        if (this.lastLocInd >= MonsterMultiplePatrols.NB_MAX_LOC - 1) {
            return 3
        }
        if (
            BasicFunctions.GetLocDist(this.getX(this.lastLocInd), this.getY(this.lastLocInd), x, y) <=
            PATROL_DISTANCE_MIN
        ) {
            return 2
        }
        if (this.sens === 0 && BasicFunctions.GetLocDist(this.x0, this.y0, x, y) <= PATROL_DISTANCE_MIN) {
            return 1
        }
        this.lastLocInd = this.lastLocInd + 1
        this.addNewLocAt(this.lastLocInd, x, y)
        if (this.lastLocInd === 1) {
            this.createUnit()
        }
        return 0
    }

    getMonsterType = (): MonsterType => {
        return this.mt
    }

    setMonsterType = (mt: MonsterType): boolean => {
        if (mt === null || mt === this.mt) {
            return false
        }
        this.mt = mt
        this.createUnit()
        return true
    }

    temporarilyDisable = (disablingTimer: timer): void => {
        if (
            this.disablingTimer === null ||
            this.disablingTimer === disablingTimer ||
            TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer)
        ) {
            this.disablingTimer = disablingTimer
            UnitRemoveAbility(this.u, this.mt.getImmolationSkill())
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, Monster.DISABLE_TRANSPARENCY)
            this.vcTransparency = Monster.DISABLE_TRANSPARENCY
        }
    }

    temporarilyEnable = (disablingTimer: timer): void => {
        if (this.disablingTimer === disablingTimer) {
            UnitAddAbility(this.u, this.mt.getImmolationSkill())
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, 0)
            this.vcTransparency = 0
        }
    }

    setBaseColor = (colorString: string): void => {
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

    setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number): void => {
        this.vcRed = vcRed
        this.vcGreen = vcGreen
        this.vcBlue = vcBlue
        if (this.u !== null) {
            SetUnitVertexColorBJ(this.u, vcRed, vcGreen, vcBlue, this.vcTransparency)
        }
    }

    reinitColor = (): void => {
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

    toString = (): string => {
        let str: string
        if (this.mt.theAlias != null && this.mt.theAlias != '') {
            str = this.mt.theAlias + CACHE_SEPARATEUR_PARAM
        } else {
            str = this.mt.label + CACHE_SEPARATEUR_PARAM
        }
        str = str + I2S(this.id) + CACHE_SEPARATEUR_PARAM
        if (this.sens > 0) {
            str = str + 'string'
        } else {
            str = str + 'normal'
        }

        MMPNumbers.forEach(n => {
            if (this.lastLocInd < n) {
                return str
            }

            str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.xMap[n])) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.yMap[n]))
        })

        return str
    }
}
