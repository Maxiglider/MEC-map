

const initMakeGetUnitTeleportPeriodActions = () => { // needs BasicFunctions, Escaper


const GetUnitTeleportPeriod_Actions = (): void => {

	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeGetUnitTeleportPeriod mk = MakeGetUnitTeleportPeriod(integer(mkGeneral))
	let monster: MonsterTeleport;
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let i: number;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
	if ( (monster != 0 and monster.u != null) ) {
 Text.mkP(mk.makerOwner, "period : " + R2S(monster.getPeriod()) + " s")
	}
};



}

