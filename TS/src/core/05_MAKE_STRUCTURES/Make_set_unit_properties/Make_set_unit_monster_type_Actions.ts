

const initMakeSetUnitMonsterTypeActions = () => { // needs BasicFunctions, Escaper


const SetUnitMonsterType_Actions = (): void => {

	//modes : oneByOne, twoClics

	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeSetUnitMonsterType mk = MakeSetUnitMonsterType(integer(mkGeneral))
	let monster: Monster;
	let nbMonstersFixed = 0;
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let i: number;

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
 StopUnit(mk.maker)
	if ( (mk.getMode() == "oneByOne") ) {
		monster = escaper.getMakingLevel().monstersNoMove.getMonsterNear(x, y)
		if ( (monster == 0 or monster.u == null) ) {
			monster = escaper.getMakingLevel().monstersSimplePatrol.getMonsterNear(x, y) 
			if ( (monster == 0 or monster.u == null) ) {
				monster = escaper.getMakingLevel().monstersMultiplePatrols.getMonsterNear(x, y) 
				if ( (monster == 0 or monster.u == null) ) {
					monster = escaper.getMakingLevel().monstersTeleport.getMonsterNear(x, y) 
				}
			}
		}
		if ( (monster != 0 and monster.u != null) ) {
			if ( (monster.setMonsterType(mk.getMonsterType())) ) {
				nbMonstersFixed = 1;
			}
		}
	} else {
		//mode twoClics
		if ( (not mk.isLastLocSavedUsed()) ) {
 mk.saveLoc(x, y)
			return;
		}

		i = 0;
		while (true) {
			if (i > escaper.getMakingLevel().monstersNoMove.getLastInstanceId()) break;
			monster = escaper.getMakingLevel().monstersNoMove.get(i)
			if ( (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) ) {
				if ( (monster.setMonsterType(mk.getMonsterType())) ) {
					nbMonstersFixed = nbMonstersFixed + 1;
				}
			}
			i = i + 1;
		}

		i = 0;
		while (true) {
			if (i > escaper.getMakingLevel().monstersSimplePatrol.getLastInstanceId()) break;
			monster = escaper.getMakingLevel().monstersSimplePatrol.get(i)
			if ( (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) ) {
				if ( (monster.setMonsterType(mk.getMonsterType())) ) {
					nbMonstersFixed = nbMonstersFixed + 1;
				}
			}
			i = i + 1;
		}

		i = 0;
		while (true) {
			if (i > escaper.getMakingLevel().monstersMultiplePatrols.getLastInstanceId()) break;
			monster = escaper.getMakingLevel().monstersMultiplePatrols.get(i)
			if ( (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) ) {
				if ( (monster.setMonsterType(mk.getMonsterType())) ) {
					nbMonstersFixed = nbMonstersFixed + 1;
				}
			}
			i = i + 1;
		}

		i = 0;
		while (true) {
			if (i > escaper.getMakingLevel().monstersTeleport.getLastInstanceId()) break;
			monster = escaper.getMakingLevel().monstersTeleport.get(i)
			if ( (monster != 0 and monster.u != null and IsUnitBetweenLocs(monster.u, mk.lastX, mk.lastY, x, y)) ) {
				if ( (monster.setMonsterType(mk.getMonsterType())) ) {
					nbMonstersFixed = nbMonstersFixed + 1;
				}
			}
			i = i + 1;
		}
	}

	if ((nbMonstersFixed <= 1)) {
 Text_mkP(mk.makerOwner, I2S(nbMonstersFixed) + " monster fixed.")
	} else {
 Text_mkP(mk.makerOwner, I2S(nbMonstersFixed) + " monsters fixed.")
	}
 mk.unsaveLocDefinitely()
};



}

