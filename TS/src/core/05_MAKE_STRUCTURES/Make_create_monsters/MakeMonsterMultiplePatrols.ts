import { Make } from '../Make/Make'

export class MakeMonsterMultiplePatrols extends Make {
    private mt: MonsterType
    private mode: string //normal ou string
    private lastX: number[]
    private lastY: number[]
    private lastLocId: number
    private locPointeur: number
    private unitLastClic: unit
    private monster: MonsterMultiplePatrols

    getMonsterType = (): MonsterType => {
        return this.mt
    }

    getMode = (): string => {
        return this.mode
    }

    getMonster = (): MonsterMultiplePatrols => {
        return this.monster
    }

    // TODO; Used to be static
    create = (maker: unit, mode: string, mt: MonsterType): MakeMonsterMultiplePatrols => {
        let m: MakeMonsterMultiplePatrols
        if (maker === null || mt === 0 || (mode !== 'normal' && mode !== 'string')) {
            return 0
        }
        m = MakeMonsterMultiplePatrols.allocate()
        m.maker = maker
        m.makerOwner = GetOwningPlayer(maker)
        m.kind = 'monsterCreateMultiplePatrols'
        m.mt = mt
        m.mode = mode
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

    saveLoc = (x: number, y: number) => {
        if (this.locPointeur >= MonsterMultiplePatrols.NB_MAX_LOC - 1) {
            return
        }
        this.locPointeur = this.locPointeur + 1
        this.lastX[this.locPointeur] = x
        this.lastY[this.locPointeur] = y
        this.lastLocId = this.locPointeur
        this.setUnitLastClicPosition(x, y)
        EscaperFunctions.Hero2Escaper(this.maker).destroyCancelledActions()
    }

    unsaveLoc = (): boolean => {
        if (this.locPointeur < 0) {
            return false
        }
        this.monster.destroyLastLoc()
        this.locPointeur = this.locPointeur - 1
        if (this.locPointeur >= 0) {
            this.setUnitLastClicPosition(this.lastX[this.locPointeur], this.lastY[this.locPointeur])
        } else {
            RemoveUnit(this.unitLastClic)
            this.unitLastClic = null
            this.monster.removeUnit()
        }
        return true
    }

    setMonster = (monster: MonsterMultiplePatrols) => {
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
