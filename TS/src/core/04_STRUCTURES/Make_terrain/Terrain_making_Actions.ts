

const initTerrainMakingActions = () => { // needs Escaper


const TerrainMaking_Actions = (): void => {
	let action: MakeAction;
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeTerrainCreate mk = MakeTerrainCreate(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)	
	if ( (mk.isLastLocSavedUsed()) ) {
		action = MakeTerrainCreateAction.create(mk.getTerrainType(), mk.lastX, mk.lastY, x, y)
		if ((action === -1)) {
 Text.erP(escaper.getPlayer(), "this terrain type doesn't exist anymore")
		} else {
			if ((action === 0)) {
 Text.erP(escaper.getPlayer(), "too big zone")
			} else {
 escaper.newAction(action)
 mk.unsaveLocDefinitely()
			}
		}
	} else {
 mk.saveLoc(x, y)
	}
};


}
