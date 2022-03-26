

const initReinitTerrains = () => { // initializer Init_ReinitTerrains needs AllTerrainFunctions, TerrainModifyingTrig



// TODO; Used to be private
let terrainTypes: Array<TerrainType> = [];
// TODO; Used to be private
let terrainTypeIds: Array<number> = [];
// TODO; Used to be private
let terrainTypeIdsToReplace: Array<number> = [];


// TODO; Used to be private
const SaveTerrainConfig = (): void => {
	let n = 0;
	let i = 0;
	while (true) {
		if (i >= udg_terrainTypes.numberOfWalk) break;
		terrainTypes[n] = udg_terrainTypes.getWalk(i)
		terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
		n = n + 1;
		i = i + 1;
	}
	i = 0;
	while (true) {
		if (i >= udg_terrainTypes.numberOfDeath) break;
		terrainTypes[n] = udg_terrainTypes.getDeath(i)
		terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
		n = n + 1;
		i = i + 1;
	}
	i = 0;
	while (true) {
		if (i >= udg_terrainTypes.numberOfSlide) break;
		terrainTypes[n] = udg_terrainTypes.getSlide(i)
		terrainTypeIds[n] = terrainTypes[n].getTerrainTypeId()
		n = n + 1;
		i = i + 1;
	}
};


const Init_ReinitTerrains = (): void => {
	let trig = CreateTrigger();
	TriggerAddAction(trig, SaveTerrainConfig)
	TriggerRegisterTimerEvent(trig, 0, false)
	trig = null;
};






const ReinitTerrains_Actions = (): void => {
	let x: number;
	let terrainTypeId: number;
	let done: boolean;
	let j: number;
	//local integer i = 1
	//loop
	//exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
	x = MAP_MIN_X;
	while (true) {
		if ((x > MAP_MAX_X)) break;
		terrainTypeId = GetTerrainType(x, y);
		done = false;
		j = 0;
		while (true) {
			if ((terrainTypes[j] === 0 || done)) break;
			if ((terrainTypeId === terrainTypeIdsToReplace[j])) {
				ChangeTerrainType(x, y, terrainTypeIds[j])
				done = true;
			}
			j = j + 1;
		}
		x = x + LARGEUR_CASE;
	}
	y = y + LARGEUR_CASE;
	if ((y > MAP_MAX_Y)) {
		DisableTrigger(GetTriggeringTrigger())
		RestartEnabledCheckTerrainTriggers()
		terrainModifyWorking = false;
		Text_mkA("Terrains reinitialized")
		return;
	}
	//i = i + 1
	//endloop
};


// TODO; Used to be private
const StartTerrainModifying = (): void => {
	StopEnabledCheckTerrainTriggers()
	TriggerClearActions(gg_trg_Terrain_modifying_trig)
	TriggerAddAction(gg_trg_Terrain_modifying_trig, ReinitTerrains_Actions)
	y = MAP_MIN_Y;
	EnableTrigger(gg_trg_Terrain_modifying_trig)
	terrainModifyWorking = true;
};


const ReinitTerrains = (): void => {
	let i: number;

	if ((terrainModifyWorking)) {
		Text_erA("can't execute two commands of this type simultaneously !")
		return;
	}

	i = 0;
	while (true) {
		if ((terrainTypes[i] === 0)) break;
		terrainTypeIdsToReplace[i] = terrainTypes[i].getTerrainTypeId()
 terrainTypes[i].setTerrainTypeId(terrainTypeIds[i])
		i = i + 1;
	}
	StartTerrainModifying()
};




}
