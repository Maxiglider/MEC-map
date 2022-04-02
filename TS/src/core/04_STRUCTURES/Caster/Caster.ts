import { CACHE_SEPARATEUR_PARAM } from 'core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache'
import { Escaper } from '../Escaper/Escaper'
import { Monster } from '../Monster/Monster'
import { MonsterType } from '../Monster/MonsterType'
import { NewImmobileMonster } from '../Monster/Monster_creation_functions'
import { CasterType } from './CasterType'
import {CasterUnitWithinRange_Actions} from './Caster_functions'

export class Caster extends Monster {
    private casterType: CasterType
    private x: number
    private y: number
    private angle: number
    private trg_unitWithinRange?: trigger
    public escapersInRange: Escaper[]
    public nbEscapersInRange: number
    public canShoot: boolean
    public t?: timer
    private enabled: boolean

    static anyTriggerWithinRangeId2Caster = new Map<number, Caster>()
    static anyTimerId2Caster = new Map<number, Caster>()

    constructor(casterType: CasterType, x: number, y: number, angle: number) {
        super()

        this.casterType = casterType
        this.x = x
        this.y = y
        this.angle = angle

        this.escapersInRange = []
        this.nbEscapersInRange = 0
        this.canShoot = true
        this.enabled = false
    }

    isEnabled = (): boolean => {
        return this.enabled
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

    getCasterUnit() {
        return this.u
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

    createUnit = () => {
        this.nbEscapersInRange = 0
        this.canShoot = true

        super.createUnit(() => NewImmobileMonster(this.casterType.getCasterMonsterType(), this.x, this.y, this.angle))

        this.trg_unitWithinRange = CreateTrigger()
        this.u && TriggerRegisterUnitInRangeSimple(this.trg_unitWithinRange, this.casterType.getRange(), this.u)
        TriggerAddAction(this.trg_unitWithinRange, CasterUnitWithinRange_Actions)
        Caster.anyTriggerWithinRangeId2Caster.set(GetHandleId(this.trg_unitWithinRange), this)

        this.t = CreateTimer()
        Caster.anyTimerId2Caster.set(GetHandleId(this.t), this)

        this.enabled = true
    }

    destroyTriggers() {
        if (this.trg_unitWithinRange) {
            Caster.anyTriggerWithinRangeId2Caster.delete(GetHandleId(this.trg_unitWithinRange))
            DestroyTrigger(this.trg_unitWithinRange)
            delete this.trg_unitWithinRange
        }

        if (this.t) {
            Caster.anyTimerId2Caster.delete(GetHandleId(this.t))
            DestroyTimer(this.t)
            delete this.t
        }
    }

    removeUnit = () => {
        super.removeUnit()
        this.destroyTriggers()
    }

    killUnit = () => {
        this.u && KillUnit(this.u)
        this.destroyTriggers()
    }

    refresh = () => {
        if (this.u) {
            this.removeUnit()
            this.createUnit()
        }
    }

    destroy = () => {
        super.destroy()
        this.destroyTriggers()
    }

    escaperOutOfRangeOrDead = (escaper: Escaper) => {
        let i = 0
        while (escaper !== this.escapersInRange[i] && i !== this.nbEscapersInRange) {
            i++
        }

        if (i < this.nbEscapersInRange) {
            while (i !== this.nbEscapersInRange - 1) {
                this.escapersInRange[i] = this.escapersInRange[i + 1]
                i = i + 1
            }
            this.nbEscapersInRange = this.nbEscapersInRange - 1
        }
    }

    toString = (): string => {
        let str: string

        if (this.casterType.theAlias && this.casterType.theAlias !== '') {
            str = this.casterType.theAlias + CACHE_SEPARATEUR_PARAM
        } else {
            str = this.casterType.label + CACHE_SEPARATEUR_PARAM
        }

        str += I2S(this.id) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.x)) + CACHE_SEPARATEUR_PARAM + I2S(R2I(this.y))
        str += CACHE_SEPARATEUR_PARAM + I2S(R2I(this.angle))

        return str
    }
}
