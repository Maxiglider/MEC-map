

const initMonsterDeleteActions = () => { // needs BasicFunctions, Escaper


const MonsterDelete_Actions = (): void => {

	//modes : oneByOne, all, noMove, move, simplePatrol, multiplePatrols

	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeDeleteMonsters mk = MakeDeleteMonsters(integer(mkGeneral))
	let Mnm: MonsterNoMove;
	let Msp: MonsterSimplePatrol;
	let Mmp: MonsterMultiplePatrols;
	let Mt: MonsterTeleport;
	let suppressionHashTable = InitHashtable();
	let nbMonstersRemoved = 0;
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
		Mnm = escaper.getMakingLevel().monstersNoMove.getMonsterNear(x, y)
		if ( (Mnm != 0 and Mnm.u != null) ) {
 Mnm.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mnm))
			nbMonstersRemoved = 1;
		} else {
			Msp = escaper.getMakingLevel().monstersSimplePatrol.getMonsterNear(x, y)
			if ( (Msp != 0 and Msp.u != null) ) {
 Msp.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Msp))
				nbMonstersRemoved = 1;
			} else {
				Mmp = escaper.getMakingLevel().monstersMultiplePatrols.getMonsterNear(x, y)
				if ( (Mmp != 0 and Mmp.u != null) ) {
 Mmp.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mmp))
					nbMonstersRemoved = 1;
				} else {
					Mt = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y)
					if ( (Mt != 0 and Mt.u != null) ) {
 Mt.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mt))
						nbMonstersRemoved = 1;
					}
				}
			}
		}

	} else {
		if ( (not mk.isLastLocSavedUsed()) ) {
 mk.saveLoc(x, y)
			FlushParentHashtable(suppressionHashTable)
			suppressionHashTable = null;
			return;
		}


		//no move
		if ( (mk.getMode() == "all" or mk.getMode() == "noMove") ) {
			i = 0;
			while (true) {
				if (i > escaper.getMakingLevel().monstersNoMove.getLastInstanceId()) break;
				Mnm = escaper.getMakingLevel().monstersNoMove.get(i)
				if ((Mnm !== 0)) {
					if ( (Mnm.u != null and BasicFunctions.IsUnitBetweenLocs(Mnm.u, mk.lastX, mk.lastY, x, y)) ) {
 Mnm.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mnm))
						nbMonstersRemoved = nbMonstersRemoved + 1;
					}
				}
				i = i + 1;
			}
		}

		//simple patrol
		if ( (mk.getMode() == "all" or mk.getMode() == "move" or mk.getMode() == "simplePatrol") ) {
			i = 0;
			while (true) {
				if (i > escaper.getMakingLevel().monstersSimplePatrol.getLastInstanceId()) break;
				Msp = escaper.getMakingLevel().monstersSimplePatrol.get(i)
				if ((Msp !== 0)) {
					if ( (Msp.u != null and BasicFunctions.IsUnitBetweenLocs(Msp.u, mk.lastX, mk.lastY, x, y)) ) {
 Msp.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Msp))
						nbMonstersRemoved = nbMonstersRemoved + 1;
					}
				}
				i = i + 1;
			}
		}

		//multiple patrol
		if ( (mk.getMode() == "all" or mk.getMode() == "move" or mk.getMode() == "multiplePatrols") ) {
			i = 0;
			while (true) {
				if (i > escaper.getMakingLevel().monstersMultiplePatrols.getLastInstanceId()) break;
				Mmp = escaper.getMakingLevel().monstersMultiplePatrols.get(i)
				if ((Mmp !== 0)) {
					if ( (Mmp.u != null and BasicFunctions.IsUnitBetweenLocs(Mmp.u, mk.lastX, mk.lastY ,x, y)) ) {
 Mmp.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mmp))
						nbMonstersRemoved = nbMonstersRemoved + 1;
					}
				}
				i = i + 1;
			}
		}

		//teleport
		if ( (mk.getMode() == "all") ) {
			i = 0;
			while (true) {
				if (i > escaper.getMakingLevel().monstersTeleport.getLastInstanceId()) break;
				Mt = escaper.getMakingLevel().monstersTeleport.get(i)
				if ((Mt !== 0)) {
					if ( (Mt.u != null and BasicFunctions.IsUnitBetweenLocs(Mt.u, mk.lastX, mk.lastY ,x, y)) ) {
 Mt.removeUnit()
 SaveInteger(suppressionHashTable, 0, nbMonstersRemoved, integer(Mt))
						nbMonstersRemoved = nbMonstersRemoved + 1;
					}
				}
				i = i + 1;
			}
		}
	}

	if ((nbMonstersRemoved <= 1)) {
 Text.mkP(mk.makerOwner, I2S(nbMonstersRemoved) + " monster removed.")
	} else {
 Text.mkP(mk.makerOwner, I2S(nbMonstersRemoved) + " monsters removed.")
	}

	if ((nbMonstersRemoved > 0)) {
 escaper.newAction(MakeDeleteMonstersAction.create(escaper.getMakingLevel(), suppressionHashTable))
	}
 mk.unsaveLocDefinitely()

	FlushParentHashtable(suppressionHashTable)
	suppressionHashTable = null;
};



}

