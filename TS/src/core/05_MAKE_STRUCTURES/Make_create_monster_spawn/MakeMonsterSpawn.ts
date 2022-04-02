import { MonsterType } from 'core/04_STRUCTURES/Monster/MonsterType'
import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import { Text } from '../../01_libraries/Text'

export class MakeMonsterSpawn extends MakeOneByOneOrTwoClicks {
    label: string
    mt: MonsterType
    sens: string
    frequence: number

    constructor(maker: unit, label: string, mt: MonsterType, sens: string, frequence: number) {
        super(maker, 'monsterSpawnCreate', '')

        this.label = label
        this.mt = mt
        this.sens = sens
        this.frequence = frequence
    }

    doActions() {
        if (super.doBaseActions()) {
            if (this.isLastLocSavedUsed()) {
                const level = this.escaper.getMakingLevel()
                if (
                    level.monsterSpawns.new(
                        this.label,
                        this.mt,
                        this.sens,
                        this.frequence,
                        this.lastX,
                        this.lastY,
                        this.orderX,
                        this.orderY,
                        true
                    )
                ) {
                    Text.mkP(this.makerOwner, 'monster spawn "' + this.label + '" created')
                    this.escaper.destroyMake()
                } else {
                    Text.erP(
                        this.makerOwner,
                        'impossible to create monster spawn "' + this.label + '", label propably already in use'
                    )
                }
            } else {
                this.saveLoc(this.orderX, this.orderY)
            }
        }
    }
}
