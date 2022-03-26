

const initTerrainHeightMakingActions = () => { // needs BasicFunctions, Escaper



const TerrainHeightMaking_Actions = (): void => {
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeTerrainHeight mk = MakeTerrainHeight(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
 StopUnit(mk.maker)
 escaper.newAction(MakeTerrainHeightAction.create(mk.getRadius(), mk.getHeight(), x, y))
};



}
