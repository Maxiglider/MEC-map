import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import { MakeTerrainCopyPaste } from './MakeTerrainCopyPaste'

const initTerrainCopyPasteActions = () => {
    // needs Escaper

    const TerrainCopyPaste_Actions = () => {
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeTerrainCopyPaste = MakeTerrainCopyPaste(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        mk.saveLoc(x, y)
    }
}
