const initMakeExchangeTerrainsActions = () => {
    // needs Escaper, ExchangeTerrains

    const MakeExchangeTerrains_Actions = () => {
        let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeExchangeTerrains = MakeExchangeTerrains(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()
        let terrainTypeA: TerrainType
        let terrainTypeB: TerrainType

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(mk.maker)
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
