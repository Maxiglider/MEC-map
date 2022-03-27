

const initMMMultiplePatrolsActions = () => { // needs BasicFunctions, Escaper


const MonsterMakingMultiplePatrols_Actions = (): void => {
	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeMonsterMultiplePatrols mk = MakeMonsterMultiplePatrols(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let erreur: number;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	if ( (mk.getLocPointeur() >= 0) ) {
		erreur = mk.getMonster().addNewLoc(x, y)
		if ((erreur > 0)) {
			if ((erreur === 3)) {
 Text.erP(mk.makerOwner, "Number limit of patrol locations reached for this monster ! ( " + I2S(MonsterMultiplePatrols.NB_MAX_LOC) + " )")
			}
			if ((erreur === 2)) {
 Text.erP(mk.makerOwner, "Too close to the last location !")
			}
			if ((erreur === 1)) {
 Text.erP(mk.makerOwner, "Too close to the first location !")
			}
		} else {
 mk.saveLoc(x, y)
		}
	} else {
 MonsterMultiplePatrols.destroyLocs()
 MonsterMultiplePatrols.storeNewLoc(x, y)
 mk.saveLoc(x, y)
 mk.setMonster(escaper.getMakingLevel().monstersMultiplePatrols.new(mk.getMonsterType(), mk.getMode(), true))
	}
};



}

