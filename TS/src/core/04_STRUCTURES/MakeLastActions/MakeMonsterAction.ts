

const initMakeMonsterAction = () => { // needs MakeAction



//struct MakeMonsterAction extends MakeAction

// TODO; Used to be private
     Monster monster
// TODO; Used to be private
     Level level
    
    


const getLevel = (): Level => {
	return this.level;
};

// TODO; Used to be static
const create = (level: Level, monster: Monster): MakeMonsterAction => {
	let a: MakeMonsterAction;
	if ( (monster == 0 or monster.u == null) ) {
		return 0;
	}
	a = MakeMonsterAction.allocate()
	a.isActionMadeB = true
	a.monster = monster
	a.level = level
	return a;
};

const onDestroy = (): void => {
	if ((!this.isActionMadeB)) {
 this.monster.destroy()
	}
};

const cancel = (): boolean => {
	if ((!this.isActionMadeB)) {
		return false;
	}
 this.monster.removeUnit()
	this.isActionMadeB = false;
 Text.mkP(this.owner.getPlayer(), "monster creation cancelled")
	return true;
};

const redo = (): boolean => {
	if ((this.isActionMadeB)) {
		return false;
	}
 this.monster.createUnit()
	this.isActionMadeB = true;
 Text.mkP(this.owner.getPlayer(), "monster creation redone")
	return true;
};

//endstruct




}
