

const initMakeTerrainHeight = () => { // needs Make




//struct MakeTerrainHeight extends Make    

// TODO; Used to be private
     real radius
// TODO; Used to be private
     real height
	
// TODO; Used to be static
	 


const create = (maker: unit, radius: number, height: number): MakeTerrainHeight => {
	let m: MakeTerrainHeight;
	if ((maker === null)) {
		return 0;
	}
	m = MakeTerrainHeight.allocate()
	m.maker = maker
	m.radius = radius
	m.height = height
	m.kind = "terrainHeight"
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	return m;
};

const getRadius = (): number => {
	return this.radius;
};

const getHeight = (): number => {
	return this.height;
};

const onDestroy = () => {
	DestroyTrigger(this.t)
	this.t = null;
	this.maker = null;
};

const cancelLastAction = (): boolean => {
	return false;
};

const redoLastAction = (): boolean => {
	return false;
};

//endstruct



}
