

const initStartMakingActions = () => { // needs Escaper



const StartMaking_Actions = (): void => {
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeStart mk = MakeStart(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let level: Level;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	if ( (mk.isLastLocSavedUsed()) ) {
		level = escaper.getMakingLevel()
		if ( (mk.forNext()) ) {
			if ( (udg_levels.get(level.getId() + 1) == 0) ) {
				if ( (not udg_levels.new()) ) {
 Text.erP(escaper.getPlayer(), "nombre maximum de niveaux atteint")
 escaper.destroyMake()
					return;
				}
			}
			level = udg_levels.get(level.getId() + 1)
			if ((level === 0)) {
 Text.erP(escaper.getPlayer(), "erreur d'origine inconnue")
 escaper.destroyMake()
				return;
			}
		}
 level.newStart(mk.lastX, mk.lastY, x, y)
 Text.mkP(mk.makerOwner, "start made for level " + I2S(level.getId()))
 escaper.destroyMake()
	} else {
 mk.saveLoc(x, y)
	}
};



}
