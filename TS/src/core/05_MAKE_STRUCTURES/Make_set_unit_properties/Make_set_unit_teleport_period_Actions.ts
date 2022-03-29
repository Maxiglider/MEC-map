import { BasicFunctions } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { EscaperFunctions } from 'core/04_STRUCTURES/Escaper/Escaper_functions'
import { Make } from '../Make/Make'
import { MakeSetUnitTeleportPeriod } from './MakeSetUnitTeleportPeriod'

const initMakeSetUnitTeleportPeriodActions = () => {
    // needs BasicFunctions, Escaper

    const SetUnitTeleportPeriod_Actions = () => {
        //modes : oneByOne, twoClics

        let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeSetUnitTeleportPeriod = MakeSetUnitTeleportPeriod(integer(mkGeneral))
        let monster: MonsterTeleport
        let nbMonstersFixed = 0
        let x = GetOrderPointX()
        let y = GetOrderPointY()
        let i: number

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(mk.maker)
        if (mk.getMode() == 'oneByOne') {
            monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
            if (monster != 0 && monster.u != null) {
                monster.setPeriod(mk.getPeriod())
                nbMonstersFixed = 1
            }
        } else {
            //mode twoClics
            if (!mk.isLastLocSavedUsed()) {
                mk.saveLoc(x, y)
                return
            }

            i = 0
            while (true) {
                if (i > escaper.getMakingLevel().monstersTeleport.getLastInstanceId()) break
                monster = escaper.getMakingLevel().monstersTeleport.get(i)
                if (
                    monster != 0 &&
                    monster.u != null &&
                    BasicFunctions.IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)
                ) {
                    monster.setPeriod(mk.getPeriod())
                    nbMonstersFixed = nbMonstersFixed + 1
                }
                i = i + 1
            }
        }

        if (nbMonstersFixed <= 1) {
            Text.mkP(mk.makerOwner, I2S(nbMonstersFixed) + ' monster fixed.')
        } else {
            Text.mkP(mk.makerOwner, I2S(nbMonstersFixed) + ' monsters fixed.')
        }
        mk.unsaveLocDefinitely()
    }
}
