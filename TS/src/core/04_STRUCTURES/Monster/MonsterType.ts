

const initMonsterType = () => { // initializer Init_MonsterType needs ImmolationSkills


//struct MonsterType

    string label
    string theAlias
// TODO; Used to be private
     integer unitTypeId
// TODO; Used to be private
     real scale //influe sur la taille de l'unité ; 1.0 donne une taille normale
// TODO; Used to be private
     integer immolationSkill
// TODO; Used to be private
     real speed
// TODO; Used to be private
     boolean isClickableB
// TODO; Used to be private
     string killingEffectStr
// TODO; Used to be private
     integer maxLife
// TODO; Used to be private
     real height
    
    
	


const setLabel = (label: string): void => {
	this.label = label;
};

const setAlias = (theAlias: string): MonsterType => {
	this.theAlias = theAlias;
	return _this;
};

// TODO; Used to be static
const create = (label: string, unitTypeId: number, scale: number, immolationRadius: number, speed: number, isClickable: boolean): MonsterType => {
	let mt: MonsterType;
	let testMonster: unit;
	if ((speed <= 0 || speed > MAX_MOVE_SPEED || (scale <= 0 && scale !== -1) || !((immolationRadius / 5) === I2R(R2I(immolationRadius / 5))) || immolationRadius < 0 || immolationRadius > 400)) {
		return 0;
	}
	testMonster = CreateUnit(NEUTRAL_PLAYER, unitTypeId, 0, 0, 0);
	if ((testMonster === null)) {
		return 0;
	} else {
		RemoveUnit(testMonster)
		testMonster = null;
	}
	mt = MonsterType.allocate()
	mt.label = label
	mt.theAlias = null
	mt.unitTypeId = unitTypeId
	mt.scale = scale
	mt.immolationSkill = IMMOLATION_SKILLS[R2I(immolationRadius/5)]
	mt.speed = speed
	mt.isClickableB = isClickable
	mt.killingEffectStr = null
	mt.maxLife = 10000
	mt.height = -1
	return mt;
};

const refresh = (): void => {
	let levelsMaking: Array<Level> = [];
	let escaper: Escaper;
	let i: number;
	let j: number;
	let levelAlreadyChecked: boolean;
	let nbLevelsMaking = 0;
	local Level currentLevel = udg_levels.getCurrentLevel()
 currentLevel.recreateMonstersOfType(this) 
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
 levelsMaking[i].recreateMonstersOfType(this)
		i = i + 1;
	}
};

const onDestroy = (): void => {
 udg_levels.removeMonstersOfType(this)
};

const getUnitTypeId = (): number => {
	return this.unitTypeId;
};

const setUnitTypeId = (unitTypeId: number): boolean => {
	let testMonster = CreateUnit(NEUTRAL_PLAYER, unitTypeId, 0, 0, 0);
	if ((testMonster === null)) {
		return false;
	}
	RemoveUnit(testMonster)
	testMonster = null;
	this.unitTypeId = unitTypeId;
	this.refresh()
	return true;
};

const getScale = (): number => {
	return this.scale;
};

const setScale = (scale: number): boolean => {
	if (((scale <= 0 && scale !== -1) || scale === this.scale)) {
		return false;
	}
	this.scale = scale;
	this.refresh()
	return true;
};

const getImmolationSkill = (): number => {
	return this.immolationSkill;
};

const setImmolation = (immolationRadius: number): boolean => {
	if ((!((immolationRadius / 5) === I2R(R2I(immolationRadius / 5))) || immolationRadius < 0 || immolationRadius > 400)) {
		return false;
	}
	this.immolationSkill = IMMOLATION_SKILLS[R2I(immolationRadius / 5)];
	this.refresh()
	return true;
};

const getUnitMoveSpeed = (): number => {
	return this.speed;
};

const setUnitMoveSpeed = (speed: number): boolean => {
	if ((speed <= 0 || speed > MAX_MOVE_SPEED)) {
		return false;
	}
	this.speed = speed;
	this.refresh()
	return true;
};

const isClickable = (): boolean => {
	return this.isClickableB;
};

const setIsClickable = (isClickable: boolean): boolean => {
	if ((this.isClickableB === isClickable)) {
		return false;
	}
	this.isClickableB = isClickable;
	this.refresh()
	return true;
};

const getKillingEffectStr = (): string => {
	return this.killingEffectStr;
};

const setKillingEffectStr = (effectStr: string): MonsterType => {
	this.killingEffectStr = effectStr;
	return _this;
};

const setNbMeteorsToKill = (nbMeteorsToKill: number): MonsterType => {
	//nombre de météores qu'il faut pour tuer le monstre, sachant qu'une météore fait 10k de dégât
	if ((nbMeteorsToKill < 1 || nbMeteorsToKill > 9)) {
		return _this;
	}
	this.maxLife = nbMeteorsToKill * 10000;
	if ((this.isClickableB)) {
		this.refresh()
	}
	return _this;
};

const getMaxLife = (): number => {
	return this.maxLife;
};

const getHeight = (): number => {
	return this.height;
};

const setHeight = (height: number): boolean => {
	if ((height !== -1 && height < 0 && height !== this.height)) {
		return false;
	}
	this.height = height;
	this.refresh()
	return true;
};

const getImmolationRadiusStr = (): string => {
	let immoStr = Ascii2String(this.immolationSkill);
	immoStr = SubStringBJ(immoStr, 2, 4);
	return I2S(S2I(immoStr));
};

const displayForPlayer = (p: player): void => {
	let space = "   ";
	let display = udg_colorCode[RED] + this.label + " " + this.theAlias + " : '";
	let scaleDisplay: string;
	let heightDisplay: string;
	if ((this.scale === -1)) {
		scaleDisplay = "default";
	} else {
		scaleDisplay = R2S(this.scale);
	}
	if ((this.height === -1)) {
		heightDisplay = "default";
	} else {
		heightDisplay = I2S(R2I(this.height));
	}
	display = display + Ascii2String(this.unitTypeId) + "'" + space + "'" + Ascii2String(this.immolationSkill) + "'";
	display = display + space + "speed_" + I2S(R2I(this.speed)) + space + "scale_" + scaleDisplay + space + "height_" + heightDisplay;
	if ((this.isClickableB)) {
		display = display + space + "clickable" + space + I2S(this.maxLife / 10000);
	}
	Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
};

const displayTotalForPlayer = (p: player): void => {
	let space = "   ";
	let display = udg_colorCode[RED] + this.label + " " + this.theAlias + " : '";
	let scaleDisplay: string;
	let heightDisplay: string;
	if ((this.scale === -1)) {
		scaleDisplay = "default";
	} else {
		scaleDisplay = R2S(this.scale);
	}
	if ((this.height === -1)) {
		heightDisplay = "default";
	} else {
		heightDisplay = I2S(R2I(this.height));
	}
	display = display + Ascii2String(this.unitTypeId) + "'" + space + "'" + Ascii2String(this.immolationSkill) + "'";
	display = display + space + "speed_" + I2S(R2I(this.speed)) + space + "scale_" + scaleDisplay + space + "height_" + heightDisplay + space + this.killingEffectStr;
	if ((this.isClickableB)) {
		display = display + space + "clickable" + space + I2S(this.maxLife / 10000);
	}
	Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
};

const toString = (): string => {
	let str = this.label + CACHE_SEPARATEUR_PARAM + this.theAlias + CACHE_SEPARATEUR_PARAM;
	str = str + Ascii2String(this.unitTypeId) + CACHE_SEPARATEUR_PARAM + R2S(this.scale) + CACHE_SEPARATEUR_PARAM;
	str = str + this.getImmolationRadiusStr() + CACHE_SEPARATEUR_PARAM + R2S(this.speed) + CACHE_SEPARATEUR_PARAM;
	str = str + BasicFunctions.B2S(this.isClickableB) + CACHE_SEPARATEUR_PARAM + this.killingEffectStr + CACHE_SEPARATEUR_PARAM;
	str = str + I2S(this.maxLife / 10000) + CACHE_SEPARATEUR_PARAM + R2S(this.height);
	return str;
};

//endstruct



//===========================================================================
const Init_MonsterType = (): void => {};



}
