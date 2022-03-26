

const initCasterDeleteActions = () => { // needs BasicFunctions, Escaper


const CasterDelete_Actions = (): void => {

	//modes : oneByOne, twoClics

	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeDeleteCasters mk = MakeDeleteCasters(integer(mkGeneral))
	let caster: Caster;
	let suppressionHashTable = InitHashtable();
	let nbCastersRemoved = 0;
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let i: number;

	if ((!IsIssuedOrder("smart"))) {
		FlushParentHashtable(suppressionHashTable)
		suppressionHashTable = null;
		return;
	}
 StopUnit(mk.maker)
	if ( (mk.getMode() == "oneByOne") ) {
		caster = escaper.getMakingLevel().casters.getCasterNear(x, y)
		if ( (caster != 0 and caster.casterUnit != null) ) {
 caster.disable()
 SaveInteger(suppressionHashTable, 0, nbCastersRemoved, integer(caster))
			nbCastersRemoved = 1;
		}
	} else {
		//mode twoClics
		if ( (not mk.isLastLocSavedUsed()) ) {
 mk.saveLoc(x, y)
			FlushParentHashtable(suppressionHashTable)
			suppressionHashTable = null;
			return;
		}

		i = 0;
		while (true) {
			if (i > escaper.getMakingLevel().casters.getLastInstanceId()) break;
			caster = escaper.getMakingLevel().casters.get(i)
			if ( (caster != 0 and caster.casterUnit != null and IsUnitBetweenLocs(caster.casterUnit, mk.lastX, mk.lastY, x, y)) ) {
 caster.disable()
 SaveInteger(suppressionHashTable, 0, nbCastersRemoved, integer(caster))
				nbCastersRemoved = nbCastersRemoved + 1;
			}
			i = i + 1;
		}
	}

	if ((nbCastersRemoved <= 1)) {
 Text_mkP(mk.makerOwner, I2S(nbCastersRemoved) + " caster removed.")
	} else {
 Text_mkP(mk.makerOwner, I2S(nbCastersRemoved) + " casters removed.")
	}

	if ((nbCastersRemoved > 0)) {
 escaper.newAction(MakeDeleteCastersAction.create(escaper.getMakingLevel(), suppressionHashTable))
	}
 mk.unsaveLocDefinitely()

	FlushParentHashtable(suppressionHashTable)
	suppressionHashTable = null;
};



}

