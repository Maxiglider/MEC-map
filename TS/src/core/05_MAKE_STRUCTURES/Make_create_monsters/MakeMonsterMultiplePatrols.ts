

const initMakeMonsterMultiplePatrols = () => { // needs Make



//struct MakeMonsterMultiplePatrols extends Make

// TODO; Used to be private
     MonsterType mt
// TODO; Used to be private
     string mode //normal ou string
// TODO; Used to be private
     real array lastX
// TODO; Used to be private
     real array lastY
// TODO; Used to be private
	 integer lastLocId
// TODO; Used to be private
	 integer locPointeur
// TODO; Used to be private
     unit unitLastClic
// TODO; Used to be private
     MonsterMultiplePatrols monster
    
	


const getMonsterType = (): MonsterType => {
	return this.mt;
};

const getMode = (): string => {
	return this.mode;
};

const getMonster = (): MonsterMultiplePatrols => {
	return this.monster;
};

// TODO; Used to be static
const create = (maker: unit, mode: string, mt: MonsterType): MakeMonsterMultiplePatrols => {
	let m: MakeMonsterMultiplePatrols;
	if ((maker === null || mt === 0 || (mode !== "normal" && mode !== "string"))) {
		return 0;
	}
	m = MakeMonsterMultiplePatrols.allocate()
	m.maker = maker
	m.makerOwner = GetOwningPlayer(maker)
	m.kind = "monsterCreateMultiplePatrols"
	m.mt = mt
	m.mode = mode
	m.monster = 0
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	m.lastLocId = -1
	m.locPointeur = -1
	return m;
};

const onDestroy = (): void => {
	let escaper: Escaper;
	if ( (this.monster != 0 and this.monster.u != null) ) {
		escaper = EscaperFunctions.Hero2Escaper(this.maker);
 escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), this.monster))
	} else {
 this.monster.destroy()
	}
	DestroyTrigger(this.t)
	this.t = null;
	RemoveUnit(this.unitLastClic)
	this.unitLastClic = null;
	this.maker = null;
};

const nextMonster = (): void => {
	let escaper: Escaper;
	this.lastLocId = -1;
	this.locPointeur = -1;
	RemoveUnit(this.unitLastClic)
	this.unitLastClic = null;
	if ( (this.monster != 0 and this.monster.u != null) ) {
		escaper = EscaperFunctions.Hero2Escaper(this.maker);
 escaper.newAction(MakeMonsterAction.create(escaper.getMakingLevel(), this.monster))
	} else {
 this.monster.destroy()
	}
	this.monster = 0;
};

const getLocPointeur = (): number => {
	return this.locPointeur;
};

const setUnitLastClicPosition = (x: number, y: number): void => {
	if ((this.unitLastClic === null)) {
		this.unitLastClic = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg());
	} else {
		//call SetUnitX(this.unitLastClic, x)
		//call SetUnitY(this.unitLastClic, y)
		SetUnitPosition(this.unitLastClic, x, y)
	}
};

const saveLoc = (x: number, y: number): void => {
	if ( (this.locPointeur >= MonsterMultiplePatrols.NB_MAX_LOC - 1) ) {
		return;
	}
	this.locPointeur = this.locPointeur + 1;
	this.lastX[ this.locPointeur ] = x;
	this.lastY[ this.locPointeur ] = y;
	this.lastLocId = this.locPointeur;
	this.setUnitLastClicPosition(x, y)
 EscaperFunctions.Hero2Escaper(this.maker).destroyCancelledActions()
};

const unsaveLoc = (): boolean => {
	if ((this.locPointeur < 0)) {
		return false;
	}
 this.monster.destroyLastLoc()
	this.locPointeur = this.locPointeur - 1;
	if ((this.locPointeur >= 0)) {
		this.setUnitLastClicPosition(this.lastX[this.locPointeur], this.lastY[this.locPointeur])
	} else {
		RemoveUnit(this.unitLastClic)
		this.unitLastClic = null;
 this.monster.removeUnit()
	}
	return true;
};

const setMonster = (monster: MonsterMultiplePatrols): void => {
	if ((this.monster !== 0)) {
 this.monster.destroy()
	}
	this.monster = monster;
};

const cancelLastAction = (): boolean => {
	return this.unsaveLoc();
};

const redoLastAction = (): boolean => {
	if ((this.locPointeur < this.lastLocId)) {
		this.locPointeur = this.locPointeur + 1;
 this.monster.addNewLoc(this.lastX[this.locPointeur], this.lastY[this.locPointeur])
		this.setUnitLastClicPosition(this.lastX[this.locPointeur], this.lastY[this.locPointeur])
		return true;
	}
	return false;
};

//endstruct



}
