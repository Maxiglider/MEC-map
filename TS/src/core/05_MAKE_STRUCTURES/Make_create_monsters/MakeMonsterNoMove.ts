

const initMakeMonsterNoMove = () => { // needs Make




//struct MakeMonsterNoMove extends Make    

// TODO; Used to be private
     MonsterType mt
// TODO; Used to be private
     real facingAngle
    
    


const getMonsterType = (): MonsterType => {
	return this.mt;
};

const getFacingAngle = (): number => {
	return this.facingAngle;
};

// TODO; Used to be static
const create = (maker: unit, mt: MonsterType, facingAngle: number): MakeMonsterNoMove => {
	let m: MakeMonsterNoMove;
	if ((maker === null || mt === 0)) {
		return 0;
	}
	m = MakeMonsterNoMove.allocate()
	m.maker = maker
	m.kind = "monsterCreateNoMove"
	m.mt = mt
	m.facingAngle = facingAngle
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, m.maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	return m;
};

const onDestroy = () => {
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

