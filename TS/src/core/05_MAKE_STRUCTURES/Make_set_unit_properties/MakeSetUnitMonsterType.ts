

const initMakeSetUnitMonsterType = () => { // needs Make



//struct MakeSetUnitMonsterType extends Make

    real lastX
    real lastY
// TODO; Used to be private
     boolean lastLocIsSaved
// TODO; Used to be private
	 boolean lastLocSavedIsUsed
// TODO; Used to be private
     unit unitLastClic
// TODO; Used to be private
     string mode
// TODO; Used to be private
     MonsterType mt
    
    


const getMonsterType = (): MonsterType => {
	return this.mt;
};

const isLastLocSavedUsed = (): boolean => {
	return this.lastLocSavedIsUsed;
};

// TODO; Used to be static
const create = (maker: unit, mode: string, mt: MonsterType): MakeSetUnitMonsterType => {
	//modes : oneByOne, twoClics
	let m: MakeSetUnitMonsterType;
	if ((maker === null || (mode !== "oneByOne" && mode !== "twoClics") || mt === 0)) {
		return 0;
	}
	m = MakeSetUnitMonsterType.allocate()
	m.maker = maker
	m.makerOwner = GetOwningPlayer(maker)
	m.kind = "setUnitMonsterType"
	m.mode = mode
	m.mt = mt
	m.lastLocIsSaved = false
	m.lastLocSavedIsUsed = false
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	return m;
};

const onDestroy = () => {
	DestroyTrigger(this.t)
	this.t = null;
	this.maker = null;
	RemoveUnit(this.unitLastClic)
	this.unitLastClic = null;
};

const saveLoc = (x: number, y: number) => {
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
 EscaperFunctions.Hero2Escaper(this.maker).destroyCancelledActions()
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

const unsaveLocDefinitely = () => {
	this.unsaveLoc()
	this.lastLocIsSaved = false;
};

const cancelLastAction = (): boolean => {
	return this.unsaveLoc();
};

const redoLastAction = (): boolean => {
	if ((this.lastLocIsSaved && !this.lastLocSavedIsUsed)) {
		this.saveLoc(this.lastX, this.lastY)
		return true;
	}
	return false;
};

const getMode = (): string => {
	return this.mode;
};

//endstruct



}
