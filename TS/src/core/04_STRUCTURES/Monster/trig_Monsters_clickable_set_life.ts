import { createEvent } from 'Utils/mapUtils'
import {udg_monsters} from './Monster'

const initMonstersClickableSetLife = () => {
    const monstersClickable = CreateGroup()
    const PERIOD = 0.1

    createEvent({
        events: [t => TriggerRegisterTimerEvent(t, PERIOD, true)],
        actions: [
            () => {
                ForGroup(monstersClickable, () => {
                    const monsterUnit = GetEnumUnit()
                    const currentLife = GetUnitState(monsterUnit, UNIT_STATE_LIFE)
                    const monster = udg_monsters[GetUnitUserData(monsterUnit)]

                    if(monster) {
                        const previousLife = I2R(monster.getLife())
                        let diffLife = RMaxBJ(currentLife, previousLife) - RMinBJ(currentLife, previousLife)
                        if (diffLife < 100) {
                            SetUnitLifeBJ(GetEnumUnit(), previousLife - 0.5)
                        } else {
                            while (!(diffLife <= 0)) {
                                monster.setLife(R2I(previousLife) - 10000)
                                diffLife = diffLife - 10000
                            }
                        }
                    }
                })
            },
        ],
    })

    return { monstersClickable }
}

export const MonstersClickableSetLife = initMonstersClickableSetLife()
