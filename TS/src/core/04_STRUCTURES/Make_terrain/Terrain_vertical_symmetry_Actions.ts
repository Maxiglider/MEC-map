

const initTerrainVerticalSymmetryActions = () => { // needs Escaper


const TerrainVerticalSymmetry_Actions = () => {
	let action: MakeAction;
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeTerrainVerticalSymmetry mk = MakeTerrainVerticalSymmetry(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)	
	if ( (mk.isLastLocSavedUsed()) ) {
		action = MakeTerrainVerticalSymmetryAction.create(mk.lastX, mk.lastY, x, y)
		if ((action === 0)) {
 Text.erP(escaper.getPlayer(), "too big zone")
		} else {
 escaper.newAction(action)
 mk.unsaveLocDefinitely()
		}
	} else {
 mk.saveLoc(x, y)
	}
};


}
