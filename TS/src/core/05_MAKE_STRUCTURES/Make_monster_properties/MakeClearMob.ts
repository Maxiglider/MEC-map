import { Text } from 'core/01_libraries/Text';
import {Make} from 'core/05_MAKE_STRUCTURES/Make/Make'
import {Monster} from "../../04_STRUCTURES/Monster/Monster";


class MakeClearMob extends Make {

	private disableDuration: number
	private clearMob?: ClearMob
	private blockMobs: Map<number, Monster>
	private indexLastBlockNotCancelledMob: number
	private triggerMob?: Monster


	constructor(maker: unit, disableDuration: number) {
		super(maker, "createClearMob")

		if (disableDuration !== 0 && (disableDuration > CLEAR_MOB_MAX_DURATION || disableDuration < ClearMob_FRONT_MONTANT_DURATION)) {
			throw "ClearMob : wrong duration"
		}

		this.disableDuration = disableDuration
		this.blockMobs = new Map<number, Monster>()
		this.indexLastBlockNotCancelledMob = 0
	}

	private createClearMob() {
		this.clearMob = this.escaper.getMakingLevel().clearMobs.new(this.triggerMob, this.disableDuration, true)
	}

	private addBlockMob(monster:  Monster) {
		this.clearMob.addBlockMob(monster)

		//clear entries after the last not cancelled mob
		let found = this.indexLastBlockNotCancelledMob == 0
		for(let mobIndex of this.blockMobs.keys()) {
			if (found) {
				this.blockMobs.delete(mobIndex)
			} else {
				found = mobIndex == this.indexLastBlockNotCancelledMob
			}
		}

		//add the block mob
		this.blockMobs.set(monster.getIndex(), monster)
	}

	private cancelLastNotCancelledBlockMob() {
		if(this.clearMob.removeLastBlockMob()) {
			if (this.indexLastBlockNotCancelledMob == 0) {
				return true
			}

			let found = false
			let nothingMoreToCancel = true

			for (let mobIndex of Array.from(this.blockMobs.keys()).reverse()) {
				if (found) {
					this.indexLastBlockNotCancelledMob = mobIndex
					nothingMoreToCancel = false
				} else {
					found = mobIndex == this.indexLastBlockNotCancelledMob
				}
			}

			if (nothingMoreToCancel) {
				this.indexLastBlockNotCancelledMob = 0
			}
			 return true
		}

		return false
	}

	private redoLastCancelledBlockMob() {
		//find the last cancelled
		let found = this.indexLastBlockNotCancelledMob == 0
		for(let entry of this.blockMobs.entries()) {
			const mobIndex = entry[0]
			if (found) {
				//readd the block mob
				const monster = entry[1]
				this.blockMobs.set(mobIndex, monster)

				return true
			} else {
				found = mobIndex == this.indexLastBlockNotCancelledMob
			}
		}

		return false
	}

	clickMade(monster: Monster){
		if (!this.clearMob){
			//creation of the clearMob
			this.triggerMob = monster
			this.createClearMob()
			Text.mkP(this.makerOwner, "trigger mob added for a new clear mob")
		} else {
			//vérification que le clear mob existe toujours
			if ((this.clearMob.getTriggerMob())) {
				Text.erP(this.makerOwner, "the clear mob you are working on has been removed")
				this.escaper.destroyMake()
				return
			}
			if ((this.clearMob.getBlockMobs().containsMob(monster))) {
				Text.erP(this.makerOwner, "this monster is already a block mob of this clear mob")
				return;
			} else {
				this.addBlockMob(monster)
				Text.mkP(this.makerOwner, "block mob added")
			}
		}
	};

	doActions() {
		//recherche du monstre cliqué
		const monster = this.escaper.getMakingLevel().getMonsterNear(this.orderX, this.orderY)

		//application du clic
		if (!monster) {
			Text.erP(this.makerOwner, "no monster clicked for your making level")
		} else {
			this.clickMade(monster)
		}
	}

	cancelLastAction() {
		if (this.clearMob) {
			if(this.cancelLastNotCancelledBlockMob()) {
				Text.mkP(this.makerOwner, "last block mob removed")
			}else {
				this.clearMob.destroy()
				delete this.clearMob
				Text.mkP(this.makerOwner, "clear mob removed")
			}

			return true
		}else {
			return false
		}
	}

	redoLastAction(){
		if(!this.clearMob) {
			if (this.triggerMob) {
				this.createClearMob()
				Text.mkP(this.makerOwner, "trigger mob added for a new clear mob")
				return true
			} else {
				return false
			}
		}else if (this.redoLastCancelledBlockMob()) {
				Text.mkP(this.makerOwner, "block mob added")
			return true
		} else {
			return false
		}
	}

}


