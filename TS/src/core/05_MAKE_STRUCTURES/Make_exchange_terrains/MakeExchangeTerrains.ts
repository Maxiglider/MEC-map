import {MakeOneByOneOrTwoClicks} from "../Make/MakeOneByOneOrTwoClicks";
import {TerrainType} from "../../04_STRUCTURES/TerrainType/TerrainType";
import {udg_terrainTypes} from "../../../../globals";
import {ExchangeTerrains} from "../../07_TRIGGERS/Triggers_to_modify_terrains/Exchange_terrains";


export class MakeExchangeTerrains extends MakeOneByOneOrTwoClicks {
    constructor(maker: unit) {
        super(maker, 'exchangeTerrains')
    }
    
    doActions() {
        if(super.doBaseActions()){
            let terrainTypeA: TerrainType
            let terrainTypeB: TerrainType

            if (this.isLastLocSavedUsed()) {
                terrainTypeA = udg_terrainTypes.getTerrainType(this.lastX, this.lastY)
                terrainTypeB = udg_terrainTypes.getTerrainType(this.orderX, this.orderY)
                ExchangeTerrains(terrainTypeA.label, terrainTypeB.label)
                this.unsaveLocDefinitely()
            } else {
                this.saveLoc(this.orderX, this.orderY)
            }
        }
    }
}
