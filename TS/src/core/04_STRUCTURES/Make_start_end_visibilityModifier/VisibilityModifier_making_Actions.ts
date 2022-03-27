

const initVisibilityModifierMakingActions = () => { // needs Escaper



const VisibilityModifierMaking_Actions = (): void => {
	let newVisibilityModifier: VisibilityModifier;
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeVisibilityModifier mk = MakeVisibilityModifier(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	if ( (mk.isLastLocSavedUsed()) ) {
		newVisibilityModifier = escaper.getMakingLevel().newVisibilityModifier(mk.lastX, mk.lastY, x, y)
		if ((newVisibilityModifier === 0)) {
 Text.erP(mk.makerOwner, "can't create visibility, full for this level")
		} else {
 newVisibilityModifier.activate(true)
 escaper.newAction(MakeVisibilityModifierAction.create(escaper.getMakingLevel(), newVisibilityModifier))
 Text.mkP(mk.makerOwner, "visibility rectangle made for level " + I2S(escaper.getMakingLevel().getId()))
		}
 mk.unsaveLocDefinitely()
	} else {
 mk.saveLoc(x, y)
	}
};



}
