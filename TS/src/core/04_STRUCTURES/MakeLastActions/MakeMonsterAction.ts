import { Text } from 'core/01_libraries/Text'
import { Level } from '../Level/Level'
import { Monster } from '../Monster/MonsterInterface'
import { MakeAction } from './MakeAction'

export class MakeMonsterAction extends MakeAction {
    private monster: Monster
    private level: Level

    getLevel = (): Level => {
        return this.level
    }

    // TODO; Used to be static
    create = (level: Level, monster: Monster): MakeMonsterAction => {
        let a: MakeMonsterAction
        if (monster == 0 || monster.u == null) {
            return 0
        }
        a = MakeMonsterAction.allocate()
        a.isActionMadeB = true
        a.monster = monster
        a.level = level
        return a
    }

    destroy = () => {
        if (!this.isActionMadeB) {
            this.monster.destroy()
        }
    }

    cancel = (): boolean => {
        if (!this.isActionMadeB) {
            return false
        }
        this.monster.removeUnit()
        this.isActionMadeB = false
        Text.mkP(this.owner.getPlayer(), 'monster creation cancelled')
        return true
    }

    redo = (): boolean => {
        if (this.isActionMadeB) {
            return false
        }
        this.monster.createUnit()
        this.isActionMadeB = true
        Text.mkP(this.owner.getPlayer(), 'monster creation redone')
        return true
    }
}
