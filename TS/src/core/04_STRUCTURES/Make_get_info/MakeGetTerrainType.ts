

const initMakeGetTerrainType = () => { // needs Make



//struct MakeGetTerrainType extends Make

// TODO; Used to be static
	 


const create = (maker: unit): MakeGetTerrainType => {
	let m: MakeGetTerrainType;
	if ((maker === null)) {
		return 0;
	}
	m = MakeGetTerrainType.allocate()
	m.maker = maker
	m.makerOwner = GetOwningPlayer(maker)
	m.kind = "getTerrainType"
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	return m;
};

const onDestroy = (): void => {
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
