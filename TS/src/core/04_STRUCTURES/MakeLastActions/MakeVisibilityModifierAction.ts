

const initMakeVisibilityModifierAction = () => { // needs MakeAction



//struct MakeVisibilityModifierAction extends MakeAction

// TODO; Used to be private
     Level level
// TODO; Used to be private
     VisibilityModifier visibilityModifierSave
// TODO; Used to be private
     VisibilityModifier visibilityModifierPointeur //pointe vers le vm effectif
    
    


const getLevel = (): Level => {
	return this.level;
};

// TODO; Used to be static
const create = (level: Level, visibilityModifier: VisibilityModifier): MakeVisibilityModifierAction => {
	let a: MakeVisibilityModifierAction;
	if ((visibilityModifier === 0)) {
		return 0;
	}
	a = MakeVisibilityModifierAction.allocate()
	a.isActionMadeB = true
	a.level = level
	a.visibilityModifierSave = 0
	a.visibilityModifierPointeur = visibilityModifier
	return a;
};

const onDestroy = (): void => {
	if ((this.visibilityModifierSave !== 0)) {
 this.visibilityModifierSave.destroy()
	}
};

const cancel = (): boolean => {
	if ((!this.isActionMadeB)) {
		return false;
	}
	this.visibilityModifierSave = this.visibilityModifierPointeur.copy()
 this.visibilityModifierPointeur.destroy()
	this.isActionMadeB = false;
 Text_mkP(this.owner.getPlayer(), "visibility creation cancelled")
	return true;
};

const redo = (): boolean => {
	if ((this.isActionMadeB)) {
		return false;
	}
	this.visibilityModifierPointeur = this.level.newVisibilityModifierFromExisting(this.visibilityModifierSave)
	if ((this.visibilityModifierPointeur === 0)) {
 Text_erP(this.owner.getPlayer(), "can't recreate visibility, full for this level")
	} else {
 this.visibilityModifierPointeur.activate(true)
	}
	this.visibilityModifierSave = 0;
	this.isActionMadeB = true;
 Text_mkP(this.owner.getPlayer(), "visibility creation redone")
	return true;
};

//endstruct




}
