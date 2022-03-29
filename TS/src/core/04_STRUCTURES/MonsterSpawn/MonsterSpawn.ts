const initMonsterSpawn = () => {
    const RemoveEnumMonster = (): void => {
        RemoveUnit(GetEnumUnit())
    }

    let ht: hashtable
    const DECALAGE_UNSPAWN = 200
    const DELAY_BETWEEN_SPAWN_AND_MOVEMENT = 0.5

    const MonsterStartMovement = (): void => {
        let mobTimer = GetExpiredTimer()
        let ms = MonsterSpawn(LoadInteger(ht, 1, GetHandleId(mobTimer)))
        let mobUnit = LoadUnitHandle(ht, 2, GetHandleId(mobTimer))
        ms.startMobMovement(mobUnit)
        UnitAddAbility(mobUnit, FourCC('Aloc'))
        DestroyTimer(mobTimer)
        mobUnit = null
        mobTimer = null
    }

    const MonsterSpawn_Actions = (): void => {
        let ms = MonsterSpawn(LoadInteger(ht, 0, GetHandleId(GetTriggeringTrigger())))
        let mobUnit = ms.createMob()
        let mobTimer = CreateTimer()
        SaveInteger(ht, 1, GetHandleId(mobTimer), integer(ms))
        SaveUnitHandle(ht, 2, GetHandleId(mobTimer), mobUnit)
        TimerStart(mobTimer, DELAY_BETWEEN_SPAWN_AND_MOVEMENT, false, MonsterStartMovement)
        SetUnitOwner(mobUnit, ENNEMY_PLAYER, false)
        ShowUnit(mobUnit, false)
        UnitRemoveAbility(mobUnit, FourCC('Aloc'))
        GroupAddUnit(ms.monsters, mobUnit)
        mobUnit = null
        mobTimer = null
    }

    const UnspawMonster_Actions = (): void => {
        let ms = MonsterSpawn(LoadInteger(ht, 0, GetHandleId(GetTriggeringTrigger())))
        if (IsUnitInGroup(GetTriggerUnit(), ms.monsters)) {
            GroupRemoveUnit(ms.monsters, GetTriggerUnit())
            RemoveUnit(GetTriggerUnit())
        }
    }
}

class MonsterSpawn {
    // //50 levels * 100 monster spawns

    private label: string
    private mt: MonsterType
    private sens: string //leftToRight, upToDown, rightToLeft, downToUp
    private frequence: real
    private minX: real
    private minY: real
    private maxX: real
    private maxY: real
    private tSpawn: trigger
    private tUnspawn: trigger
    private unspawnReg: region
    monsters: group

    level: Level
    arrayId: integer

    private static onInit = (): void => {
        ht = InitHashtable()
        //0, tSpawn --> MonsterSpawn
        //0, tUnspawn --> MonsterSpawn
        //1, timer --> MonsterSpawn
        //2, timer --> unité mob
    }

    // TODO; Used to be public
    getLabel = (): string => {
        return this.label
    }

    desactivate = (): void => {
        if (this.unspawnReg !== null) {
            RemoveRegion(this.unspawnReg)
            this.unspawnReg = null
        }
        if (this.tSpawn !== null) {
            DestroyTrigger(this.tSpawn)
            this.tSpawn = null
        }
        if (this.tUnspawn !== null) {
            DestroyTrigger(this.tUnspawn)
            this.tUnspawn = null
        }
        if (this.monsters !== null) {
            ForGroup(this.monsters, RemoveEnumMonster)
            DestroyGroup(this.monsters)
            this.monsters = null
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
        SaveInteger(ht, 0, GetHandleId(this.tSpawn), integer(this))
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
        TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)
        this.createUnspawnReg()
        this.tUnspawn = CreateTrigger()
        SaveInteger(ht, 0, GetHandleId(this.tUnspawn), integer(this))
        TriggerRegisterEnterRegion(this.tUnspawn, this.unspawnReg, null)
        TriggerAddAction(this.tUnspawn, UnspawMonster_Actions)
    }

    private onDestroy = (): void => {
        this.desactivate()
        this.level.monsterSpawns.setMonsterSpawnNull(this.arrayId)
    }

    static create = (
        label: string,
        mt: MonsterType,
        sens: string,
        frequence: number,
        x1: number,
        y1: number,
        x2: number,
        y2: number
    ): MonsterSpawn => {
        let ms = MonsterSpawn.allocate()
        ms.label = label
        ms.mt = mt
        ms.sens = sens
        ms.frequence = frequence
        ms.minX = RMinBJ(x1, x2)
        ms.minY = RMinBJ(y1, y2)
        ms.maxX = RMaxBJ(x1, x2)
        ms.maxY = RMaxBJ(y1, y2)
        return ms
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
        if (udg_monsterTypes.monsterUnit2MonsterType(mobUnit).isClickable()) {
            p = ENNEMY_PLAYER
        } else {
            p = GetCurrentMonsterPlayer()
        }
        SetUnitOwner(mobUnit, p, MOBS_VARIOUS_COLORS)
        ShowUnit(mobUnit, true)
        IssuePointOrder(mobUnit, 'move', x2, y2)
    }

    // TODO; Used to be public
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

    // TODO; Used to be public
    setLabel = (newLabel: string): void => {
        this.label = newLabel
    }

    // TODO; Used to be public
    setMonsterType = (mt: MonsterType): void => {
        this.mt = mt
    }

    // TODO; Used to be public
    setSens = (sens: string): void => {
        this.sens = sens
        this.desactivate()
        this.activate()
    }

    // TODO; Used to be public
    setFrequence = (frequence: number): void => {
        this.frequence = frequence
        DestroyTrigger(this.tSpawn)
        this.tSpawn = CreateTrigger()
        SaveInteger(ht, 0, GetHandleId(this.tSpawn), integer(this))
        TriggerRegisterTimerEvent(this.tSpawn, 1 / this.frequence, true)
        TriggerAddAction(this.tSpawn, MonsterSpawn_Actions)
    }

    // TODO; Used to be public
    displayForPlayer = (p: player): void => {
        let display =
            udg_colorCode[GREY] + this.label + ' : ' + this.mt.label + '   ' + this.sens + '   ' + R2S(this.frequence)
        Text_P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
    }

    // TODO; Used to be public
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
