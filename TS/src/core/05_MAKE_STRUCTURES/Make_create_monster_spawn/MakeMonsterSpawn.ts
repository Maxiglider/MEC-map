import { MonsterType } from 'core/04_STRUCTURES/Monster/MonsterType'
import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { Text } from '../../01_libraries/Text'
import { MonsterSpawn } from '../../04_STRUCTURES/MonsterSpawn/MonsterSpawn'

export class MakeMonsterSpawn extends MakeOneByOneOrTwoClicks {
    label: string
    mt: MonsterType
    sens: number
    frequence: number
    monsterDirectionMode: 'straight'|'random'

    constructor(maker: unit, label: string, mt: MonsterType, sens: number, frequency: number, monsterDirectionMode: 'straight'|'random') {
        super(maker, 'monsterSpawnCreate', '', [''])

        this.label = label
        this.mt = mt
        this.sens = sens
        this.frequence = frequency
        this.monsterDirectionMode= monsterDirectionMode
    }

    doActions = () => {
        if (super.doBaseActions()) {
            if (this.isLastLocSavedUsed()) {
                const level = this.escaper.getMakingLevel()

                const ms = new MonsterSpawn(
                    this.label,
                    this.mt,
                    this.sens,
                    this.frequence,
                    this.lastX,
                    this.lastY,
                    this.orderX,
                    this.orderY,
                    this.monsterDirectionMode
                )

                level.monsterSpawns.new(ms, true)

                Text.mkP(this.makerOwner, 'monster spawn "' + this.label + '" created')
                this.escaper.destroyMake()
            } else {
                this.saveLoc(this.orderX, this.orderY)
            }
        }
    }
}
