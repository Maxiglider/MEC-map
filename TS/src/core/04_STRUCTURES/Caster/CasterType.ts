import { ColorCodes } from "core/01_libraries/Init_colorCodes";


const initCasterType = () => { // needs Text


const DEFAULT_CASTER_PROJECTILE_SPEED = 600;
const MIN_CASTER_PROJECTILE_SPEED = 100;
const DEFAULT_CASTER_RANGE = 1000;
const MIN_CASTER_LOAD_TIME = 0.2;
const DEFAULT_CASTER_LOAD_TIME = 1;
const DEFAULT_CASTER_ANIMATION = "spell";


//struct CasterType

    string label
    string theAlias
// TODO; Used to be private
     MonsterType casterMonsterType
// TODO; Used to be private
     MonsterType projectileMonsterType
// TODO; Used to be private
     real range
// TODO; Used to be private
     real projectileSpeed
// TODO; Used to be private
     real loadTime
// TODO; Used to be private
     string animation
    
// TODO; Used to be static
     


const create = (label: string, casterMonsterType: MonsterType, projectileMonsterType: MonsterType, range: number, projectileSpeed: number, loadTime: number, animation: string): CasterType => {
	let ct: CasterType;
	if ((range <= 0 || projectileSpeed <= 0)) {
		return 0;
	}
	ct = CasterType.allocate()
	ct.label = label
	ct.casterMonsterType = casterMonsterType
	ct.projectileMonsterType = projectileMonsterType
	ct.range = range
	ct.projectileSpeed = projectileSpeed
	ct.loadTime = loadTime
	ct.animation = animation
	return ct;
};


const setLabel = (label: string): void => {
	this.label = label;
};

const setAlias = (theAlias: string): MonsterType => {
	this.theAlias = theAlias;
	return _this;
};

const refresh = (): void => {
	let levelsMaking: Array<Level> = [];
	let escaper: Escaper;
	let i: number;
	let j: number;
	let levelAlreadyChecked: boolean;
	let nbLevelsMaking = 0;
	local Level currentLevel = udg_levels.getCurrentLevel()
 currentLevel.refreshCastersOfType(this) 
	i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		escaper = udg_escapers.get(i)
		if ((escaper !== 0)) {
			if ( (escaper.getMakingLevel() != currentLevel) ) {
				levelAlreadyChecked = false;
				j = 0;
				while (true) {
					if ((j >= nbLevelsMaking)) break;
					if ( (escaper.getMakingLevel() == levelsMaking[j]) ) {
						levelAlreadyChecked = true;
					}
					j = j + 1;
				}
				if ((!levelAlreadyChecked)) {
					levelsMaking[nbLevelsMaking] = escaper.getMakingLevel()
					nbLevelsMaking = nbLevelsMaking + 1;
				}
			}
		}
		i = i + 1;
	}
	i = 0;
	while (true) {
		if ((i >= nbLevelsMaking)) break;
 levelsMaking[i].refreshCastersOfType(this)
		i = i + 1;
	}
};

const onDestroy = (): void => {
 udg_levels.removeCastersOfType(this)
};

const getCasterMonsterType = (): MonsterType => {
	return this.casterMonsterType;
};

const setCasterMonsterType = (newCasterMonsterType: MonsterType): void => {
	this.casterMonsterType = newCasterMonsterType;
	this.refresh()
};

const getProjectileMonsterType = (): MonsterType => {
	return this.projectileMonsterType;
};

const setProjectileMonsterType = (newProjectileMonsterType: MonsterType): void => {
	this.projectileMonsterType = newProjectileMonsterType;
};

const getRange = (): number => {
	return this.range;
};

const setRange = (newRange: number): boolean => {
	if ((newRange <= 0)) {
		return false;
	}
	this.range = newRange;
	return true;
};

const getProjectileSpeed = (): number => {
	return this.projectileSpeed;
};

const setProjectileSpeed = (newSpeed: number): boolean => {
	if ((newSpeed <= 0)) {
		return false;
	}
	this.projectileSpeed = newSpeed;
	return true;
};

const getLoadTime = (): number => {
	return this.loadTime;
};

const setLoadTime = (loadTime: number): boolean => {
	if ((loadTime < MIN_CASTER_LOAD_TIME)) {
		return false;
	}
	this.loadTime = loadTime;
	return true;
};

const getAnimation = (): string => {
	return this.animation;
};

const setAnimation = (animation: string): void => {
	this.animation = animation;
};

const displayForPlayer = (p: player): void => {
	let space = "   ";
	let display = ColorCodes.udg_colorCode[TEAL] + this.label + " " + this.theAlias + " : ";
	display = display + this.casterMonsterType.label + space + this.projectileMonsterType.label + space + "range: " + R2S(this.range) + space
	display = display + "projectileSpeed: " + R2S(this.projectileSpeed) + space + "loadTime: " + R2S(this.loadTime) + space + this.animation;
	Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
};

const toString = (): string => {
	let str = this.label + CACHE_SEPARATEUR_PARAM + this.theAlias + CACHE_SEPARATEUR_PARAM;
	str = str + this.casterMonsterType.label + CACHE_SEPARATEUR_PARAM + this.projectileMonsterType.label + CACHE_SEPARATEUR_PARAM
	str = str + R2S(this.range) + CACHE_SEPARATEUR_PARAM + R2S(this.projectileSpeed) + CACHE_SEPARATEUR_PARAM + R2S(this.loadTime) + CACHE_SEPARATEUR_PARAM + this.animation;
	return str;
};

//endstruct


}
