

const initMonsterTypeArray = () => { // needs MonsterType


//struct MonsterTypeArray

// TODO; Used to be private
     MonsterType array monsterTypes
// TODO; Used to be private
     integer numberOfMonsterTypes

// TODO; Used to be static
     


const create = (): MonsterTypeArray => {
	local MonsterTypeArray ma = MonsterTypeArray.allocate()
	ma.numberOfMonsterTypes = 0
	return ma;
};

const get = (label: string): MonsterType => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfMonsterTypes)) break;
		if ( (this.monsterTypes[i].label == label or this.monsterTypes[i].theAlias == label) ) {
			return this.monsterTypes[i];
		}
		i = i + 1;
	}
	return 0;
};

const isLabelAlreadyUsed = (label: string): boolean => {
	return (this.get(label) !== 0);
};

const new = (label: string, unitTypeId: number, scale: number, immolationRadius: number, speed: number, isClickable: boolean): MonsterType => {
	let n = this.numberOfMonsterTypes;
	if ((this.isLabelAlreadyUsed(label))) {
		return 0;
	}
	this.monsterTypes[n] = MonsterType.create(label, unitTypeId, scale, immolationRadius, speed, isClickable)
	if ((this.monsterTypes[n] !== 0)) {
		this.numberOfMonsterTypes = this.numberOfMonsterTypes + 1;
	}
	return this.monsterTypes[n];
};

const remove = (label: string): boolean => {
	let position: number;
	let i: number;
	let mt = this.get(label);
	if ((mt === 0)) {
		return false;
	}
	i = 0;
	while (true) {
		if (this.monsterTypes[i].label == label or this.monsterTypes[i].theAlias == label or i >= this.numberOfMonsterTypes) break;
		i = i + 1;
	}
	if ((i < this.numberOfMonsterTypes)) {
		position = i;
		i = i + 1;
		while (true) {
			if ((i >= this.numberOfMonsterTypes)) break;
			this.monsterTypes[ i - 1 ] = this.monsterTypes[i];
			i = i + 1;
		}
		this.numberOfMonsterTypes = this.numberOfMonsterTypes - 1;
	}
 mt.destroy()
	return true;
};

const displayForPlayer = (p: player): void => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfMonsterTypes)) break;
 this.monsterTypes[i].displayForPlayer(p)
		i = i + 1;
	}
	if ((this.numberOfMonsterTypes === 0)) {
		Text.erP(p, "no monster type saved")
	}
};

const monsterUnit2KillEffectStr = (monsterUnit: unit): string => {
	local MonsterOrCaster moc = MonsterOrCaster.create(GetUnitUserData(monsterUnit))
	local MonsterType mt = moc.getMonsterType()
 moc.destroy()
	return mt.getKillingEffectStr()
};

const monsterUnit2MonsterType = (monsterUnit: unit): MonsterType => {
	let monsterUnitTypeId = GetUnitTypeId(monsterUnit);
	let i = 0;
	while (true) {
		if ((i >= this.numberOfMonsterTypes)) break;
		if ((this.monsterTypes[i].getUnitTypeId() == monsterUnitTypeId)) {
			return this.monsterTypes[i];
		}
		i = i + 1;
	}
	return 0;
};

const saveInCache = (): void => {
	let i: number;
	stringArrayForCache = StringArrayForCache.create("monsterTypes", "monsterTypes", true)
	i = 0;
	while (true) {
		if ((i >= this.numberOfMonsterTypes)) break;
 stringArrayForCache.push(this.monsterTypes[i].toString())
		i = i + 1;
	}
 stringArrayForCache.writeInCache()
};

//endstruct



}
