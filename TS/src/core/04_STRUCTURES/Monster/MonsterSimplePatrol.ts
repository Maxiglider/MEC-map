const initMonsterSimplePatrol = () => {
    // initializer Init_MonsterSimplePatrol needs MonsterInterface

    //vérification que les monstres multi-patrouilles patrouillent bien
    // TODO; Used to be private
    let simplePatrolMobs = CreateGroup()
    // TODO; Used to be private
    const checkSimplePatrolMobsPeriod = 5

    // TODO; Used to be private
    const CheckSimplePatrolMobsEnum = (): void => {
        if (GetUnitCurrentOrder(GetEnumUnit()) === 0) {
            MonsterSimplePatrol(GetUnitUserData(GetEnumUnit())).createUnit()
        }
    }

    // TODO; Used to be private
    const CheckSimplePatrolMobs_Actions = (): void => {
        ForGroup(simplePatrolMobs, CheckSimplePatrolMobsEnum)
    }

    const Init_MonsterSimplePatrol = (): void => {
        let trigCheckSimplePatrolMobs = CreateTrigger()
        TriggerAddAction(trigCheckSimplePatrolMobs, CheckSimplePatrolMobs_Actions)
        TriggerRegisterTimerEvent(trigCheckSimplePatrolMobs, checkSimplePatrolMobsPeriod, true)
        trigCheckSimplePatrolMobs = null
    }
    /////////////////////////////////////////////////////////////////////////
}

class MonsterSimplePatrol {
    // extends Monster

    static nbInstances: integer = 0

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

    private x1: real
    private y1: real
    private x2: real
    private y2: real

    // TODO; Used to be static

    count = (): number => {
        return MonsterSimplePatrol.nbInstances
    }

    getId = (): number => {
        return this.id
    }

    setId = (id: number): MonsterSimplePatrol => {
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
            GroupRemoveUnit(simplePatrolMobs, this.u)
            RemoveUnit(this.u)
            this.u = null
        }
    }

    killUnit = (): void => {
        if (this.u !== null && IsUnitAliveBJ(this.u)) {
            GroupRemoveUnit(simplePatrolMobs, this.u)
            KillUnit(this.u)
        }
    }

    // TODO; Used to be private
    onDestroy = (): void => {
        if (this.u !== null) {
            this.removeUnit()
        }
        this.level.monstersSimplePatrol.setMonsterNull(this.arrayId)
        MonsterSimplePatrol.nbInstances = MonsterSimplePatrol.nbInstances - 1
        if (ClearTriggerMobId2ClearMob(this.id) !== 0) {
            ClearTriggerMobId2ClearMob(this.id).destroy()
        }
        MonsterHashtableRemoveMonsterId(this.id)
    }

    // TODO; Used to be static
    create = (mt: MonsterType, x1: number, y1: number, x2: number, y2: number): MonsterSimplePatrol => {
        let m = MonsterSimplePatrol.allocate()
        MonsterSimplePatrol.nbInstances = MonsterSimplePatrol.nbInstances + 1
        m.mt = mt
        m.x1 = x1
        m.y1 = y1
        m.x2 = x2
        m.y2 = y2
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

    createUnit = (): void => {
        let clearMob = ClearTriggerMobId2ClearMob(this.id)
        let disablingTimer = this.disablingTimer
        let previouslyEnabled = this.u !== null
        let isMonsterAlive = IsUnitAliveBJ(this.u)
        if (previouslyEnabled) {
            this.removeUnit()
        }
        this.u = NewPatrolMonster(this.mt, this.x1, this.y1, this.x2, this.y2)
        SetUnitUserData(this.u, this.id)
        GroupAddUnit(simplePatrolMobs, this.u)
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
        str =
            str +
            I2S(this.id) +
            CACHE_SEPARATEUR_PARAM +
            I2S(R2I(this.x1)) +
            CACHE_SEPARATEUR_PARAM +
            I2S(R2I(this.y1)) +
            CACHE_SEPARATEUR_PARAM
        str = str + I2S(R2I(this.x2)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y2))
        return str
    }
}
