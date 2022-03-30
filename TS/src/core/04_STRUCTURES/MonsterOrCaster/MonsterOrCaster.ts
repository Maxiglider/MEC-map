import { Caster } from '../Caster/Caster'
import { Monster } from '../Monster/MonsterInterface'

export class MonsterOrCaster {
    private monster: Monster | null = null
    private caster: Caster | null = null

    constructor(mobId: number) {
        let monster = Monster.MonsterId2Monster(mobId)
        let caster: Caster

        if (monster !== null) {
            this.monster = monster
            this.caster = null
        } else {
            caster = Monster.CasterId2Caster(mobId)
            if (caster !== null) {
                this.monster = null
                this.caster = caster
            }
        }
    }

    getId = (): number => {
        if (this.monster !== null) {
            return this.monster.getId()
        } else if (this.caster !== null) {
            return this.caster.getId()
        }
        return 0
    }

    killUnit = () => {
        if (this.monster !== null) {
            this.monster.killUnit()
        } else if (this.caster !== null) {
            this.caster.killUnit()
        }
    }

    temporarilyDisable = (disablingTimer: timer) => {
        if (this.monster !== null) {
            this.monster.temporarilyDisable(disablingTimer)
        } else if (this.caster !== null) {
            this.caster.temporarilyDisable(disablingTimer)
        }
    }

    temporarilyEnable = (enablingTimer: timer) => {
        if (this.monster !== null) {
            this.monster.temporarilyEnable(enablingTimer)
        } else if (this.caster !== null) {
            this.caster.temporarilyEnable(enablingTimer)
        }
    }

    setBaseColor = (colorString: string) => {
        if (this.monster !== null) {
            this.monster.setBaseColor(colorString)
        } else if (this.caster !== null) {
            this.caster.setBaseColor(colorString)
        }
    }

    setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number) => {
        if (this.monster !== null) {
            this.monster.setVertexColor(vcRed, vcGreen, vcBlue)
        } else if (this.caster !== null) {
            this.caster.setVertexColor(vcRed, vcGreen, vcBlue)
        }
    }

    reinitColor = () => {
        if (this.monster !== null) {
            this.monster.reinitColor()
        } else if (this.caster !== null) {
            this.caster.reinitColor()
        }
    }

    getUnit = () => {
        if (this.monster !== null) {
            return this.monster.u
        } else if (this.caster !== null) {
            return this.caster.casterUnit
        }

        return null
    }

    copy = () => {
        return new MonsterOrCaster(this.getId())
    }

    getMonsterType = () => {
        if (this.monster !== null) {
            return this.monster.getMonsterType()
        } else if (this.caster !== null) {
            return this.caster.getCasterType().getCasterMonsterType()
        }

        return null
    }

    destroy = () => {
        if (this.monster !== null) {
            this.monster.destroy()
        } else if (this.caster !== null) {
            this.caster.destroy()
        }
    }
}
