import { BasicFunctions } from '../../01_libraries/Basic_functions'
import {Text} from "../../01_libraries/Text";
import {METEOR_NORMAL} from "../../04_STRUCTURES/Meteor/Meteor";
import { MakeOneByOneOrTwoClicks } from 'core/05_MAKE_STRUCTURES/Make/MakeOneByOneOrTwoClicks'
import {Meteor} from "../../04_STRUCTURES/Meteor/Meteor";

const {IsItemBetweenLocs} = BasicFunctions


class MakeDeleteMeteors extends MakeOneByOneOrTwoClicks{

	constructor(maker: unit, mode: string) {
		super(maker, 'deleteMeteors', mode)
	}

	doActions() {
		if (super.doBaseActions()) {
			//modes : oneByOne, twoClics
			let meteor: Meteor;
			let suppressedMeteors: Meteor[] = []
			let nbMeteorsRemoved = 0;

			if (this.getMode() == 'oneByOne') {
				//mode oneClick
				if ((GetItemTypeId(GetOrderTargetItem()) !== METEOR_NORMAL)) {
					return;
				}

				meteor = Meteor.get(GetItemUserData(GetOrderTargetItem()));

				if (meteor && meteor.getItem() ){
					meteor.removeMeteor()
					suppressedMeteors.push(meteor)
					nbMeteorsRemoved = 1;
				}
			} else {
				//mode twoClics
				if (!this.isLastLocSavedUsed()) {
					this.saveLoc(this.orderX, this.orderY)
					return
				}

				const lastInstanceId = this.escaper.getMakingLevel().meteors.getLastInstanceId()

				for (let i = 0; i <= lastInstanceId; i++) {
					meteor = this.escaper.getMakingLevel().meteors.get(i)
					let meteorItem

					if (meteor && (meteorItem = meteor.getItem()) && IsItemBetweenLocs(meteorItem, this.lastX, this.lastY, this.orderX, this.orderY)) {
						meteor.removeMeteor()
						suppressedMeteors.push(meteor)
						nbMeteorsRemoved = nbMeteorsRemoved + 1;
					}
				}
			}

			if (nbMeteorsRemoved <= 1) {
				Text.mkP(this.makerOwner, I2S(nbMeteorsRemoved) + " meteor removed.")
			} else {
				Text.mkP(this.makerOwner, I2S(nbMeteorsRemoved) + " meteors removed.")
			}

			if (nbMeteorsRemoved > 0) {
				this.escaper.newAction(new MakeDeleteMeteorsAction(this.escaper.getMakingLevel(), suppressedMeteors))
			}
			this.unsaveLocDefinitely()
		}

	}
}
