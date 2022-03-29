import { Make } from '../Make/Make'

export class MakeMonsterTeleport extends Make {
    private mt: MonsterType
    private period: number
    private angle: number
    private mode: string //normal ou string
    private lastX: number[]
    private lastY: number[]
    private lastLocId: number
    private locPointeur: number
    private unitLastClic: unit
    private monster: MonsterTeleport

    getMonsterType = (): MonsterType => {
        return this.mt
    }

    getPeriod = (): number => {
        return this.period
    }

    getAngle = (): number => {
        return this.angle
    }

    getMode = (): string => {
        return this.mode
    }

    getMonster = (): MonsterTeleport => {
        return this.monster
    }

    // TODO; Used to be static
    create = (maker: unit, mode: string, mt: MonsterType, period: number, angle: number): MakeMonsterTeleport => {
        let m: MakeMonsterTeleport
        if (
            maker === null ||
            mt === 0 ||
            (mode !== 'normal' && mode !== 'string') ||
            period < MONSTER_TELEPORT_PERIOD_MIN ||
            period > MONSTER_TELEPORT_PERIOD_MAX
        ) {
            return 0
        }
        m = MakeMonsterTeleport.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'monsterCreateTeleport'
        m.mt = mt
        m.mode = mode
        m.period = period
        m.angle = angle
        m.monster = 0
        m.t = CreateTrigger()
        TriggerAddAction(m.t, Make_GetActions(m.kind))
        TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
        m.lastLocId = -1
        m.locPointeur = -1
        return m
    }

    destroy = () => {
        let escaper: Escaper
        if (this.monster != 0 && this.monster.u != null) {
            escaper = EscaperFunctions.Hero2Escaper(this.maker)
            escaper.newAction(new MakeMonsterAction(escaper.getMakingLevel(), this.monster))
        } else {
            this.monster.destroy()
        }
        DestroyTrigger(this.t)
        this.t = null
        RemoveUnit(this.unitLastClic)
        this.unitLastClic = null
        this.maker = null
    }

    nextMonster = () => {
        let escaper: Escaper
        this.lastLocId = -1
        this.locPointeur = -1
        RemoveUnit(this.unitLastClic)
        this.unitLastClic = null
        if (this.monster != 0 && this.monster.u != null) {
            escaper = EscaperFunctions.Hero2Escaper(this.maker)
            escaper.newAction(new MakeMonsterAction(escaper.getMakingLevel(), this.monster))
        } else {
            this.monster.destroy()
        }
        this.monster = 0
    }

    addWaitPeriod = (): boolean => {
        if (this.locPointeur < 0) {
            return false
        }
        if (this.saveLoc(WAIT, WAIT)) {
            this.getMonster().addNewLoc(WAIT, WAIT)
            return true
        }
        return false
    }

    addHidePeriod = (): boolean => {
        if (this.locPointeur < 0) {
            return false
        }
        if (this.saveLoc(HIDE, HIDE)) {
            this.getMonster().addNewLoc(HIDE, HIDE)
            return true
        }
        return false
    }

    getLocPointeur = (): number => {
        return this.locPointeur
    }

    setUnitLastClicPosition = (x: number, y: number) => {
        if (this.unitLastClic === null) {
            this.unitLastClic = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
        } else {
            //call SetUnitX(this.unitLastClic, x)
            //call SetUnitY(this.unitLastClic, y)
            SetUnitPosition(this.unitLastClic, x, y)
        }
    }

    saveLoc = (x: number, y: number): boolean => {
        if (this.locPointeur >= MonsterTeleport.NB_MAX_LOC - 1) {
            return false
        }
        this.locPointeur = this.locPointeur + 1
        this.lastX[this.locPointeur] = x
        this.lastY[this.locPointeur] = y
        this.lastLocId = this.locPointeur
        if (!(x === y && (x === WAIT || x === HIDE))) {
            this.setUnitLastClicPosition(x, y)
        }
        EscaperFunctions.Hero2Escaper(this.maker).destroyCancelledActions()
        return true
    }

    unsaveLoc = (): boolean => {
        let x: number
        let y: number
        let i: number
        if (this.locPointeur < 0) {
            return false
        }
        this.monster.destroyLastLoc()
        this.locPointeur = this.locPointeur - 1
        if (this.locPointeur >= 0) {
            x = this.lastX[this.locPointeur]
            y = this.lastY[this.locPointeur]
            i = this.locPointeur
            while (true) {
                if (i < 0 || !(x === y && (x === WAIT || x === HIDE))) break
                i = i - 1
                x = this.lastX[i]
                y = this.lastY[i]
            }
            if (i >= 0) {
                this.setUnitLastClicPosition(this.lastX[i], this.lastY[i])
            } else {
                RemoveUnit(this.unitLastClic)
                this.unitLastClic = null
            }
        } else {
            RemoveUnit(this.unitLastClic)
            this.unitLastClic = null
            this.monster.removeUnit()
        }
        return true
    }

    setMonster = (monster: MonsterTeleport) => {
        if (this.monster !== 0) {
            this.monster.destroy()
        }
        this.monster = monster
    }

    cancelLastAction = (): boolean => {
        return this.unsaveLoc()
    }

    redoLastAction = (): boolean => {
        if (this.locPointeur < this.lastLocId) {
            this.locPointeur = this.locPointeur + 1
            this.monster.addNewLoc(this.lastX[this.locPointeur], this.lastY[this.locPointeur])
            this.setUnitLastClicPosition(this.lastX[this.locPointeur], this.lastY[this.locPointeur])
            return true
        }
        return false
    }
}
