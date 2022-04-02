import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import { MakeTerrainHeightAction } from '../MakeLastActions/MakeTerrainHeightAction'
import { MakeTerrainHeight } from './MakeTerrainHeight'

const initTerrainHeightMakingActions = () => {
    const TerrainHeightMaking_Actions = () => {
        let escaper = Hero2Escaper(GetTriggerUnit())

        if (!escaper) {
            return
        }

        let mkGeneral = escaper.getMake()
        let mk: MakeTerrainHeight = MakeTerrainHeight(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        escaper.newAction(new MakeTerrainHeightAction(mk.getRadius(), mk.getHeight(), x, y))
    }
}
