import {Make} from 'core/05_MAKE_STRUCTURES/Make/Make'
import {MakeConsts} from "core/05_MAKE_STRUCTURES/Make/Make";
const {MAKE_LAST_CLIC_UNIT_ID} = MakeConsts
import {EscaperFunctions} from "../../04_STRUCTURES/Escaper/Escaper_functions";
const {Hero2Escaper} = EscaperFunctions

class MakeMonsterSpawn extends Make {
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
}