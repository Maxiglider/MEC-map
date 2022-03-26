import {Make, MakeConsts} from 'core/05_MAKE_STRUCTURES/Make/Make'
import {Text} from "../../01_libraries/Text";

const {MAKE_LAST_CLIC_UNIT_ID} = MakeConsts


export class MakeMonsterSpawn extends Make {
	lastX: number = 0
	lastY: number = 0
	private unitLastClic?: unit
	private lastLocIsSaved: boolean
	private lastLocSavedIsUsed: boolean
	label: string
	mt: MonsterType
	sens: string
	frequence: number


	constructor(maker: unit, label: string, mt: MonsterType, sens: string, frequence: number) {
		super(maker, "monsterSpawnCreate")

		this.label = label
		this.mt = mt
		this.sens = sens
		this.frequence = frequence

		this.lastLocIsSaved = false
		this.lastLocSavedIsUsed = false
	}

	destroy() {
		super.destroy()

		if (this.unitLastClic) {
			RemoveUnit(this.unitLastClic)
		}
	}

	saveLoc(x: number, y: number) {
		this.lastX = x
		this.lastY = y
		this.lastLocIsSaved = true
		this.lastLocSavedIsUsed = true
		if (!this.unitLastClic) {
			this.unitLastClic = CreateUnit(this.makerOwner, MAKE_LAST_CLIC_UNIT_ID, x, y, GetRandomDirectionDeg())
		} else {
			SetUnitX(this.unitLastClic, x)
			SetUnitY(this.unitLastClic, y)
		}

		this.escaper.destroyCancelledActions()
	}

	unsaveLoc() {
		if (!this.lastLocSavedIsUsed) {
			return false
		}
		this.unitLastClic && RemoveUnit(this.unitLastClic)
		delete this.unitLastClic
		this.lastLocSavedIsUsed = false
		return true
	}

	isLastLocSavedUsed() {
		return this.lastLocSavedIsUsed
	}

	cancelLastAction() {
		return this.unsaveLoc()
	}

	redoLastAction() {
		if (!this.lastLocSavedIsUsed && this.lastLocIsSaved) {
			this.saveLoc(this.lastX, this.lastY)
			return true
		}
		return false
	}
	
	doActions() {
		if (super.doBaseActions()) {
			if (this.isLastLocSavedUsed()) {
				const level = this.escaper.getMakingLevel()
				if (level.monsterSpawns.new(this.label, this.mt, this.sens, this.frequence, this.lastX, this.lastY, this.orderX, this.orderY, true)) {
					Text.mkP(this.makerOwner, "monster spawn \"" + this.label + "\" created")
					this.escaper.destroyMake()
				} else {
					Text.erP(this.makerOwner, "impossible to create monster spawn \"" + this.label + "\", label propably already in use")
				}
			}else {
				this.saveLoc(this.orderX, this.orderY)
			}
		}
	}
}