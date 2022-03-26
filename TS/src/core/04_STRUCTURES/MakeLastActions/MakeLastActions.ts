

const initMakeLastActions = () => { // needs Text


// TODO; Used to be private
const NB_MAX_ACTIONS_SAVED = 30;



//struct MakeLastActions

// TODO; Used to be private
     MakeAction array lastActions [NB_MAX_ACTIONS_SAVED]
// TODO; Used to be private
     integer lastActionId
// TODO; Used to be private
     integer lastActionEffective //anciennement appelé "pointeur"
// TODO; Used to be private
     Escaper owner
    
// TODO; Used to be static
     


const create = (owner: Escaper): MakeLastActions => {
	local MakeLastActions la = MakeLastActions.allocate()
	la.lastActionId = -1
	la.lastActionEffective = -1
	la.owner = owner
	return la;
};

// TODO; Used to be private
const onDestroy = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastActionId)) break;
 this.lastActions[i].destroy()
		i = i + 1;
	}
};

const newAction = (action: MakeAction): MakeAction => {
	let i: number;
	if ((this.lastActionEffective < this.lastActionId)) {
		//suppression des actions annulées (à l'ajout d'une nouvelle action)
		i = this.lastActionEffective + 1;
		while (true) {
			if ((i > this.lastActionId)) break;
 this.lastActions[i].destroy()
			i = i + 1;
		}
	}
	if ((this.lastActionEffective === NB_MAX_ACTIONS_SAVED - 1)) {
		//suppression de la plus ancienne des actions et décalage de tout le tableau
 this.lastActions[0].destroy()
		i = 0;
		while (true) {
			if ((i === NB_MAX_ACTIONS_SAVED - 1)) break;
			this.lastActions[ i ] = this.lastActions[i + 1];
			i = i + 1;
		}
	} else {
		this.lastActionEffective = this.lastActionEffective + 1;
	}
	//sauvegarde de l'action
	this.lastActions[ this.lastActionEffective ] = action;
	this.lastActionId = this.lastActionEffective;
	//assignation du "owner" de l'action
	action.owner = this.owner
	return action;
};

const cancelLastAction = (): boolean => {
	if ((this.lastActionEffective < 0)) {
		return false;
	}
	if ((this.lastActions[this.lastActionEffective] === 0)) {
 Text.erP(this.owner.getPlayer(), "action obsolète")
	} else {
		//annulation de l'action
		if ( (not this.lastActions[this.lastActionEffective].cancel()) ) {
 Text.erA("error : action already cancelled for player " + I2S(GetPlayerId(this.owner.getPlayer())))
		}
	}
	this.lastActionEffective = this.lastActionEffective - 1;
	return true;
};

const redoLastAction = (): boolean => {
	if ((this.lastActionEffective === this.lastActionId)) {
		return false;
	}
	this.lastActionEffective = this.lastActionEffective + 1;
	if ((this.lastActions[this.lastActionEffective] === 0)) {
 Text.erP(this.owner.getPlayer(), "action obsolète")
	} else {
		//réexécution de l'action
		if ( (not this.lastActions[this.lastActionEffective].redo()) ) {
 Text.erA("error : action already redone for player " + I2S(GetPlayerId(this.owner.getPlayer())))
		}
	}
	return true;
};

const deleteSpecificActionsForLevel = (level: Level): void => {
	//actions spécifiques à un niveau :
	//MakeMonsterAction
	//MakeDeleteMonstersAction
	//MakeVisibilityModifierAction
	//MakeMeteorAction
	//MakeDeleteMeteorsAction
	//MakeCasterAction
	//MakeDeleteCastersAction
	//////
	let i = 0;
	while (true) {
		if ((i > this.lastActionId)) break;
		if ( (this.lastActions[i].getType() == MakeMonsterAction.typeid) ) {
			if ( (MakeMonsterAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
			} else if ( (this.lastActions[i].getType() == MakeDeleteMonstersAction.typeid) ) {
			if ( (MakeDeleteMonstersAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
			} else if ( (this.lastActions[i].getType() == MakeVisibilityModifierAction.typeid) ) {
			if ( (MakeVisibilityModifierAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
			} else if ( (this.lastActions[i].getType() == MakeMeteorAction.typeid) ) {
			if ( (MakeMeteorAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
			} else if ( (this.lastActions[i].getType() == MakeDeleteMeteorsAction.typeid) ) {
			if ( (MakeDeleteMeteorsAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
			} else if ( (this.lastActions[i].getType() == MakeCasterAction.typeid) ) {
			if ( (MakeCasterAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
			} else if ( (this.lastActions[i].getType() == MakeDeleteCastersAction.typeid) ) {
			if ( (MakeDeleteCastersAction(integer(this.lastActions[i])).getLevel() == level) ) {
 this.lastActions[i].destroy()
				this.lastActions[ i ] = 0;
			}
		}
		i = i + 1;
	}
};

const destroyCancelledActions = (): void => {
	if ((this.lastActionEffective === this.lastActionId)) {
		return;
	}
	while (true) {
		if ((this.lastActionId <= this.lastActionEffective)) break;
 this.lastActions[this.lastActionId].destroy()
		this.lastActionId = this.lastActionId - 1;
	}
};

const destroyAllActions = (): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastActionId)) break;
 this.lastActions[i].destroy()
		i = i + 1;
	}
	this.lastActionId = -1;
	this.lastActionEffective = -1;
};

//endstruct



}
