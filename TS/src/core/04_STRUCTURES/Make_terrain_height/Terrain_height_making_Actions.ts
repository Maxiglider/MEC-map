const initTerrainHeightMakingActions = () => {
    // needs BasicFunctions, Escaper

    const TerrainHeightMaking_Actions = () => {
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
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
