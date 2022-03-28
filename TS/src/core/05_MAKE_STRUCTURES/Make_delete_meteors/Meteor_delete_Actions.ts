

const initMeteorDeleteActions = () => { // needs BasicFunctions, Escaper


const MeteorDelete_Actions = () => {

	//modes : oneByOne, twoClics

	let escaper = EscaperFunctions.Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeDeleteMeteors mk = MakeDeleteMeteors(integer(mkGeneral))
	let meteor: Meteor;
	let suppressionHashTable = InitHashtable();
	let nbMeteorsRemoved = 0;
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let i: number;

	if ((!BasicFunctions.IsIssuedOrder("smart"))) {
		FlushParentHashtable(suppressionHashTable)
		suppressionHashTable = null;
		return;
	}
 BasicFunctions.StopUnit(mk.maker)
	if ( (mk.getMode() == "oneByOne") ) {
		if ((GetItemTypeId(GetOrderTargetItem()) !== METEOR_NORMAL)) {
			FlushParentHashtable(suppressionHashTable)
			suppressionHashTable = null;
			return;
		}
		meteor = Meteor(GetItemUserData(GetOrderTargetItem()));
		if ( (meteor != 0 and meteor.getItem() != null) ) {
 meteor.removeMeteor()
 SaveInteger(suppressionHashTable, 0, nbMeteorsRemoved, integer(meteor))
			nbMeteorsRemoved = 1;
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
			if (i > escaper.getMakingLevel().meteors.getLastInstanceId()) break;
			meteor = escaper.getMakingLevel().meteors.get(i)
			if ( (meteor != 0 and meteor.getItem() != null and BasicFunctions.IsItemBetweenLocs(meteor.getItem(), mk.lastX, mk.lastY, x, y)) ) {
 meteor.removeMeteor()
 SaveInteger(suppressionHashTable, 0, nbMeteorsRemoved, integer(meteor))
				nbMeteorsRemoved = nbMeteorsRemoved + 1;
			}
			i = i + 1;
		}
	}

	if ((nbMeteorsRemoved <= 1)) {
 Text.mkP(mk.makerOwner, I2S(nbMeteorsRemoved) + " meteor removed.")
	} else {
 Text.mkP(mk.makerOwner, I2S(nbMeteorsRemoved) + " meteors removed.")
	}

	if ((nbMeteorsRemoved > 0)) {
 escaper.newAction(MakeDeleteMeteorsAction.create(escaper.getMakingLevel(), suppressionHashTable))
	}
 mk.unsaveLocDefinitely()

	FlushParentHashtable(suppressionHashTable)
	suppressionHashTable = null;
};



}

