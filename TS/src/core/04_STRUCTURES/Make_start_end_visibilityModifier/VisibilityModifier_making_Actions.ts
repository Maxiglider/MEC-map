import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import { VisibilityModifier } from '../Level/VisibilityModifier'
import { MakeVisibilityModifierAction } from '../MakeLastActions/MakeVisibilityModifierAction'
import { MakeVisibilityModifier } from './MakeVisibilityModifier'

const initVisibilityModifierMakingActions = () => {
    // needs Escaper

    const VisibilityModifierMaking_Actions = () => {
        let newVisibilityModifier: VisibilityModifier
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeVisibilityModifier = MakeVisibilityModifier(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        if (mk.isLastLocSavedUsed()) {
            newVisibilityModifier = escaper.getMakingLevel().newVisibilityModifier(mk.lastX, mk.lastY, x, y)
            if (newVisibilityModifier === 0) {
                Text.erP(mk.makerOwner, "can't create visibility, full for this level")
            } else {
                newVisibilityModifier.activate(true)
                escaper.newAction(new MakeVisibilityModifierAction(escaper.getMakingLevel(), newVisibilityModifier))
                Text.mkP(mk.makerOwner, 'visibility rectangle made for level ' + I2S(escaper.getMakingLevel().getId()))
            }
            mk.unsaveLocDefinitely()
        } else {
            mk.saveLoc(x, y)
        }
    }
}
