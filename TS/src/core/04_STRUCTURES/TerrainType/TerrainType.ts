

const initTerrainType = () => { // needs TerrainTypeFunctions, TerrainFunctions


//struct TerrainType 

    string label
    string theAlias
    string kind
	integer terrainTypeId
    integer orderId //numéro du terrain (ordre des tilesets), de 1 à 16
    integer cliffClassId //cliff class 1 or 2, depending of the main tileset
    
    


const setOrderId = (orderId: number): TerrainType => {
	this.orderId = orderId;
	        return TerrainType(integer(this))
};

const getOrderId = (): number => {
	return this.orderId;
};

const setCliffClassId = (cliffClassId: number): TerrainType => {
	if ((cliffClassId === 1 || cliffClassId === 2)) {
		this.cliffClassId = cliffClassId;
	}
	        return TerrainType(integer(this))
};

const getCliffClassId = (): number => {
	return this.cliffClassId;
};

const setType = (terrainTypeId: number) => {
	this.terrainTypeId = terrainTypeId;
};

const setLabel = (label: string) => {
	this.label = label;
};

const setAlias = (theAlias: string): TerrainType => {
	this.theAlias = theAlias;
	        return TerrainType(integer(this))
};

const getTerrainTypeId = (): number => {
	return this.terrainTypeId;
};

const setTerrainTypeId = (terrainTypeId: number): boolean => {
	if ((!CanUseTerrain(terrainTypeId))) {
		return false;
	}
	this.terrainTypeId = terrainTypeId;
	return true;
};

const getKind = (): string => {
	return this.kind;
};

const onDestroy = () => {
	this.label = null;
	this.theAlias = null;
	this.kind = null;
	this.terrainTypeId = 0;
};

const displayForPlayer = (p: player) => {
	let order: string;
	let space = "   ";
	let slide: TerrainTypeSlide;
	let walk: TerrainTypeWalk;
	let death: TerrainTypeDeath;
	let displayCanTurn: string;
	let display: string;
	if ((this.orderId !== 0)) {
		order = " (order " + I2S(this.orderId) + ")";
	} else {
		order = "";
	}
	if ((this.kind === "slide")) {
		            slide = TerrainTypeSlide(integer(this))
		if ( (slide.getCanTurn()) ) {
			displayCanTurn = "can turn";
		} else {
			displayCanTurn = "can't turn";
		}
		display = COLOR_TERRAIN_SLIDE + this.label + " " + this.theAlias + order + " : '" + Ascii2String(this.terrainTypeId) + "'" + space;
		display = display + I2S(R2I(slide.getSlideSpeed()/SLIDE_PERIOD)) + space + displayCanTurn
	} else {
		if ((this.kind === "walk")) {
			            walk = TerrainTypeWalk(integer(this))
			display = COLOR_TERRAIN_WALK + this.label + " " + this.theAlias + order + " : '" + Ascii2String(this.terrainTypeId) + "'" + space;
			display = display + I2S(R2I(walk.getWalkSpeed()))
		} else {
			if ((this.kind === "death")) {
				            death = TerrainTypeDeath(integer(this))
				display = COLOR_TERRAIN_DEATH + this.label + " " + this.theAlias + order + " : '" + Ascii2String(this.terrainTypeId) + "'" + space;
				display = display + R2S(death.getTimeToKill()) + space + death.getKillingEffectStr() + space + I2S(R2I(death.getToleranceDist()))
			}
		}
	}
	//display cliff class
	display = display + space + "cliff" + I2S(this.cliffClassId);
	Text.P_timed(p, TERRAIN_DATA_DISPLAY_TIME, display)
};

const toString = (): string => {
	let slide: TerrainTypeSlide;
	let walk: TerrainTypeWalk;
	let death: TerrainTypeDeath;
	let str = this.label + CACHE_SEPARATEUR_PARAM + this.theAlias + CACHE_SEPARATEUR_PARAM + I2S(this.orderId) + CACHE_SEPARATEUR_PARAM;
	str = str + this.kind + CACHE_SEPARATEUR_PARAM + Ascii2String(this.terrainTypeId) + CACHE_SEPARATEUR_PARAM + I2S(this.cliffClassId) + CACHE_SEPARATEUR_PARAM;
	if ((this.kind === "slide")) {
		            slide = TerrainTypeSlide(integer(this))
		str = str + I2S(R2I(slide.getSlideSpeed() / SLIDE_PERIOD)) + CACHE_SEPARATEUR_PARAM + BasicFunctions.B2S(slide.getCanTurn())
	} else {
		if ((this.kind === "walk")) {
			            walk = TerrainTypeWalk(integer(this))
			str = str + I2S(R2I(walk.getWalkSpeed()))
		} else {
			if ((this.kind === "death")) {
				            death = TerrainTypeDeath(integer(this))
				str = str + death.getKillingEffectStr() + CACHE_SEPARATEUR_PARAM
				str = str + R2S(death.getTimeToKill()) + CACHE_SEPARATEUR_PARAM
				str = str + R2S(death.getToleranceDist())
			}
		}
	}
	return str;
};

//endstruct


}
