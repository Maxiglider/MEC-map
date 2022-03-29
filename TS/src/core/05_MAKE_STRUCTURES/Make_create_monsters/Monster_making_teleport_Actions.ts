const initMMTeleportActions = () => {
    // needs BasicFunctions, Escaper

    const MonsterMakingTeleport_Actions = () => {
        let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit())
        let mkGeneral: Make = escaper.getMake()
        let mk: MakeMonsterTeleport = MakeMonsterTeleport(integer(mkGeneral))
        let x = GetOrderPointX()
        let y = GetOrderPointY()

        if (!BasicFunctions.IsIssuedOrder('smart')) {
            return
        }
        BasicFunctions.StopUnit(mk.maker)
        if (mk.getLocPointeur() >= 0) {
            if (!mk.getMonster().addNewLoc(x, y)) {
                Text.erP(
                    mk.makerOwner,
                    'Number limit of actions reached for this monster ! ( ' + I2S(MonsterTeleport.NB_MAX_LOC) + ' )'
                )
            } else {
                mk.saveLoc(x, y)
            }
        } else {
            MonsterTeleport.destroyLocs()
            MonsterTeleport.storeNewLoc(x, y)
            mk.saveLoc(x, y)
            mk.setMonster(
                escaper
                    .getMakingLevel()
                    .monstersTeleport.new(mk.getMonsterType(), mk.getPeriod(), mk.getAngle(), mk.getMode(), true)
            )
        }
    }
}
