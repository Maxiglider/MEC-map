

const initCasterArray = () => { // needs Caster


//struct CasterArray //50 niveaux * 500 monstres

// TODO; Used to be private
     Caster array casters [MAX_NB_MONSTERS]
// TODO; Used to be private
	 integer lastInstance
	
// TODO; Used to be static
	 


const create = (): CasterArray => {
	local CasterArray ca = CasterArray.allocate()
	ca.lastInstance = -1
	return ca;
};

const getFirstEmpty = (): number => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance || this.casters[i] === 0)) break;
		i = i + 1;
	}
	return i;
};

const get = (arrayId: number): Caster => {
	if ((arrayId < 0 || arrayId > this.lastInstance)) {
		return 0;
	}
	return this.casters[arrayId];
};

const getLastInstanceId = (): number => {
	return this.lastInstance;
};

const new = (casterType: CasterType, x: number, y: number, angle: number, enable: boolean): Caster => {
	//local integer n = this.getFirstEmpty()
	let n = this.lastInstance + 1;
	if ((n >= MAX_NB_MONSTERS)) {
		return 0;
	}
	//if (n > this.lastInstance) then
	this.lastInstance = n;
	//endif
	this.casters[n] = Caster.create(casterType, x, y, angle)
	if ((enable)) {
 this.casters[n].enable()
	}
	this.casters[n].level = udg_levels.getLevelFromCasterArray(this)
	this.casters[n].arrayId = n
	return this.casters[n];
};

const count = (): number => {
	let nb = 0;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.casters[i] !== 0)) {
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
		if ((this.casters[i] !== 0)) {
 this.casters[i].destroy()
		}
		i = i + 1;
	}
	this.lastInstance = -1;
};

const setCasterNull = (casterArrayId: number): void => {
	this.casters[ casterArrayId ] = 0;
};

const clearCaster = (casterId: number): boolean => {
	let i = 0;
	while (true) {
		if ((this.casters[i] === Caster(casterId) || i > this.lastInstance)) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return false;
	}
 this.casters[i].destroy()
	return true;
};

const getCasterNear = (x: number, y: number): Caster => {
	let xCaster: number;
	let yCaster: number;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.casters[i] != 0 and this.casters[i].casterUnit != null) ) {
			xCaster = GetUnitX(this.casters[i].casterUnit)
			yCaster = GetUnitY(this.casters[i].casterUnit)
			if ((RAbsBJ(x - xCaster) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yCaster) < MONSTER_NEAR_DIFF_MAX)) {
				return this.casters[i];
			}
		}
		i = i + 1;
	}
	return 0;
};

const createCasters = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.casters[i] !== 0)) {
 this.casters[i].enable()
		}
		i = i + 1;
	}
};

const removeCasters = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.casters[i] !== 0)) {
 this.casters[i].disable()
		}
		i = i + 1;
	}
};

const refreshCastersOfType = (casterType: CasterType): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.casters[i] != 0 and this.casters[i].getCasterType() == casterType and this.casters[i].casterUnit != null) ) {
 this.casters[i].refresh()
		}
		i = i + 1;
	}
};

const removeCastersOfType = (casterType: CasterType): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.casters[i] != 0 and this.casters[i].getCasterType() == casterType) ) {
 this.casters[i].destroy()
		}
		i = i + 1;
	}
};

//endstruct



}
