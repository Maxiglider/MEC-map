import { IsIssuedOrder, StopUnit } from 'core/01_libraries/Basic_functions'
import { Make } from 'core/05_MAKE_STRUCTURES/Make/Make'
import { ExchangeTerrains } from 'core/07_TRIGGERS/Triggers_to_modify_terrains/Exchange_terrains'
import { udg_terrainTypes } from '../../../../globals'
import { Hero2Escaper } from '../Escaper/Escaper_functions'
import { TerrainType } from '../TerrainType/TerrainType'
import { MakeExchangeTerrains } from './MakeExchangeTerrains'

const initMakeExchangeTerrainsActions = () => {
    // needs Escaper, ExchangeTerrains

    const MakeExchangeTerrains_Actions = () => {
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeExchangeTerrains = MakeExchangeTerrains(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()
        let terrainTypeA: TerrainType
        let terrainTypeB: TerrainType

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        if (mk.isLastLocSavedUsed()) {
            terrainTypeA = udg_terrainTypes.getTerrainType(mk.lastX, mk.lastY)
            terrainTypeB = udg_terrainTypes.getTerrainType(x, y)
            ExchangeTerrains(terrainTypeA.label, terrainTypeB.label)
            mk.unsaveLocDefinitely()
        } else {
            mk.saveLoc(x, y)
        }
    }
}
