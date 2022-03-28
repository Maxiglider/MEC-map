

const initMakeMeteorAction = () => { // needs MakeAction



//struct MakeMeteorAction extends MakeAction

// TODO; Used to be private
     Meteor meteor
// TODO; Used to be private
     Level level
    
    


const getLevel = (): Level => {
	return this.level;
};

// TODO; Used to be static
const create = (level: Level, meteor: Meteor): MakeMeteorAction => {
	let a: MakeMeteorAction;
	if ( (meteor == 0 or meteor.getItem() == null) ) {
		return 0;
	}
	a = MakeMeteorAction.allocate()
	a.isActionMadeB = true
	a.meteor = meteor
	a.level = level
	return a;
};

const onDestroy = () => {
	if ((!this.isActionMadeB)) {
 this.meteor.destroy()
	}
};

const cancel = (): boolean => {
	if ((!this.isActionMadeB)) {
		return false;
	}
 this.meteor.removeMeteor()
	this.isActionMadeB = false;
 Text.mkP(this.owner.getPlayer(), "meteor creation cancelled")
	return true;
};

const redo = (): boolean => {
	if ((this.isActionMadeB)) {
		return false;
	}
 this.meteor.createMeteor()
	this.isActionMadeB = true;
 Text.mkP(this.owner.getPlayer(), "meteor creation redone")
	return true;
};

//endstruct




}
