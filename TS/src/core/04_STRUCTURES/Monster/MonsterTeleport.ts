import { Monster } from './MonsterInterface'

const initMonsterTeleport = () => {
    const WAIT = 1000000
    const HIDE = 2000000
    const MONSTER_TELEPORT_PERIOD_MIN = 0.1
    const MONSTER_TELEPORT_PERIOD_MAX = 10
    // TODO; Used to be public
    let monsterTeleportHashtable = InitHashtable()

    const MonsterTeleport_move_Actions = (): void => {
        let monster: Monster
        let MT = MonsterTeleport(LoadInteger(monsterTeleportHashtable, 0, GetHandleId(GetExpiredTimer())))
        if (MT === 0) {
            return
        }
        MT.nextMove()
    }
    //===========================================================
}

export class MonsterTeleport implements Monster {
    static NB_MAX_LOC: integer = 20
    static nbInstances: integer = 0
    static X: real[]
    static Y: real[]
    static staticLastLocInd: integer = -1

    private id: integer
    u: unit
    private mt: MonsterType
    private disablingTimer: timer
    //color
    private baseColorId: integer
    private vcRed: real
    private vcGreen: real
    private vcBlue: real
    private vcTransparency: real

    private period: real
    private angle: real

    private lastLocInd: integer
    private currentLoc: integer
    private sens: integer //0 : normal toujours positif, 1 : sens normal avec changement, 2 : sens inversé avec changement

    //! textmacro MT_Variables takes N
    private x: real$N$
    private y: real$N$
    //! endtextmacro
    //! runtextmacro MT_Variables( "0"  )
    //! runtextmacro MT_Variables( "1"  )
    //! runtextmacro MT_Variables( "2"  )
    //! runtextmacro MT_Variables( "3"  )
    //! runtextmacro MT_Variables( "4"  )
    //! runtextmacro MT_Variables( "5"  )
    //! runtextmacro MT_Variables( "6"  )
    //! runtextmacro MT_Variables( "7"  )
    //! runtextmacro MT_Variables( "8"  )
    //! runtextmacro MT_Variables( "9"  )
    //! runtextmacro MT_Variables( "10" )
    //! runtextmacro MT_Variables( "11" )
    //! runtextmacro MT_Variables( "12" )
    //! runtextmacro MT_Variables( "13" )
    //! runtextmacro MT_Variables( "14" )
    //! runtextmacro MT_Variables( "15" )
    //! runtextmacro MT_Variables( "16" )
    //! runtextmacro MT_Variables( "17" )
    //! runtextmacro MT_Variables( "18" )
    //! runtextmacro MT_Variables( "19" )
    private t: timer

    static count = (): number => {
        return MonsterTeleport.nbInstances
    }

    static storeNewLoc = (x: number, y: number): boolean => {
        if (MonsterTeleport.staticLastLocInd >= MonsterTeleport.NB_MAX_LOC - 1) {
            return false
        }
        MonsterTeleport.staticLastLocInd = MonsterTeleport.staticLastLocInd + 1
        MonsterTeleport.X[MonsterTeleport.staticLastLocInd] = x
        MonsterTeleport.Y[MonsterTeleport.staticLastLocInd] = y
        return true
    }

    static destroyLocs = (): void => {
        MonsterTeleport.staticLastLocInd = -1
    }

    getId = (): number => {
        return this.id
    }

    setId = (id: number): MonsterTeleport => {
        if (id === this.id) {
            return _this
        }
        MonsterHashtableSetMonsterId(_this, this.id, id)
        this.id = id
        MonsterIdHasBeenSetTo(id)
        return _this
    }

    removeUnit = (): void => {
        if (this.u !== null) {
            GroupRemoveUnit(monstersClickable, this.u)
            RemoveUnit(this.u)
            this.u = null
            PauseTimer(this.t)
        }
    }

    killUnit = (): void => {
        if (this.u !== null && IsUnitAliveBJ(this.u)) {
            KillUnit(this.u)
            PauseTimer(this.t)
        }
    }

    private destroy = (): void => {
        if (this.u !== null) {
            this.removeUnit()
        }
        this.level.monstersTeleport.setMonsterNull(this.arrayId)
        MonsterTeleport.nbInstances = MonsterTeleport.nbInstances - 1
        RemoveSavedInteger(monsterTeleportHashtable, 0, GetHandleId(this.t))
        DestroyTimer(this.t)
        this.t = null
        if (ClearTriggerMobId2ClearMob(this.id) !== 0) {
            ClearTriggerMobId2ClearMob(this.id).destroy()
        }
        MonsterHashtableRemoveMonsterId(this.id)
    }

    static create = (mt: MonsterType, period: number, angle: number, mode: string): MonsterTeleport => {
        //mode == "normal" (0, 1, 2, 3, 0 , 1...) ou mode == "string" (0, 1, 2, 3, 2, 1...)
        let m: MonsterTeleport
        let i: number

        if (
            (mode !== 'normal' && mode !== 'string') ||
            period < MONSTER_TELEPORT_PERIOD_MIN ||
            period > MONSTER_TELEPORT_PERIOD_MAX
        ) {
            return 0
        }
        m = MonsterTeleport.allocate()
        MonsterTeleport.nbInstances = MonsterTeleport.nbInstances + 1
        m.mt = mt
        if (mode === 'normal') {
            m.sens = 0
        } else {
            m.sens = 1
        }
        m.angle = angle
        m.period = period
        m.t = CreateTimer()
        SaveInteger(monsterTeleportHashtable, 0, GetHandleId(m.t), integer(m))

        //! textmacro MT_create takes N
        if ($N$ <= MonsterTeleport.staticLastLocInd) {
            m.x$N$ = MonsterTeleport.X[$N$]
            m.y$N$ = MonsterTeleport.Y[$N$]
        }
        //! endtextmacro
        //! runtextmacro MT_create( "0"  )
        //! runtextmacro MT_create( "1"  )
        //! runtextmacro MT_create( "2"  )
        //! runtextmacro MT_create( "3"  )
        //! runtextmacro MT_create( "4"  )
        //! runtextmacro MT_create( "5"  )
        //! runtextmacro MT_create( "6"  )
        //! runtextmacro MT_create( "7"  )
        //! runtextmacro MT_create( "8"  )
        //! runtextmacro MT_create( "9"  )
        //! runtextmacro MT_create( "10" )
        //! runtextmacro MT_create( "11" )
        //! runtextmacro MT_create( "12" )
        //! runtextmacro MT_create( "13" )
        //! runtextmacro MT_create( "14" )
        //! runtextmacro MT_create( "15" )
        //! runtextmacro MT_create( "16" )
        //! runtextmacro MT_create( "17" )
        //! runtextmacro MT_create( "18" )
        //! runtextmacro MT_create( "19" )

        m.lastLocInd = MonsterTeleport.staticLastLocInd
        //call Text_A("test, lastLocInd == " + I2S(m.lastLocInd))
        m.currentLoc = -1
        MonsterTeleport.destroyLocs()
        m.life = 0
        m.id = GetNextMonsterId()
        MonsterHashtableSetMonsterId(m, NO_ID, m.id)
        m.disablingTimer = null
        //color
        m.baseColorId = -1
        m.vcRed = 100
        m.vcGreen = 100
        m.vcBlue = 100
        m.vcTransparency = 0
        return m
    }

    setPeriod = (period: number): boolean => {
        if (period < MONSTER_TELEPORT_PERIOD_MIN || period > MONSTER_TELEPORT_PERIOD_MAX) {
            return false
        }
        this.period = period
        if (this.u !== null && IsUnitAliveBJ(this.u)) {
            TimerStart(this.t, this.period, true, MonsterTeleport_move_Actions)
        }
        return true
    }

    getPeriod = (): number => {
        return this.period
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
        this.u = NewImmobileMonster(this.mt, this.x0, this.y0, this.angle)
        SetUnitUserData(this.u, this.id)
        this.currentLoc = 0
        if (this.sens === 2) {
            this.sens = 1
        }
        TimerStart(this.t, this.period, true, MonsterTeleport_move_Actions)
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

    nextMove = (): void => {
        let x: number
        let y: number
        if (this.sens === 0 || this.sens === 1) {
            if (this.currentLoc >= this.lastLocInd) {
                if (this.sens === 0) {
                    this.currentLoc = 0
                } else {
                    this.sens = 2
                    this.currentLoc = this.currentLoc - 1
                }
            } else {
                this.currentLoc = this.currentLoc + 1
            }
        } else {
            if (this.currentLoc <= 0) {
                this.sens = 1
                this.currentLoc = 1
            } else {
                this.currentLoc = this.currentLoc - 1
            }
        }
        x = this.getX(this.currentLoc)
        y = this.getY(this.currentLoc)
        if (x === HIDE && y === HIDE) {
            ShowUnit(this.u, false)
        } else if (x !== WAIT || y !== WAIT) {
            if (IsUnitHidden(this.u)) {
                ShowUnit(this.u, true)
                if (!this.mt.isClickable()) {
                    UnitRemoveAbility(this.u, FourCC('Aloc'))
                    UnitAddAbility(this.u, FourCC('Aloc'))
                }
            }
            SetUnitX(this.u, x)
            SetUnitY(this.u, y)
        }
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

    getX = (id: number): number => {
        //! textmacro TM_getX takes N
        if (id === $N$) {
            return this.x$N$
        }
        //! endtextmacro
        //! runtextmacro TM_getX( "0"  )
        //! runtextmacro TM_getX( "1"  )
        //! runtextmacro TM_getX( "2"  )
        //! runtextmacro TM_getX( "3"  )
        //! runtextmacro TM_getX( "4"  )
        //! runtextmacro TM_getX( "5"  )
        //! runtextmacro TM_getX( "6"  )
        //! runtextmacro TM_getX( "7"  )
        //! runtextmacro TM_getX( "8"  )
        //! runtextmacro TM_getX( "9"  )
        //! runtextmacro TM_getX( "10" )
        //! runtextmacro TM_getX( "11" )
        //! runtextmacro TM_getX( "12" )
        //! runtextmacro TM_getX( "13" )
        //! runtextmacro TM_getX( "14" )
        //! runtextmacro TM_getX( "15" )
        //! runtextmacro TM_getX( "16" )
        //! runtextmacro TM_getX( "17" )
        //! runtextmacro TM_getX( "18" )
        //! runtextmacro TM_getX( "19" )
        return 0
    }

    getY = (id: number): number => {
        //! textmacro TM_getY takes N
        if (id === $N$) {
            return this.y$N$
        }
        //! endtextmacro
        //! runtextmacro TM_getY( "0"  )
        //! runtextmacro TM_getY( "1"  )
        //! runtextmacro TM_getY( "2"  )
        //! runtextmacro TM_getY( "3"  )
        //! runtextmacro TM_getY( "4"  )
        //! runtextmacro TM_getY( "5"  )
        //! runtextmacro TM_getY( "6"  )
        //! runtextmacro TM_getY( "7"  )
        //! runtextmacro TM_getY( "8"  )
        //! runtextmacro TM_getY( "9"  )
        //! runtextmacro TM_getY( "10" )
        //! runtextmacro TM_getY( "11" )
        //! runtextmacro TM_getY( "12" )
        //! runtextmacro TM_getY( "13" )
        //! runtextmacro TM_getY( "14" )
        //! runtextmacro TM_getY( "15" )
        //! runtextmacro TM_getY( "16" )
        //! runtextmacro TM_getY( "17" )
        //! runtextmacro TM_getY( "18" )
        //! runtextmacro TM_getY( "19" )
        return 0
    }

    addNewLocAt = (id: number, x: number, y: number): void => {
        //! textmacro TM_addNewLocAt takes N
        if (id === $N$) {
            this.x$N$ = x
            this.y$N$ = y
            return
        }
        //! endtextmacro
        //! runtextmacro TM_addNewLocAt( "0"  )
        //! runtextmacro TM_addNewLocAt( "1"  )
        //! runtextmacro TM_addNewLocAt( "2"  )
        //! runtextmacro TM_addNewLocAt( "3"  )
        //! runtextmacro TM_addNewLocAt( "4"  )
        //! runtextmacro TM_addNewLocAt( "5"  )
        //! runtextmacro TM_addNewLocAt( "6"  )
        //! runtextmacro TM_addNewLocAt( "7"  )
        //! runtextmacro TM_addNewLocAt( "8"  )
        //! runtextmacro TM_addNewLocAt( "9"  )
        //! runtextmacro TM_addNewLocAt( "10" )
        //! runtextmacro TM_addNewLocAt( "11" )
        //! runtextmacro TM_addNewLocAt( "12" )
        //! runtextmacro TM_addNewLocAt( "13" )
        //! runtextmacro TM_addNewLocAt( "14" )
        //! runtextmacro TM_addNewLocAt( "15" )
        //! runtextmacro TM_addNewLocAt( "16" )
        //! runtextmacro TM_addNewLocAt( "17" )
        //! runtextmacro TM_addNewLocAt( "18" )
        //! runtextmacro TM_addNewLocAt( "19" )
    }

    addNewLoc = (x: number, y: number): boolean => {
        if (this.lastLocInd >= MonsterTeleport.NB_MAX_LOC - 1) {
            return false
        }
        this.lastLocInd = this.lastLocInd + 1
        this.addNewLocAt(this.lastLocInd, x, y)
        if (this.lastLocInd === 1) {
            this.createUnit()
        }
        return true
    }

    destroyLastLoc = (): boolean => {
        if (this.lastLocInd === 1) {
            PauseTimer(this.t)
            RemoveUnit(this.u)
            this.u = null
        }
        if (this.lastLocInd < 0) {
            return false
        }
        this.lastLocInd = this.lastLocInd - 1
        return true
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

    temporarilyDisable = (disablingTimer: timer): void => {
        if (
            this.disablingTimer === null ||
            this.disablingTimer === disablingTimer ||
            TimerGetRemaining(disablingTimer) > TimerGetRemaining(this.disablingTimer)
        ) {
            this.disablingTimer = disablingTimer
            UnitRemoveAbility(this.u, this.mt.getImmolationSkill())
            SetUnitVertexColorBJ(this.u, this.vcRed, this.vcGreen, this.vcBlue, DISABLE_TRANSPARENCY)
            this.vcTransparency = DISABLE_TRANSPARENCY
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
        if (IsColorString(colorString)) {
            baseColorId = ColorString2Id(colorString)
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
        str = str + CACHE_SEPARATEUR_PARAM + R2S(period) + CACHE_SEPARATEUR_PARAM + I2S(R2I(angle))
        //! textmacro TM_loc_toString takes N
        if (this.lastLocInd < $N$) {
            return str
        }
        str = str + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x$N$)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y$N$))
        //! endtextmacro
        //! runtextmacro TM_loc_toString( "0"  )
        //! runtextmacro TM_loc_toString( "1"  )
        //! runtextmacro TM_loc_toString( "2"  )
        //! runtextmacro TM_loc_toString( "3"  )
        //! runtextmacro TM_loc_toString( "4"  )
        //! runtextmacro TM_loc_toString( "5"  )
        //! runtextmacro TM_loc_toString( "6"  )
        //! runtextmacro TM_loc_toString( "7"  )
        //! runtextmacro TM_loc_toString( "8"  )
        //! runtextmacro TM_loc_toString( "9"  )
        //! runtextmacro TM_loc_toString( "10" )
        //! runtextmacro TM_loc_toString( "11" )
        //! runtextmacro TM_loc_toString( "12" )
        //! runtextmacro TM_loc_toString( "13" )
        //! runtextmacro TM_loc_toString( "14" )
        //! runtextmacro TM_loc_toString( "15" )
        //! runtextmacro TM_loc_toString( "16" )
        //! runtextmacro TM_loc_toString( "17" )
        //! runtextmacro TM_loc_toString( "18" )
        //! runtextmacro TM_loc_toString( "19" )
        return str
    }
}
