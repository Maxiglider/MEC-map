

const initEndMakingActions = () => { // needs Escaper



const EndMaking_Actions = (): void => {
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeEnd mk = MakeEnd(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	if ( (mk.isLastLocSavedUsed()) ) {
 escaper.getMakingLevel().newEnd(mk.lastX, mk.lastY, x, y)
 Text.mkP(mk.makerOwner, "end made for level " + I2S(escaper.getMakingLevel().getId()))
 escaper.destroyMake()
	} else {
 mk.saveLoc(x, y)
	}
};



}
