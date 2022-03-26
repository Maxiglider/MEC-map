

const initClearMobArray = () => { // needs ClearMob



//struct ClearMobArray //50 niveaux * 160 monstres

// TODO; Used to be private
     ClearMob array clearMobs [MAX_NB_CLEAR_MOB_BY_LEVEL]
// TODO; Used to be private
	 integer lastInstance
	
// TODO; Used to be static
	 


const create = (): ClearMobArray => {
	local ClearMobArray cma = ClearMobArray.allocate()
	cma.lastInstance = -1
	return cma;
};

const getFirstEmpty = (): number => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance || this.clearMobs[i] === 0)) break;
		i = i + 1;
	}
	return i;
};

const get = (arrayId: number): ClearMob => {
	if ((arrayId < 0 || arrayId > this.lastInstance)) {
		return 0;
	}
	return this.clearMobs[arrayId];
};

const getLastInstanceId = (): number => {
	return this.lastInstance;
};

const new = (triggerMobId: number, disableDuration: number, initialize: boolean): ClearMob => {
	//local integer n = this.getFirstEmpty()
	let n = this.lastInstance + 1;
	if ((n >= MAX_NB_CLEAR_MOB_BY_LEVEL)) {
		return 0;
	}
	//if (n > this.lastInstance) then
	this.lastInstance = n;
	//endif
	this.clearMobs[n] = ClearMob.create(triggerMobId, disableDuration)
	if ((initialize)) {
 this.clearMobs[n].initialize()
	}
	this.clearMobs[n].level = udg_levels.getLevelFromClearMobArray(this)
	this.clearMobs[n].arrayId = n
	return this.clearMobs[n];
};

const count = (): number => {
	let nb = 0;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.clearMobs[i] !== 0)) {
			nb = nb + 1;
		}
		i = i + 1;
	}
	return nb;
};

const onDestroy = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.clearMobs[i] !== 0)) {
 this.clearMobs[i].destroy()
		}
		i = i + 1;
	}
	this.lastInstance = -1;
};

const setClearMobNull = (clearMobArrayId: number): void => {
	this.clearMobs[ clearMobArrayId ] = 0;
};

const clearClearMob = (clearMobId: number): boolean => {
	let i = 0;
	while (true) {
		if ((this.clearMobs[i] === ClearMob(clearMobId) || i > this.lastInstance)) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return false;
	}
 this.clearMobs[i].destroy()
	return true;
};

const getClearMobNear = (x: number, y: number): ClearMob => {
	let xMob: number;
	let yMob: number;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.clearMobs[i] != 0 and this.clearMobs[i].getTriggerMob().getUnit() != null) ) {
			xMob = GetUnitX(this.clearMobs[i].getTriggerMob().getUnit())
			yMob = GetUnitY(this.clearMobs[i].getTriggerMob().getUnit())
			if ((RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX)) {
				return this.clearMobs[i];
			}
		}
		i = i + 1;
	}
	return 0;
};

const initializeClearMobs = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.clearMobs[i] !== 0)) {
 this.clearMobs[i].initialize()
		}
		i = i + 1;
	}
};

const closeClearMobs = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.clearMobs[i] !== 0)) {
 this.clearMobs[i].close()
		}
		i = i + 1;
	}
};

//endstruct


}
