import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Text } from 'core/01_libraries/Text'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { TerrainFunctions } from '../../07_TRIGGERS/Modify_terrain_Functions/Terrain_functions'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import { MakeGetTerrainType } from './MakeGetTerrainType'

const initGettingTerrainTypeInfoActions = () => {
    // needs Escaper

    const GettingTerrainTypeInfo_Actions = () => {
        const escaper = Hero2Escaper(GetTriggerUnit())
        const mkGeneral: Make = escaper.getMake()
        const mk: MakeGetTerrainType = MakeGetTerrainType(integer(mkGeneral))
        const x = GetOrderPointX()
        const y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        Text.P(mk.makerOwner, TerrainFunctions.GetTerrainData(GetTerrainType(x, y)))
    }
}
