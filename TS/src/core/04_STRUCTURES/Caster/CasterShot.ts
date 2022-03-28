

const initCasterShot = () => { // initializer InitCasterShot needs MonsterCreationFunctions


// TODO; Used to be private
let shotsHashtable: hashtable;
// TODO; Used to be private
const PERIOD = 0.01;



// TODO; Used to be private
const CasterShot_Actions = () => {
	let shot = CasterShot(LoadInteger(shotsHashtable, 0, GetHandleId(GetTriggeringTrigger())));
	shot.x = shot.x + shot.diffX
	shot.y = shot.y + shot.diffY
	if ( (shot.x >= MAP_MIN_X and shot.x <= MAP_MAX_X) ) {
 SetUnitX(shot.unite, shot.x)
	}
	if ( (shot.y >= MAP_MIN_Y and shot.y <= MAP_MAX_Y) ) {
 SetUnitY(shot.unite, shot.y)
	}
	shot.nbTeleportationsRestantes = shot.nbTeleportationsRestantes - 1
	if ( (shot.nbTeleportationsRestantes == 0) ) {
 shot.destroy()
	}
};



//struct CasterShot

    real x
    real y
    real diffX
    real diffY
    integer nbTeleportationsRestantes
    unit unite
// TODO; Used to be private
     trigger trig

// TODO; Used to be static
     


const create = (monsterType: MonsterType, Xdep: number, Ydep: number, angle: number, speed: number, portee: number): CasterShot => {
	local CasterShot t = CasterShot.allocate()
	t.x = Xdep
	t.y = Ydep
	t.diffX = speed * CosBJ(angle) * PERIOD
	t.diffY = speed * SinBJ(angle) * PERIOD
	t.nbTeleportationsRestantes = R2I((portee / speed) / PERIOD)
	t.unite = NewImmobileMonster(monsterType, Xdep, Ydep, angle)
	t.trig = CreateTrigger()
 TriggerRegisterTimerEvent(t.trig, PERIOD, true)
 TriggerAddAction(t.trig, function CasterShot_Actions)
 SaveInteger(shotsHashtable, 0, GetHandleId(t.trig), t)
	return t;
};

const onDestroy = () => {
	RemoveUnit(this.unite)
	this.unite = null;
	DestroyTrigger(this.trig)
	this.trig = null;
};

//endstruct


//===========================================================================
const InitCasterShot = () => {
	shotsHashtable = InitHashtable();
};



}
