

const initMonsterOrCaster = () => { // needs Monster


//struct MonsterOrCaster

// TODO; Used to be private
     Monster monster
// TODO; Used to be private
     Caster caster
    
// TODO; Used to be static
     


const create = (mobId: number): MonsterOrCaster => {
	let moc: MonsterOrCaster;
	let monster = MonsterId2Monster(mobId);
	let caster: Caster;
	if ((monster !== 0)) {
		moc = MonsterOrCaster.allocate()
		moc.monster = monster
		moc.caster = 0
	} else {
		caster = CasterId2Caster(mobId);
		if ((caster !== 0)) {
			moc = MonsterOrCaster.allocate()
			moc.monster = 0
			moc.caster = caster
		} else {
			moc = 0;
		}
	}
	return moc;
};

const getId = (): number => {
	if ((this.monster !== 0)) {
		return this.monster.getId()
	} else if ((this.caster !== 0)) {
		return this.caster.getId()
	}
	return 0;
};

const killUnit = () => {
	if ((this.monster !== 0)) {
 this.monster.killUnit()
	} else if ((this.caster !== 0)) {
 this.caster.killUnit()
	}
};

const temporarilyDisable = (disablingTimer: timer) => {
	if ((this.monster !== 0)) {
 this.monster.temporarilyDisable(disablingTimer)
	} else if ((this.caster !== 0)) {
 this.caster.temporarilyDisable(disablingTimer)
	}
};

const temporarilyEnable = (enablingTimer: timer) => {
	if ((this.monster !== 0)) {
 this.monster.temporarilyEnable(enablingTimer)
	} else if ((this.caster !== 0)) {
 this.caster.temporarilyEnable(enablingTimer)
	}
};

const setBaseColor = (colorString: string) => {
	if ((this.monster !== 0)) {
 this.monster.setBaseColor(colorString)
	} else if ((this.caster !== 0)) {
 this.caster.setBaseColor(colorString)
	}
};

const setVertexColor = (vcRed: number, vcGreen: number, vcBlue: number) => {
	if ((this.monster !== 0)) {
 this.monster.setVertexColor(vcRed, vcGreen, vcBlue)
	} else if ((this.caster !== 0)) {
 this.caster.setVertexColor(vcRed, vcGreen, vcBlue)
	}
};

const reinitColor = () => {
	if ((this.monster !== 0)) {
 this.monster.reinitColor()
	} else if ((this.caster !== 0)) {
 this.caster.reinitColor()
	}
};

const getUnit = (): unit => {
	if ((this.monster !== 0)) {
		return this.monster.u
	} else if ((this.caster !== 0)) {
		return this.caster.casterUnit
	}
	return null;
};

const copy = (): MonsterOrCaster => {
	return MonsterOrCaster.create(this.getId())
};

const getMonsterType = (): MonsterType => {
	if ((this.monster !== 0)) {
		return this.monster.getMonsterType()
	} else if ((this.caster !== 0)) {
		return this.caster.getCasterType().getCasterMonsterType()
	}
	return 0;
};

//endstruct



}
