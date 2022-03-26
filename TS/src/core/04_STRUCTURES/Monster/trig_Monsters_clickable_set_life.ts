

const initMonstersClickableSetLife = () => { // initializer Init_MonstersClickableSetLife


let monstersClickable: group;
let trigMonstersClickableSetLife: trigger;
// TODO; Used to be private
const PERIOD = 0.1;


const MonstersClickableSetLifeForEach = (): void => {
	let monsterUnit = GetEnumUnit();
	let currentLife = GetUnitState(monsterUnit, UNIT_STATE_LIFE);
	let monster = Monster(LoadInteger(htMonsterId2MonsterHandleId, MonsterInterface_MONSTER, GetUnitUserData(monsterUnit)));
	local real previousLife = I2R(monster.getLife())
	let diffLife = RMaxBJ(currentLife, previousLife) - RMinBJ(currentLife, previousLife);
	if ((diffLife < 100)) {
 SetUnitLifeBJ(GetEnumUnit(), previousLife - 0.5)
	} else {
		while (true) {
			if ((diffLife <= 0)) break;
 monster.setLife(R2I(previousLife) - 10000)
			diffLife = diffLife - 10000;
		}
	}
};

const MonstersClickableSetLife_Actions = (): void => {
	ForGroup(monstersClickable, MonstersClickableSetLifeForEach)
};


//===========================================================================
const Init_MonstersClickableSetLife = (): void => {
	monstersClickable = CreateGroup();
	trigMonstersClickableSetLife = CreateTrigger();
	TriggerAddAction(trigMonstersClickableSetLife, MonstersClickableSetLife_Actions)
	TriggerRegisterTimerEvent(trigMonstersClickableSetLife, PERIOD, true)
};


}
