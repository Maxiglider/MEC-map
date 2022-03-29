const initMMNoMoveActions = () => {
    // needs BasicFunctions, Escaper

    const MonsterMakingNoMove_Actions = () => {
        let monster: Monster
        let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeMonsterNoMove = MakeMonsterNoMove(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(mk.maker)
        monster = escaper.getMakingLevel().monstersNoMove.new(mk.getMonsterType(), x, y, mk.getFacingAngle(), true)
        escaper.newAction(new MakeMonsterAction(escaper.getMakingLevel(), monster))
    }
}
