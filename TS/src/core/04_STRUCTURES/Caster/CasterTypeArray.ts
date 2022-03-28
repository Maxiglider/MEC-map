import { StringArrayForCache } from "core/07_TRIGGERS/Save_map_in_gamecache/struct_StringArrayForCache"


const initCasterTypeArray = () => { // needs CasterType


//struct CasterTypeArray

// TODO; Used to be private
     CasterType array casterTypes
// TODO; Used to be private
     integer numberOfCasterTypes

// TODO; Used to be static
     


const create = (): CasterTypeArray => {
	local CasterTypeArray ta = CasterTypeArray.allocate()
	ta.numberOfCasterTypes = 0
	return ta;
};

const get = (label: string): CasterType => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfCasterTypes)) break;
		if ( (this.casterTypes[i].label == label or this.casterTypes[i].theAlias == label) ) {
			return this.casterTypes[i];
		}
		i = i + 1;
	}
	return 0;
};

const isLabelAlreadyUsed = (label: string): boolean => {
	return (this.get(label) !== 0);
};

const new = (label: string, casterMonsterType: MonsterType, projectileMonsterType: MonsterType, range: number, projectileSpeed: number, loadTime: number, animation: string): CasterType => {
	let n = this.numberOfCasterTypes;
	if ((this.isLabelAlreadyUsed(label))) {
		return 0;
	}
	this.casterTypes[n] = CasterType.create(label, casterMonsterType, projectileMonsterType, range, projectileSpeed, loadTime, animation)
	if ((this.casterTypes[n] !== 0)) {
		this.numberOfCasterTypes = this.numberOfCasterTypes + 1;
	}
	return this.casterTypes[n];
};

const remove = (label: string): boolean => {
	let position: number;
	let i: number;
	let ct = this.get(label);
	if ((ct === 0)) {
		return false;
	}
	i = 0;
	while (true) {
		if (this.casterTypes[i].label == label or this.casterTypes[i].theAlias == label or i >= this.numberOfCasterTypes) break;
		i = i + 1;
	}
	if ((i < this.numberOfCasterTypes)) {
		position = i;
		i = i + 1;
		while (true) {
			if ((i >= this.numberOfCasterTypes)) break;
			this.casterTypes[ i - 1 ] = this.casterTypes[i];
			i = i + 1;
		}
		this.numberOfCasterTypes = this.numberOfCasterTypes - 1;
	}
 ct.destroy()
	return true;
};

const displayForPlayer = (p: player) => {
	let i = 0;
	while (true) {
		if ((i >= this.numberOfCasterTypes)) break;
 this.casterTypes[i].displayForPlayer(p)
		i = i + 1;
	}
	if ((this.numberOfCasterTypes === 0)) {
		Text.erP(p, "no caster type saved")
	}
};

const saveInCache = () => {
	let i: number;
	StringArrayForCache.stringArrayForCache = new StringArrayForCache("casterTypes", "casterTypes", true)
	i = 0;
	while (true) {
		if ((i >= this.numberOfCasterTypes)) break;
		StringArrayForCache.stringArrayForCache.push(this.casterTypes[i].toString())
		i = i + 1;
	}
	StringArrayForCache.stringArrayForCache.writeInCache()
};

//endstruct


}
