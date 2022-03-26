

const initMeteorArray = () => { // needs Meteor

// TODO; Used to be private
const MAX_NB_METEORS = 100;



//struct MeteorArray //50 niveaux * 100 météores

// TODO; Used to be private
     Meteor array meteors [MAX_NB_METEORS]
// TODO; Used to be private
     integer lastInstance
    
// TODO; Used to be static
	 


const create = (): MeteorArray => {
	local MeteorArray ma = MeteorArray.allocate()
	ma.lastInstance = -1
	return ma;
};

const getFirstEmpty = (): number => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance || this.meteors[i] === 0)) break;
		i = i + 1;
	}
	return i;
};

const get = (arrayId: number): Meteor => {
	if ((arrayId < 0 || arrayId > this.lastInstance)) {
		return 0;
	}
	return this.meteors[arrayId];
};

const new = (x: number, y: number, createMeteor: boolean): Meteor => {
	//local integer n = this.getFirstEmpty()
	let n = this.lastInstance + 1;
	if ((n >= MAX_NB_METEORS)) {
		return 0;
	}
	//if (n > this.lastInstance) then
	this.lastInstance = n;
	//endif
	this.meteors[n] = Meteor.create(x, y)
	if ((createMeteor)) {
 this.meteors[n].createMeteor()
	}
	this.meteors[n].level = udg_levels.getLevelFromMeteorArray(this)
	this.meteors[n].arrayId = n
	return this.meteors[n];
};

const setMeteorNull = (arrayId: number): void => {
	this.meteors[ arrayId ] = 0;
};

const count = (): number => {
	let n = 0;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.meteors[i] !== 0)) {
			n = n + 1;
		}
		i = i + 1;
	}
	return n;
};

const onDestroy = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.meteors[i] !== 0)) {
 this.meteors[i].destroy()
		}
		i = i + 1;
	}
	this.lastInstance = -1;
};

const clearMeteor = (meteorId: number): boolean => {
	let i = 0;
	while (true) {
		if ((this.meteors[i] === Meteor(meteorId) || i > this.lastInstance)) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return false;
	}
 this.meteors[i].destroy()
	this.meteors[ i ] = 0;
	return true;
};

const createMeteors = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.meteors[i] !== 0)) {
 this.meteors[i].createMeteor()
		}
		i = i + 1;
	}
};

const removeMeteors = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.meteors[i] !== 0)) {
 this.meteors[i].removeMeteor()
		}
		i = i + 1;
	}
};

const getMeteorNear = (x: number, y: number): Meteor => {
	let xMeteor: number;
	let yMeteor: number;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.meteors[i] != 0 and this.meteors[i].getItem() != null) ) {
			xMeteor = GetItemX(this.meteors[i].getItem())
			yMeteor = GetItemY(this.meteors[i].getItem())
			if ((RAbsBJ(x - xMeteor) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMeteor) < MONSTER_NEAR_DIFF_MAX)) {
				return this.meteors[i];
			}
		}
		i = i + 1;
	}
	return 0;
};

const getLastInstanceId = (): number => {
	return this.lastInstance;
};

//endstruct




}

