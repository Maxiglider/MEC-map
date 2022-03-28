

const initMonsterOrCasterStack = () => { //

// TODO; Used to be private
let udg_enumMoc: MonsterOrCaster;

const GetEnumMoc = (): MonsterOrCaster => {
	return udg_enumMoc;
};


//struct MonsterOrCasterStack

// TODO; Used to be private
     MonsterOrCaster monsterOrCaster
// TODO; Used to be private
     MonsterOrCasterStack nextElement

// TODO; Used to be static
     


const create = (monsterOrCaster: MonsterOrCaster): MonsterOrCasterStack => {
	let mocs: MonsterOrCasterStack;
	if ((monsterOrCaster === 0)) {
		return 0;
	}
	mocs = MonsterOrCasterStack.allocate()
	mocs.monsterOrCaster = monsterOrCaster
	mocs.nextElement = 0
	return mocs;
};

const addMonsterOrCaster = (monsterOrCaster: MonsterOrCaster): boolean => {
	let newElement: MonsterOrCasterStack;
	if ((monsterOrCaster === 0)) {
		return false;
	}
	newElement = this.create(this.monsterOrCaster);
	newElement.nextElement = this.nextElement
	this.monsterOrCaster = monsterOrCaster;
	this.nextElement = newElement;
	return true;
};

const onDestroy = () => {
 this.monsterOrCaster.destroy()
	if ((this.nextElement !== 0)) {
 this.nextElement.destroy()
	}
};

const executeForAll = (functionName: string) => {
	udg_enumMoc = this.monsterOrCaster;
	ExecuteFunc(functionName)
	if ((this.nextElement !== 0)) {
 this.nextElement.executeForAll(functionName)
	}
};

const containsMob = (mobId: number): boolean => {
	if ( (this.monsterOrCaster.getId() == mobId) ) {
		return true;
	} else if ((this.nextElement !== 0)) {
		return this.nextElement.containsMob(mobId)
	} else {
		return false;
	}
};

const getLast = (): MonsterOrCaster => {
	return this.monsterOrCaster;
};

const removeLast = (): boolean => {
	let oldNextElement = this.nextElement;
	if ((this.monsterOrCaster === 0)) {
		return false;
	}
 this.monsterOrCaster.destroy()
	if ((this.nextElement !== 0)) {
		this.monsterOrCaster = this.nextElement.getLast().copy()
		this.nextElement = this.nextElement.nextElement
		this.nextElement.nextElement = 0
 this.nextElement.destroy()
	} else {
		this.monsterOrCaster = 0;
	}
	return true;
};

//endstruct


}
