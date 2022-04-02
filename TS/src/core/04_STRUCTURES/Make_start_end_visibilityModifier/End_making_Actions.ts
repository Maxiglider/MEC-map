const initEndMakingActions = () => {
    // needs Escaper

    const EndMaking_Actions = () => {
        let escaper = Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeEnd = MakeEnd(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!IsIssuedOrder('smart')) {
            return
        }
        StopUnit(mk.maker)
        if (mk.isLastLocSavedUsed()) {
            escaper.getMakingLevel().newEnd(mk.lastX, mk.lastY, x, y)
            Text.mkP(mk.makerOwner, 'end made for level ' + I2S(escaper.getMakingLevel().getId()))
            escaper.destroyMake()
        } else {
            mk.saveLoc(x, y)
        }
    }
}
