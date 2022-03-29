const initMakeGetUnitTeleportPeriodActions = () => {
    // needs BasicFunctions, Escaper

    const GetUnitTeleportPeriod_Actions = () => {
        let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeGetUnitTeleportPeriod = MakeGetUnitTeleportPeriod(integer(mkGeneral))
        let monster: MonsterTeleport
        let x = GetOrderPointX()
        let y = GetOrderPointY()
        let i: number

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(mk.maker)
        monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
        if (monster != 0 && monster.u != null) {
            Text.mkP(mk.makerOwner, 'period : ' + R2S(monster.getPeriod()) + ' s')
        }
    }
}
