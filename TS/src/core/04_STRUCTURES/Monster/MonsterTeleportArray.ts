

const initMonsterTeleportArray = () => { // needs MonsterTeleport


//struct MonsterTeleportArray //50 niveaux * 500 monstres

// TODO; Used to be private
     MonsterTeleport array monsters [MAX_NB_MONSTERS]
// TODO; Used to be private
	 integer lastInstance
	
// TODO; Used to be static
	 


const create = (): MonsterTeleportArray => {
	local MonsterTeleportArray ma = MonsterTeleportArray.allocate()
	ma.lastInstance = -1
	return ma;
};

const getFirstEmpty = (): number => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance || this.monsters[i] === 0)) break;
		i = i + 1;
	}
	return i;
};

const get = (arrayId: number): MonsterTeleport => {
	if ((arrayId < 0 || arrayId > this.lastInstance)) {
		return 0;
	}
	return this.monsters[arrayId];
};

const getLastInstanceId = (): number => {
	return this.lastInstance;
};

const new = (mt: MonsterType, period: number, angle: number, mode: string, createUnit: boolean): MonsterTeleport => {
	let n: number;
	if (((mode !== "normal" && mode !== "string") || period < MONSTER_TELEPORT_PERIOD_MIN || period > MONSTER_TELEPORT_PERIOD_MAX)) {
		return 0;
	}
	//n = this.getFirstEmpty()
	n = this.lastInstance + 1;
	if ((n >= MAX_NB_MONSTERS)) {
		return 0;
	}
	//if (n > this.lastInstance) then
	this.lastInstance = n;
	//endif
	this.monsters[n] = MonsterTeleport.create(mt, period, angle, mode)
	if ((createUnit)) {
 this.monsters[n].createUnit()
	}
	this.monsters[n].level = udg_levels.getLevelFromMonsterTeleportArray(this)
	this.monsters[n].arrayId = n
	return this.monsters[n];
};

const count = (): number => {
	let nb = 0;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.monsters[i] !== 0)) {
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
		if ((this.monsters[i] !== 0)) {
 this.monsters[i].destroy()
		}
		i = i + 1;
	}
	this.lastInstance = -1;
};

const setMonsterNull = (monsterArrayId: number): void => {
	this.monsters[ monsterArrayId ] = 0;
};

const clearMonster = (monsterId: number): boolean => {
	let i = 0;
	while (true) {
		if ((this.monsters[i] === MonsterTeleport(monsterId) || i > this.lastInstance)) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return false;
	}
 this.monsters[i].destroy()
	return true;
};

const getMonsterNear = (x: number, y: number): MonsterTeleport => {
	let xMob: number;
	let yMob: number;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.monsters[i] != 0 and this.monsters[i].u != null) ) {
			xMob = GetUnitX(this.monsters[i].u)
			yMob = GetUnitY(this.monsters[i].u)
			if ((RAbsBJ(x - xMob) < MONSTER_NEAR_DIFF_MAX && RAbsBJ(y - yMob) < MONSTER_NEAR_DIFF_MAX)) {
				return this.monsters[i];
			}
		}
		i = i + 1;
	}
	return 0;
};

const createMonsters = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.monsters[i] !== 0)) {
 this.monsters[i].createUnit()
		}
		i = i + 1;
	}
};

const removeMonsters = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ((this.monsters[i] !== 0)) {
 this.monsters[i].removeUnit()
		}
		i = i + 1;
	}
};

const recreateMonstersOfType = (mt: MonsterType): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.monsters[i] != 0 and this.monsters[i].getMonsterType() == mt and this.monsters[i].u != null) ) {
 this.monsters[i].createUnit()
		}
		i = i + 1;
	}
};

const removeMonstersOfType = (mt: MonsterType): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		if ( (this.monsters[i] != 0 and this.monsters[i].getMonsterType() == mt) ) {
 this.monsters[i].destroy()
		}
		i = i + 1;
	}
};

//endstruct


}
