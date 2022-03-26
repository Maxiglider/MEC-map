

const initReinitTerrainsPositions = () => { // initializer Init_Reinit_terrains_position_Change_variations_and_ut_at_beginning needs AllTerrainFunctions, TerrainModifyingTrig


// TODO; Used to be private
let TERRAIN_SAVE: Array<TerrainType> = [];
// TODO; Used to be private
let terrainSave_id: number;



//save terrain at init



// TODO; Used to be private
const SaveTerrain_Actions = (): void => {
	let terrainType: number;
	let x = MAP_MIN_X;
	while (true) {
		if ((x > MAP_MAX_X)) break;
		terrainType = GetTerrainType(x, y);
		//mise à jour used terrain (-ut)
		AddNewTerrain(terrainType)
		//changer variations
		ChangeTerrainType(x, y, terrainType)
		//sauvegarde du terrain
		TERRAIN_SAVE[ terrainSave_id ] = TerrainTypeId2TerrainType(terrainType);
		terrainSave_id = terrainSave_id + 1;
		x = x + LARGEUR_CASE;
	}

	y = y + LARGEUR_CASE;
	if ((y > MAP_MAX_Y)) {
		terrainModifyWorking = false;
		DisableTrigger(GetTriggeringTrigger())
		return;
	}
};


// TODO; Used to be private
const StartSaveTerrain = (): void => {
	TriggerClearActions(gg_trg_Terrain_modifying_trig)
	TriggerAddAction(gg_trg_Terrain_modifying_trig, SaveTerrain_Actions)
	terrainSave_id = 0;
	y = MAP_MIN_Y;
	EnableTrigger(gg_trg_Terrain_modifying_trig)
	terrainModifyWorking = true;
	DestroyTrigger(GetTriggeringTrigger())
};


const Init_Reinit_terrains_position_Change_variations_and_ut_at_beginning = (): void => {
	let trig = CreateTrigger();
	TriggerAddAction(trig, StartSaveTerrain)
	TriggerRegisterTimerEvent(trig, 0, false)
	trig = null;
};



//=========================================================================


//reinitTerrainPositions


const ReinitTerrainsPosition_Actions = (): void => {
	let x: number;
	//local integer i = 1
	//loop
	//exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
	x = MAP_MIN_X;
	while (true) {
		if ((x > MAP_MAX_X)) break;
		if ( (TERRAIN_SAVE[terrainSave_id] != 0 and TERRAIN_SAVE[terrainSave_id].getTerrainTypeId() != 0) ) {
 ChangeTerrainType(x, y, TERRAIN_SAVE[terrainSave_id].getTerrainTypeId())
		}
		terrainSave_id = terrainSave_id + 1;
		x = x + LARGEUR_CASE;
	}
	y = y + LARGEUR_CASE;
	if ((y > MAP_MAX_Y)) {
		Text_mkA("Terrains position reinitialized !")
		DisableTrigger(GetTriggeringTrigger())
		terrainModifyWorking = false;
		RestartEnabledCheckTerrainTriggers()
		return;
	}
	//i = i + 1
	//endloop
};



// TODO; Used to be private
const StartTerrainModifying = (): void => {
	TriggerClearActions(gg_trg_Terrain_modifying_trig)
	TriggerAddAction(gg_trg_Terrain_modifying_trig, ReinitTerrainsPosition_Actions)
	terrainSave_id = 0;
	y = MAP_MIN_Y;
	EnableTrigger(gg_trg_Terrain_modifying_trig)
	terrainModifyWorking = true;
	StopEnabledCheckTerrainTriggers()
};





const ReinitTerrainsPosition = (): void => {
	if ((terrainModifyWorking)) {
		Text_erA("can't execute two commands of this type simultaneously !")
		return;
	}
	StartTerrainModifying()
};






}
