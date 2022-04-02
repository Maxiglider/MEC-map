import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { udg_levels } from 'core/08_GAME/Init_structures/Init_struct_levels'
import { Hero2Escaper } from '../../04_STRUCTURES/Escaper/Escaper_functions'
import { Level } from '../../04_STRUCTURES/Level/Level'
import { MakeStart } from './MakeStart'

const initStartMakingActions = () => {
    // needs Escaper

    const StartMaking_Actions = () => {
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeStart = MakeStart(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()
        let level: Level

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        if (mk.isLastLocSavedUsed()) {
            level = escaper.getMakingLevel()
            if (mk.forNext()) {
                if (udg_levels.get(level.getId() + 1) == 0) {
                    if (!udg_levels.new()) {
                        Text.erP(escaper.getPlayer(), 'nombre maximum de niveaux atteint')
                        escaper.destroyMake()
                        return
                    }
                }
                level = udg_levels.get(level.getId() + 1)
                if (level === 0) {
                    Text.erP(escaper.getPlayer(), "erreur d'origine inconnue")
                    escaper.destroyMake()
                    return
                }
            }
            level.newStart(mk.lastX, mk.lastY, x, y)
            Text.mkP(mk.makerOwner, 'start made for level ' + I2S(level.getId()))
            escaper.destroyMake()
        } else {
            mk.saveLoc(x, y)
        }
    }
}
