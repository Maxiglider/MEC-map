

const initTerrainTypeSlide = () => { // needs TerrainType


//struct TerrainTypeSlide extends TerrainType

// TODO; Used to be private
	 real slideSpeed
// TODO; Used to be private
     boolean canTurn
	
	
// TODO; Used to be static
	 


const create = (label: string, terrainTypeId: number, slideSpeed: number, canTurn: boolean): TerrainTypeSlide => {
	let tt: TerrainTypeSlide;
	if ((!CanUseTerrain(terrainTypeId))) {
		return 0;
	}
	tt = TerrainTypeSlide.allocate()
	tt.label = label
	tt.theAlias = null
	tt.terrainTypeId = terrainTypeId
	tt.kind = "slide"
	tt.slideSpeed = slideSpeed * SLIDE_PERIOD
	tt.canTurn = canTurn
	tt.orderId = 0
	tt.cliffClassId = 1
	return tt;
};

const getSlideSpeed = (): number => {
	return this.slideSpeed;
};

const setSlideSpeed = (slideSpeed: number): void => {
	this.slideSpeed = slideSpeed * SLIDE_PERIOD;
};

const getCanTurn = (): boolean => {
	return this.canTurn;
};

const setCanTurn = (canTurn: boolean): boolean => {
	if ((canTurn === this.canTurn)) {
		return false;
	}
	this.canTurn = canTurn;
	return true;
};

//endstruct




}
