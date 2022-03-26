

const initMonsterSpawnMakingActions = () => { // needs Escaper



const MonsterSpawnMaking_Actions = (): void => {
	let escaper = Hero2Escaper(GetTriggerUnit());
	local Make mkGeneral = escaper.getMake()
		local MakeMonsterSpawn mk = MakeMonsterSpawn(integer(mkGeneral))
	let x = GetOrderPointX();
	let y = GetOrderPointY();
	let level: Level;

	if ((!IsIssuedOrder("smart"))) {
		return;
	}
 StopUnit(mk.maker)
	if ( (mk.isLastLocSavedUsed()) ) {
		level = escaper.getMakingLevel()
		if ((level.monsterSpawns.new(mk.label, mk.mt, mk.sens, mk.frequence, mk.lastX, mk.lastY, x, y, true) != 0)) {
 Text_mkP(mk.makerOwner, "monster spawn \"" + mk.label + "\" created")
 escaper.destroyMake()
		} else {
 Text_erP(mk.makerOwner, "impossible to create monster spawn \"" + mk.label + "\", label propably already in use")
		}
	} else {
 mk.saveLoc(x, y)
	}
};



}
