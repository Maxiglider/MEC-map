

const initTerrainHorizontalSymmetryActions = () => { // needs Escaper


const TerrainHorizontalSymmetry_Actions = (): void => {
	let action: MakeAction;
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeTerrainHorizontalSymmetry mk = MakeTerrainHorizontalSymmetry(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
 StopUnit(mk.maker)	
	if ( (mk.isLastLocSavedUsed()) ) {
		action = MakeTerrainHorizontalSymmetryAction.create(mk.lastX, mk.lastY, x, y)
		if ((action === 0)) {
 Text_erP(escaper.getPlayer(), "too big zone")
		} else {
 escaper.newAction(action)
 mk.unsaveLocDefinitely()
		}
	} else {
 mk.saveLoc(x, y)
	}
};


}
