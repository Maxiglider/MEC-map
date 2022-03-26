

const initTerrainTypeWalk = () => { // needs TerrainType


//struct TerrainTypeWalk extends TerrainType

// TODO; Used to be private
	 real walkSpeed
	
// TODO; Used to be static
	 


const create = (label: string, terrainTypeId: number, walkSpeed: number): TerrainTypeWalk => {
	let tt: TerrainTypeWalk;
	if ((!CanUseTerrain(terrainTypeId))) {
		return 0;
	}
	tt = TerrainTypeWalk.allocate()
	tt.label = label
	tt.theAlias = null
	tt.terrainTypeId = terrainTypeId
	tt.walkSpeed = walkSpeed
	tt.kind = "walk"
	tt.orderId = 0
	tt.cliffClassId = 1
	return tt;
};

const getWalkSpeed = (): number => {
	return this.walkSpeed;
};

const setWalkSpeed = (walkSpeed: number): void => {
	this.walkSpeed = walkSpeed;
};

//endstruct





}
