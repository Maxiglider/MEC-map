import { NB_ESCAPERS } from "core/01_libraries/Constants";
import { Text } from "core/01_libraries/Text";
import { SaveMapInCache } from './SAVE_MAP_in_cache';
import { StringArrayForCache } from "./struct_StringArrayForCache";


const initSaveLevels = () => { // initializer InitStartSaveNextLevel needs Text

// TODO; Used to be private
let levelId: number;
// TODO; Used to be private
let level: Level;
// TODO; Used to be private
let visibilityId: number;
// TODO; Used to be private
let monsterNoMoveId: number;
// TODO; Used to be private
let monsterSimplePatrolId: number;
// TODO; Used to be private
let monsterMultiplePatrolsId: number;
// TODO; Used to be private
let monsterTeleportId: number;
// TODO; Used to be private
let meteorId: number;
// TODO; Used to be private
let monsterSpawnId: number;
// TODO; Used to be private
let casterId: number;
// TODO; Used to be private
const NB_ITEM_TO_SAVE_EACH_TIME = 10;
// TODO; Used to be private
let trg_startSaveNextLevel: trigger;




//casters
// TODO; Used to be private
const SaveCasters_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (casterId > level.casters.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			TriggerExecute(trg_startSaveNextLevel)
			return;
		}
		if ( (level.casters.get(casterId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.casters.get(casterId).toString())
		}
		casterId = casterId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveCasters = (): void => {
	if ( (level.casters.count() == 0) ) {
		TriggerExecute(trg_startSaveNextLevel)
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "casters", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveCasters_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		casterId = 0;
	}
};
///////////////////////////


//monsterSpawns
// TODO; Used to be private
const SaveMonsterSpawns_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (monsterSpawnId > level.monsterSpawns.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveCasters()
			return;
		}
		if ( (level.monsterSpawns.get(monsterSpawnId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.monsterSpawns.get(monsterSpawnId).toString())
		}
		monsterSpawnId = monsterSpawnId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveMonsterSpawns = (): void => {
	if ( (level.monsterSpawns.count() == 0) ) {
		StartSaveCasters()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "monsterSpawns", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveMonsterSpawns_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		monsterSpawnId = 0;
	}
};
///////////////////////////

//meteors
// TODO; Used to be private
const SaveMeteors_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (meteorId > level.meteors.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveMonsterSpawns()
			return;
		}
		if ( (level.meteors.get(meteorId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.meteors.get(meteorId).toString())
		}
		meteorId = meteorId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveMeteors = (): void => {
	if ( (level.meteors.count() == 0) ) {
		StartSaveMonsterSpawns()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "meteors", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveMeteors_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		meteorId = 0;
	}
};
///////////////////////////

//monsters teleport
// TODO; Used to be private
const SaveMonstersTeleport_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (monsterTeleportId > level.monstersTeleport.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveMeteors()
			return;
		}
		if ( (level.monstersTeleport.get(monsterTeleportId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.monstersTeleport.get(monsterTeleportId).toString())
		}
		monsterTeleportId = monsterTeleportId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveMonstersTeleport = (): void => {
	if ( (level.monstersTeleport.count() == 0) ) {
		StartSaveMeteors()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "monstersTeleport", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveMonstersTeleport_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		monsterTeleportId = 0;
	}
};
///////////////////////////

//monsters multiple patrols
// TODO; Used to be private
const SaveMonstersMultiplePatrols_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (monsterMultiplePatrolsId > level.monstersMultiplePatrols.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveMonstersTeleport()
			return;
		}
		if ( (level.monstersMultiplePatrols.get(monsterMultiplePatrolsId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.monstersMultiplePatrols.get(monsterMultiplePatrolsId).toString())
		}
		monsterMultiplePatrolsId = monsterMultiplePatrolsId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveMonstersMultiplePatrols = (): void => {
	if ( (level.monstersMultiplePatrols.count() == 0) ) {
		StartSaveMonstersTeleport()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "monstersMultiplePatrols", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveMonstersMultiplePatrols_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		monsterMultiplePatrolsId = 0;
	}
};
///////////////////////////

//monsters simple patrol
// TODO; Used to be private
const SaveMonstersSimplePatrol_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (monsterSimplePatrolId > level.monstersSimplePatrol.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveMonstersMultiplePatrols()
			return;
		}
		if ( (level.monstersSimplePatrol.get(monsterSimplePatrolId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.monstersSimplePatrol.get(monsterSimplePatrolId).toString())
		}
		monsterSimplePatrolId = monsterSimplePatrolId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveMonstersSimplePatrol = (): void => {
	if ( (level.monstersSimplePatrol.count() == 0) ) {
		StartSaveMonstersMultiplePatrols()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "monstersSimplePatrol", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveMonstersSimplePatrol_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		monsterSimplePatrolId = 0;
	}
};
///////////////////////////

//monsters no move
// TODO; Used to be private
const SaveMonstersNoMove_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (monsterNoMoveId > level.monstersNoMove.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveMonstersSimplePatrol()
			return;
		}
		if ( (level.monstersNoMove.get(monsterNoMoveId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.monstersNoMove.get(monsterNoMoveId).toString())
		}
		monsterNoMoveId = monsterNoMoveId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveMonstersNoMove = (): void => {
	if ( (level.monstersNoMove.count() == 0) ) {
		StartSaveMonstersSimplePatrol()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "monstersNoMove", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveMonstersNoMove_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		monsterNoMoveId = 0;
	}
};
///////////////////////////

//visibilities
// TODO; Used to be private
const SaveVisibilities_Actions = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ITEM_TO_SAVE_EACH_TIME)) break;
		if ( (visibilityId > level.visibilities.getLastInstanceId()) ) {
			StringArrayForCache.stringArrayForCache.writeInCache()
			DisableTrigger(GetTriggeringTrigger())
			StartSaveMonstersNoMove()
			return;
		}
		if ( (level.visibilities.get(visibilityId) != 0) ) {
			StringArrayForCache.stringArrayForCache.push(level.visibilities.get(visibilityId).toString())
		}
		visibilityId = visibilityId + 1;
		i = i + 1;
	}
};

// TODO; Used to be private
const StartSaveVisibilities = (): void => {
	if ( (level.visibilities.count() == 0) ) {
		StartSaveMonstersNoMove()
	} else {
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "visibilities", true)
		TriggerClearActions(SaveMapInCache.trigSaveMapInCache)
		TriggerAddAction(SaveMapInCache.trigSaveMapInCache, SaveVisibilities_Actions)
		EnableTrigger(SaveMapInCache.trigSaveMapInCache)
		visibilityId = 0;
	}
};
///////////////////////////




// TODO; Used to be private
const EndSaveLevel = (): void => {
	Text.A("all levels saved")
	SaveGameCache(saveMap_cache)
	Text.A("SAVING MAP FINISHED")
};

// TODO; Used to be private
const StartSaveLevel = (): void => {
	level = udg_levels.get(levelId)
	if ((level === 0)) {
		EndSaveLevel()
	} else {
		//start message
		if ( (level.getStartMessage() != null and level.getStartMessage() != "") ) {
			StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "startMessage", false)
			StringArrayForCache.stringArrayForCache.push(StringReplace(level.getStartMessage(), ";", ";;", true))
			StringArrayForCache.stringArrayForCache.writeInCache()
		}
		//nb lives earned
		StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "nbLives", false)
		StringArrayForCache.stringArrayForCache.push(I2S(level.getNbLives()))
		StringArrayForCache.stringArrayForCache.writeInCache()
		//start
		if ( (level.getStart() != 0) ) {
			StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "start", false)
			StringArrayForCache.stringArrayForCache.push(level.getStart().toString())
			StringArrayForCache.stringArrayForCache.writeInCache()
		}
		//end
		if ( (level.getEnd() != 0) ) {
			StringArrayForCache.stringArrayForCache = new StringArrayForCache("level" + I2S(levelId), "end", false)
			StringArrayForCache.stringArrayForCache.push(level.getEnd().toString())
			StringArrayForCache.stringArrayForCache.writeInCache()
		}
		//reste :      //visibilities  
		//monstersNoMove  //monstersSimplePatrol  //monstersMultiplePatrols  //meteors  //monsterSpawns
		StartSaveVisibilities()
	}
};


const StartSaveLevels = (): void => {
	let i = 0;
	while (true) {
		if ((i >= NB_ESCAPERS)) break;
		if ( (udg_escapers.get(i) != 0) ) {
 udg_escapers.get(i).destroyMake()
 udg_escapers.get(i).destroyAllSavedActions()
		}
		i = i + 1;
	}
	levelId = 0;
	StartSaveLevel()
};




const StartSaveNextLevel_Actions = (): void => {
	levelId = levelId + 1;
	StartSaveLevel()
};

const InitStartSaveNextLevel = (): void => {
	trg_startSaveNextLevel = CreateTrigger();
	TriggerAddAction(trg_startSaveNextLevel, StartSaveNextLevel_Actions)
};




}
