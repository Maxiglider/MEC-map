

const initMakeGetUnitTeleportPeriod = () => { // needs Make



//struct MakeGetUnitTeleportPeriod extends Make

// TODO; Used to be static
     


const create = (maker: unit): MakeGetUnitTeleportPeriod => {
	let m: MakeGetUnitTeleportPeriod;
	if ((maker === null)) {
		return 0;
	}
	m = MakeGetUnitTeleportPeriod.allocate()
	m.maker = maker
	m.makerOwner = GetOwningPlayer(maker)
	m.kind = "getUnitTeleportPeriod"
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
