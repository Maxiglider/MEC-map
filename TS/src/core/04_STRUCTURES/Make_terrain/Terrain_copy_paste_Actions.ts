const initTerrainCopyPasteActions = () => {
    // needs Escaper

    const TerrainCopyPaste_Actions = () => {
        let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeTerrainCopyPaste = MakeTerrainCopyPaste(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(mk.maker)
        mk.saveLoc(x, y)
    }
}
