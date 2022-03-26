

const initChangeOneTerrain = () => { // needs AllTerrainFunctions, TerrainModifyingTrig


// TODO; Used to be private
let oldTerrain: number;
// TODO; Used to be private
let newTerrain: number;




const ChangeAppearanceOfOneTerrain_Actions = (): void => {
	let x: number;
	//local integer i = 1
	//loop
	//exitwhen (i > TERRAIN_MODIFYING_NB_LINES_TO_DO)
	x = MAP_MIN_X;
	while (true) {
		if ((x > MAP_MAX_X)) break;
		if ((GetTerrainType(x, y) === oldTerrain)) {
			ChangeTerrainType(x, y, newTerrain)
		}
		x = x + LARGEUR_CASE;
	}
	y = y + LARGEUR_CASE;
	if ((y > MAP_MAX_Y)) {
		DisableTrigger(GetTriggeringTrigger())
		RestartEnabledCheckTerrainTriggers()
		terrainModifyWorking = false;
		return;
	}
	//i = i + 1
	//endloop
};


// TODO; Used to be private
const StartTerrainModifying = (): void => {
	StopEnabledCheckTerrainTriggers()
	TriggerClearActions(gg_trg_Terrain_modifying_trig)
	TriggerAddAction(gg_trg_Terrain_modifying_trig, ChangeAppearanceOfOneTerrain_Actions)
	y = MAP_MIN_Y;
	EnableTrigger(gg_trg_Terrain_modifying_trig)
	terrainModifyWorking = true;
};


const ChangeOneTerrain = (terrainTypeLabel: string, newTerrainType: string): string => {
	let terrainType: TerrainType;
	if ((terrainModifyWorking)) {
		Text.erA("can't execute two commands of this type simultaneously !")
		return null;
	}
	terrainType = udg_terrainTypes.get(terrainTypeLabel)
	if ((terrainType === 0)) {
		return null;
	}
	oldTerrain = terrainType.getTerrainTypeId()
	newTerrain = TerrainTypeString2TerrainTypeId(newTerrainType);
	if ((newTerrain === 0)) {
		return null;
	}
	if ( (udg_terrainTypes.isTerrainTypeIdAlreadyUsed(newTerrain)) ) {
		return null;
	}
	if ( (not terrainType.setTerrainTypeId(newTerrain)) ) {
		return null;
	}

	StartTerrainModifying()
	return GetTerrainData(newTerrain);
};




}



