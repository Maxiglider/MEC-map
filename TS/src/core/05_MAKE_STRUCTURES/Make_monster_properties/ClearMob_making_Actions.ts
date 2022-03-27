

const initMClearMobActions = () => { // needs TerrainTypeFunctions, Escaper



const ClearMobMaking_Actions = (): void => {
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeClearMob mk = MakeClearMob(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	let Mnm: MonsterNoMove;
	let Msp: MonsterSimplePatrol;
	let Mmp: MonsterMultiplePatrols;
	let Mt: MonsterTeleport;
	let caster: Caster;
	let monsterOrCasterId: number;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)

	//recherche du monsterOrCaster cliqué
	Mnm = escaper.getMakingLevel().monstersNoMove.getMonsterNear(x, y)
	if ( (Mnm != 0 and Mnm.u != null) ) {
		monsterOrCasterId = Mnm.getId()
	} else {
		Msp = escaper.getMakingLevel().monstersSimplePatrol.getMonsterNear(x, y)
		if ( (Msp != 0 and Msp.u != null) ) {
			monsterOrCasterId = Msp.getId()
		} else {
			Mmp = escaper.getMakingLevel().monstersMultiplePatrols.getMonsterNear(x, y)
			if ( (Mmp != 0 and Mmp.u != null) ) {
				monsterOrCasterId = Mmp.getId()
			} else {
				Mt = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
				if ( (Mt != 0 and Mt.u != null) ) {
					monsterOrCasterId = Mt.getId()
				} else {
					caster = escaper.getMakingLevel().casters.getCasterNear(x, y)
					if ( (caster != 0 and caster.casterUnit != null) ) {
						monsterOrCasterId = caster.getId()
					} else {
						monsterOrCasterId = 0;
					}
				}
			}
		}
	}

	//application du clic
	if ((monsterOrCasterId === 0)) {
 Text.erP(mk.makerOwner, "no monster clicked for your making level")
	} else {
 mk.clickMade(monsterOrCasterId)
	}
};



}

