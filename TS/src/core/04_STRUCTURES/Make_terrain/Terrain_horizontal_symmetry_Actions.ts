const initTerrainHorizontalSymmetryActions = () => {
    // needs Escaper

    const TerrainHorizontalSymmetry_Actions = () => {
        let action: MakeAction
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeTerrainHorizontalSymmetry = MakeTerrainHorizontalSymmetry(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        if (mk.isLastLocSavedUsed()) {
            action = new MakeTerrainHorizontalSymmetryAction(mk.lastX, mk.lastY, x, y)
            if (action === 0) {
                Text.erP(escaper.getPlayer(), 'too big zone')
            } else {
                escaper.newAction(action)
                mk.unsaveLocDefinitely()
            }
        } else {
            mk.saveLoc(x, y)
        }
    }
}
