

const initLevelArray = () => { // needs Level


const NB_MAX_LEVELS = 50;


//struct LevelArray

// TODO; Used to be private
	 Level array levels [NB_MAX_LEVELS]
// TODO; Used to be private
	 integer currentLevel
// TODO; Used to be private
	 integer lastInstance
	
	
// TODO; Used to be static
	 


const create = (): LevelArray => {
	let x1 = GetRectMinX(gg_rct_departLvl_0);
	let y1 = GetRectMinY(gg_rct_departLvl_0);
	let x2 = GetRectMaxX(gg_rct_departLvl_0);
	let y2 = GetRectMaxY(gg_rct_departLvl_0);
	local LevelArray la = LevelArray.allocate()
	la.levels[0] = Level.create()
 la.levels[0].newStart(x1, y1, x2, y2)
 la.levels[0].setNbLivesEarned(NB_LIVES_AT_BEGINNING)
 la.levels[0].activate(true)
	la.currentLevel = 0
	la.lastInstance = 0
	return la;
};

const goToLevel = (finisher: Escaper, levelId: number): boolean => {
	let xCam: number;
	let yCam: number;
	let i: number;
	let previousLevelId = this.currentLevel;
	if ((levelId < 0 || levelId > this.lastInstance || levelId === this.currentLevel)) {
		return false;
	}
	this.currentLevel = levelId;
	if ((previousLevelId !== NB_MAX_LEVELS)) {
		if ((!IsLevelBeingMade(this.levels[previousLevelId]))) {
 udg_escapers.destroyMakesIfForSpecificLevel_currentLevel()
 this.levels[previousLevelId].activate(false)
		}
	}
 this.levels[this.currentLevel].activate(true)
 this.levels[this.currentLevel].checkpointReviveHeroes(finisher)
	if ((previousLevelId !== NB_MAX_LEVELS)) {
		if ((levelId > previousLevelId + 1)) {
			i = previousLevelId + 1;
			while (true) {
				if ((i >= levelId)) break;
 this.levels[i].activateVisibilities(true)
				i = i + 1;
			}
		} else {
			if ((levelId < previousLevelId)) {
				i = levelId + 1;
				while (true) {
					if ((i > previousLevelId)) break;
 this.levels[i].activateVisibilities(false)
					i = i + 1;
				}
			}
		}
	}
	xCam = this.levels[levelId].getStart().getCenterX()
	yCam = this.levels[levelId].getStart().getCenterY()
	if ((finisher !== 0)) {
 MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
	} else {
		SetCameraPosition(xCam, yCam)
	}
	return true;
};

const goToNextLevel = (finisher: Escaper): boolean => {
	let xCam: number;
	let yCam: number;
	if ((this.currentLevel >= this.lastInstance)) {
		return false;
	}
	this.currentLevel = this.currentLevel + 1;
	if ((!IsLevelBeingMade(this.levels[this.currentLevel - 1]))) {
 udg_escapers.destroyMakesIfForSpecificLevel_currentLevel()
 this.levels[this.currentLevel - 1].activate(false)
	}
 this.levels[this.currentLevel].activate(true)
 this.levels[this.currentLevel].checkpointReviveHeroes(finisher)
	xCam = this.levels[this.currentLevel].getStart().getCenterX()
	yCam = this.levels[this.currentLevel].getStart().getCenterY()
	if ((finisher !== 0)) {
 MoveCamExceptForPlayer(finisher.getPlayer(), xCam, yCam)
 Text.A(udg_colorCode[GetPlayerId(finisher.getPlayer())] + "Good job " + GetPlayerName(finisher.getPlayer()) + " !")
	} else {
		SetCameraPosition(xCam, yCam)
	}
	return true;
};

const restartTheGame = (): void => {
	if ((this.currentLevel === 0)) {
		this.currentLevel = NB_MAX_LEVELS;
 this.levels[0].activate(false)
	}
	this.goToLevel(0, 0)
 udg_lives.setNb(this.levels[0].getNbLives())
 SetCameraPosition(this.levels[0].getStart().getCenterX(), this.levels[0].getStart().getCenterY())
	//coop
	TriggerExecute(gg_trg_apparition_dialogue_et_fermeture_automatique)
};

const new = (): boolean => {
	if ((this.lastInstance >= NB_MAX_LEVELS - 1)) {
		return false;
	}
	this.lastInstance = this.lastInstance + 1;
	this.levels[this.lastInstance] = Level.create()
	return true;
};

const destroyLastLevel = (): boolean => {
	if ((this.lastInstance <= 0)) {
		return false;
	}
 this.levels[this.lastInstance].destroy()
	this.lastInstance = this.lastInstance - 1;
	return true;
};

const count = (): number => {
	return this.lastInstance + 1;
};

const getCurrentLevel = (): Level => {
	return this.levels[this.currentLevel];
};

const get = (levelId: number): Level => {
	if ((levelId > this.lastInstance || levelId < 0)) {
		return 0;
	}
	return this.levels[levelId];
};

const getLevelFromMonsterNoMoveArray = (ma: MonsterNoMoveArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].monstersNoMove == ma) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromMonsterSimplePatrolArray = (ma: MonsterSimplePatrolArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].monstersSimplePatrol == ma) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromMonsterMultiplePatrolsArray = (ma: MonsterMultiplePatrolsArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].monstersMultiplePatrols == ma) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromMonsterTeleportArray = (ma: MonsterTeleportArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].monstersTeleport == ma) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromMonsterSpawnArray = (msa: MonsterSpawnArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].monsterSpawns == msa) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromMeteorArray = (ma: MeteorArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].meteors == ma) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromVisibilityModifierArray = (vma: VisibilityModifierArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].visibilities == vma) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromCasterArray = (casterArray: CasterArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].casters == casterArray) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};
const getLevelFromClearMobArray = (clearMobArray: ClearMobArray): Level => {
	let i = 0;
	while (true) {
		if (i > this.lastInstance or this.levels[i].clearMobs == clearMobArray) break;
		i = i + 1;
	}
	if ((i > this.lastInstance)) {
		return 0;
	}
	return this.levels[i];
};

const removeMonstersOfType = (mt: MonsterType): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
 this.levels[i].removeMonstersOfType(mt)
		i = i + 1;
	}
};

const removeCastersOfType = (ct: CasterType): void => {
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
 this.levels[i].removeCastersOfType(ct)
		i = i + 1;
	}
};

const getLastLevelId = (): number => {
	return this.lastInstance;
};

const getNbMonsters = (mode: string): number => {
	//modes : all, moving, not moving
	let nb = 0;
	let i = 0;
	while (true) {
		if ((i > this.lastInstance)) break;
		nb = nb + this.levels[i].getNbMonsters(mode)
		i = i + 1;
	}
	return nb;
};

//endstruct



const ForceGetLevel = (levelId: number): Level => {
	let i: number;
	let lastInstance: number;
	if ((levelId < 0 || levelId >= NB_MAX_LEVELS)) {
		return 0;
	}
	if ((udg_levels === 0)) {
		udg_levels = LevelArray.create()
	}
	lastInstance = udg_levels.getLastLevelId()
	while (true) {
		if ((lastInstance >= levelId)) break;
 udg_levels.new()
		lastInstance = udg_levels.getLastLevelId()
	}
	return udg_levels.get(levelId)
};



}
