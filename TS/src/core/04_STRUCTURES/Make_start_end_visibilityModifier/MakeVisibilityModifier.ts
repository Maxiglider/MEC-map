

const initMakeVisibilityModifier = () => { // needs Make



//struct MakeVisibilityModifier extends Make

    real lastX
    real lastY
// TODO; Used to be private
     unit unitLastClic
// TODO; Used to be private
     boolean lastLocIsSaved
// TODO; Used to be private
	 boolean lastLocSavedIsUsed
    
// TODO; Used to be static
	 


const create = (maker: unit): MakeVisibilityModifier => {
	let m: MakeVisibilityModifier;
	if ((maker === null)) {
		return 0;
	}
	m = MakeVisibilityModifier.allocate()
	m.maker = maker
	m.makerOwner = GetOwningPlayer(maker)
	m.kind = "visibilityModifierCreate"
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	m.lastLocIsSaved = false
	m.lastLocSavedIsUsed = false
	return m;
};

const onDestroy = (): void => {
	DestroyTrigger(this.t)
	this.t = null;
	RemoveUnit(this.unitLastClic)
	this.unitLastClic = null;
	this.maker = null;
};

const saveLoc = (x: number, y: number): void => {
	this.lastX = x;
	this.lastY = y;
	this.lastLocIsSaved = true;
	this.lastLocSavedIsUsed = true;
	if ((this.unitLastClic === null)) {
		this.unitLastClic = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg());
	} else {
		SetUnitX(this.unitLastClic, x)
		SetUnitY(this.unitLastClic, y)
	}
 Hero2Escaper(this.maker).destroyCancelledActions()
};

const unsaveLoc = (): boolean => {
	if ((!this.lastLocSavedIsUsed)) {
		return false;
	}
	RemoveUnit(this.unitLastClic)
	this.unitLastClic = null;
	this.lastLocSavedIsUsed = false;
	return true;
};

const unsaveLocDefinitely = (): void => {
	this.unsaveLoc()
	this.lastLocIsSaved = false;
};

const isLastLocSavedUsed = (): boolean => {
	return this.lastLocSavedIsUsed;
};

const cancelLastAction = (): boolean => {
	return this.unsaveLoc();
};

const redoLastAction = (): boolean => {
	if ((!this.lastLocSavedIsUsed && this.lastLocIsSaved)) {
		this.saveLoc(this.lastX, this.lastY)
		return true;
	}
	return false;
};

//endstruct



}
