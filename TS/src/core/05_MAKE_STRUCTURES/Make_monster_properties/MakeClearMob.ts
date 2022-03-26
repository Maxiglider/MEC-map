

const initMakeClearMob = () => { // needs Make, ClearMob



//struct MakeClearMob extends Make

// TODO; Used to be private
     real disableDuration
// TODO; Used to be private
     ClearMob clearMob
// TODO; Used to be private
     integer array clickedMobs[500]
// TODO; Used to be private
     integer lastClickedMobInd
// TODO; Used to be private
     integer pointeurClickedMob
	
// TODO; Used to be static
	 


const create = (maker: unit, disableDuration: number): MakeClearMob => {
	let m: MakeClearMob;
	if ((maker === null || (disableDuration !== 0 && (disableDuration > CLEAR_MOB_MAX_DURATION || disableDuration < ClearMob_FRONT_MONTANT_DURATION)))) {
		return 0;
	}
	m = MakeClearMob.allocate()
	m.maker = maker
	m.makerOwner = GetOwningPlayer(maker)
	m.kind = "createClearMob"
	m.t = CreateTrigger()
 TriggerAddAction(m.t, Make_GetActions(m.kind))
 TriggerRegisterUnitEvent(m.t, maker, EVENT_UNIT_ISSUED_POINT_ORDER)
	m.lastClickedMobInd = -1
	m.pointeurClickedMob = -1
	m.disableDuration = disableDuration
	m.clearMob = 0
	return m;
};

const onDestroy = (): void => {
	DestroyTrigger(this.t)
	this.t = null;
	this.maker = null;
};

const clickMade = (monsterOrCasterId: number): void => {
	let escaper = Hero2Escaper(this.maker);
	if ((this.pointeurClickedMob === -1)) {
		if ((ClearTriggerMobId2ClearMob(monsterOrCasterId) !== 0)) {
			Text.erP(this.makerOwner, "this monster is already a trigger mob of a clear mob")
			return;
		} else {
			this.clearMob = escaper.getMakingLevel().clearMobs.new(monsterOrCasterId, this.disableDuration, true)
			Text.mkP(this.makerOwner, "trigger mob added for a new clear mob")
		}
	} else {
		//vérification que le clear mob existe toujours
		if ( (this.clearMob.getTriggerMob() == 0) ) {
			Text.erP(this.makerOwner, "the clear mob you are working on has been removed")
 escaper.destroyMake()
			return;
		}
		if ( (this.clearMob.getBlockMobs().containsMob(monsterOrCasterId)) ) {
			Text.erP(this.makerOwner, "this monster is already a block mob of this clear mob")
			return;
		} else {
 this.clearMob.addBlockMob(monsterOrCasterId)
			Text.mkP(this.makerOwner, "block mob added")
		}
	}
	this.pointeurClickedMob = this.pointeurClickedMob + 1;
	this.lastClickedMobInd = this.pointeurClickedMob;
};

const cancelLastAction = (): boolean => {
	if ((this.pointeurClickedMob > 0)) {
		if ( (this.clearMob.removeLastBlockMob()) ) {
			Text.mkP(this.makerOwner, "last block mob removed")
		} else {
			Text.erP(this.makerOwner, "error, couldn't remove the last block mob")
		}
	} else if ((this.pointeurClickedMob === 0)) {
 this.clearMob.destroy()
		Text.mkP(this.makerOwner, "clear mob removed")
	} else {
		return false;
	}
	this.pointeurClickedMob = this.pointeurClickedMob - 1;
	return true;
};

const redoLastAction = (): boolean => {
	let escaper = Hero2Escaper(this.maker);
	if ((this.pointeurClickedMob === this.lastClickedMobInd)) {
		return false;
	}
	this.pointeurClickedMob = this.pointeurClickedMob + 1;
	if ((this.pointeurClickedMob > 0)) {
		if ( (this.clearMob.addBlockMob(this.clickedMobs[this.pointeurClickedMob])) ) {
			Text.mkP(this.makerOwner, "block mob added")
		} else {
			Text.erP(this.makerOwner, "error, couldn't add the block mob")
		}
	} else {
		this.clearMob = escaper.getMakingLevel().clearMobs.new(this.clickedMobs[this.pointeurClickedMob], this.disableDuration, true)
		Text.mkP(this.makerOwner, "trigger mob added for a new clear mob")
	}
	return true;
};

//endstruct



}

