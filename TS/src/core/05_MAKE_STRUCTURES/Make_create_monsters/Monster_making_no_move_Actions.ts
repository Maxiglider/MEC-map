

const initMMNoMoveActions = () => { // needs BasicFunctions, Escaper



const MonsterMakingNoMove_Actions = (): void => {
	let monster: Monster;
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeMonsterNoMove mk = MakeMonsterNoMove(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
 StopUnit(mk.maker)
	monster = escaper.getMakingLevel().monstersNoMove.new(mk.getMonsterType(), x, y, mk.getFacingAngle(), true)
 escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), monster))
};



}
